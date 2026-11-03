
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { monuments, categories, regions, type Monument } from '@/lib/monuments';

type MapStyle = 'street' | 'satellite';

const MAP_ID = 'journey-route';

function distanceBetween(a: Monument, b: Monument) {
  const rad = (n: number) => (n * Math.PI) / 180;
  const [lon1, lat1] = a.coordinates;
  const [lon2, lat2] = b.coordinates;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function formatDistance(value: number) {
  return value < 1 ? `${Math.round(value * 1000)} m` : `${value.toFixed(1)} km`;
}

export default function MapView() {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [mapReady, setMapReady] = useState(false);
  const [styleReady, setStyleReady] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>('street');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [region, setRegion] = useState('All regions');
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [journey, setJourney] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  // Restore visited monuments.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bharat-darshan-visited');
      if (saved) setVisited(JSON.parse(saved));
    } catch {
      setVisited([]);
    }
  }, []);

  // Save visited monuments.
  useEffect(() => {
    localStorage.setItem(
      'bharat-darshan-visited',
      JSON.stringify(visited)
    );
  }, [visited]);

  // Search and filter the monument collection.
  const filteredMonuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return monuments.filter((m) => {
      const matchesSearch =
        !query ||
        m.name.toLowerCase().includes(query) ||
        m.hindi.includes(search.trim()) ||
        m.city.toLowerCase().includes(query) ||
        m.state.toLowerCase().includes(query);

      const matchesCategory =
        category === 'All categories' || m.category === category;

      const matchesRegion =
        region === 'All regions' || m.region === region;

      const matchesUnesco = !unescoOnly || m.unesco;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesRegion &&
        matchesUnesco
      );
    });
  }, [search, category, region, unescoOnly]);

  const selectedMonument = monuments.find((m) => m.slug === selected);

  const journeyMonuments = journey
    .map((slug) => monuments.find((m) => m.slug === slug))
    .filter((m): m is Monument => Boolean(m));

  const journeyDistance = journeyMonuments.reduce(
    (total, monument, index) =>
      index === 0
        ? total
        : total + distanceBetween(journeyMonuments[index - 1], monument),
    0
  );

  const toggleJourney = useCallback((slug: string) => {
    setJourney((previous) => {
      if (previous.includes(slug)) {
        return previous.filter((item) => item !== slug);
      }

      if (previous.length >= 5) {
        setMessage('You can select a maximum of 5 monuments.');
        return previous;
      }

      setMessage('');
      return [...previous, slug];
    });
  }, []);

  const toggleVisited = useCallback((slug: string) => {
    setVisited((previous) =>
      previous.includes(slug)
        ? previous.filter((item) => item !== slug)
        : [...previous, slug]
    );
  }, []);

  // Create the MapLibre map.
  useEffect(() => {
    if (!mapElement.current) return;

    if (!apiKey) {
      setMessage('Add NEXT_PUBLIC_MAPTILER_KEY to your .env.local file.');
      return;
    }

    const map = new maplibregl.Map({
      container: mapElement.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [78.5, 22.5],
      zoom: 4.2,
      minZoom: 3,
      maxZoom: 18,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    map.on('load', () => {
      setMapReady(true);
      setStyleReady(true);
      setMessage('');
    });

    map.on('error', (event) => {
      console.error('Map error:', event.error);
      setMessage('Map could not load. Check your internet connection and MapTiler key.');
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [apiKey]);

  // Change between street and satellite maps.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !apiKey) return;

    const styleUrl =
      mapStyle === 'satellite'
        ? `https://api.maptiler.com/maps/satellite/style.json?key=${apiKey}`
        : `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;

    setStyleReady(false);
    map.setStyle(styleUrl);

    map.once('style.load', () => {
      setStyleReady(true);
    });
  }, [mapStyle, mapReady, apiKey]);

  
  // Display custom monument markers with photo popups.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    filteredMonuments.forEach((monument) => {
      // Create the custom marker.
      const element = document.createElement('button');
      element.type = 'button';
      element.className = [
        'bd-monument-marker',
        monument.unesco ? 'unesco-marker' : '',
        journey.includes(monument.slug) ? 'journey-marker' : '',
        selected === monument.slug ? 'active-marker' : '',
      ].filter(Boolean).join(' ');

      element.title = monument.name;
      element.setAttribute('aria-label', `View ${monument.name}`);
      element.dataset.slug = monument.slug;

      // Monument photograph inside the marker.
      const image = document.createElement('img');
      image.src = monument.image;
      image.alt = monument.name;

      image.onerror = () => {
        image.style.display = 'none';
        element.classList.add('marker-no-image');
      };

      element.appendChild(image);

      // Build the popup safely using DOM elements.
      const popupContent = document.createElement('div');
      popupContent.className = 'bd-marker-popup';

      const popupImage = document.createElement('img');
      popupImage.src = monument.image;
      popupImage.alt = monument.name;
      popupImage.className = 'bd-popup-image';

      popupImage.onerror = () => {
        popupImage.style.display = 'none';
      };

      const popupInfo = document.createElement('div');
      popupInfo.className = 'bd-popup-info';

      const popupTag = document.createElement('span');
      popupTag.className = 'bd-popup-tag';
      popupTag.textContent = monument.unesco
        ? 'UNESCO HERITAGE'
        : monument.category.toUpperCase();

      const popupName = document.createElement('h3');
      popupName.textContent = monument.name;

      const popupHindi = document.createElement('p');
      popupHindi.className = 'bd-popup-hindi';
      popupHindi.textContent = monument.hindi;

      const popupLocation = document.createElement('p');
      popupLocation.className = 'bd-popup-location';
      popupLocation.textContent = `${monument.city}, ${monument.state}`;

      const popupPeriod = document.createElement('p');
      popupPeriod.className = 'bd-popup-period';
      popupPeriod.textContent = `${monument.category} · ${monument.period}`;

      const popupLink = document.createElement('a');
      popupLink.href = `/monument/${monument.slug}`;
      popupLink.textContent = 'Explore monument ↗';

      popupInfo.append(
        popupTag,
        popupName,
        popupHindi,
        popupLocation,
        popupPeriod,
        popupLink
      );

      popupContent.append(popupImage, popupInfo);

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true,
        maxWidth: '320px',
        className: 'bd-heritage-popup',
      }).setDOMContent(popupContent);

      const marker = new maplibregl.Marker({
        element,
        anchor: 'bottom',
      })
        .setLngLat(monument.coordinates)
        .setPopup(popup)
        .addTo(map);

      element.addEventListener('click', () => {
        setSelected(monument.slug);

        map.flyTo({
          center: monument.coordinates,
          zoom: 12,
          speed: 1.2,
        });
      });

      markersRef.current.push(marker);
    });

  }, [filteredMonuments, mapReady, journey]);
  // Update selected marker styling without rebuilding markers.
useEffect(() => {
  if (!mapElement.current) return;

  const markerElements =
    mapElement.current.querySelectorAll<HTMLElement>(
      '.bd-monument-marker'
    );

  markerElements.forEach((element) => {
    element.classList.toggle(
      'active-marker',
      element.dataset.slug === selected
    );
  });
}, [selected, mapReady]);

  // Draw the selected journey as a connected line.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !styleReady || !map.isStyleLoaded()) return;

    const drawRoute = () => {
      if (map.getLayer(MAP_ID)) map.removeLayer(MAP_ID);
      if (map.getSource(MAP_ID)) map.removeSource(MAP_ID);

      if (journeyMonuments.length < 2) return;

      const coordinates = journeyMonuments.map((m) => m.coordinates);

      map.addSource(MAP_ID, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates,
          },
        },
      });

      map.addLayer({
        id: MAP_ID,
        type: 'line',
        source: MAP_ID,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#d8ad63',
          'line-width': 4,
          'line-opacity': 0.9,
        },
      });
    };

    drawRoute();
  }, [journey, mapReady, styleReady]);

  const focusMonument = (monument: Monument) => {
    setSelected(monument.slug);
    mapRef.current?.flyTo({
      center: monument.coordinates,
      zoom: 12,
      speed: 1.2,
    });
  };

  const showJourney = () => {
    if (!mapRef.current || journeyMonuments.length === 0) return;

    if (journeyMonuments.length === 1) {
      focusMonument(journeyMonuments[0]);
      return;
    }

    const bounds = new maplibregl.LngLatBounds();

    journeyMonuments.forEach((m) => bounds.extend(m.coordinates));

    mapRef.current.fitBounds(bounds, {
      padding: 90,
      maxZoom: 8,
      duration: 1200,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All categories');
    setRegion('All regions');
    setUnescoOnly(false);
  };

  return (
    <section className="bd-map-page">
      <header className="bd-map-heading">
        <div>
          <span className="bd-map-eyebrow">EXPLORE INCREDIBLE INDIA</span>
          <h1>Heritage Atlas</h1>
          <p>Discover India's monuments, stories and architectural heritage.</p>
        </div>

        <div className="bd-map-count">
          <strong>{filteredMonuments.length}</strong>
          <span>of {monuments.length} monuments</span>
        </div>
      </header>

      <div className="bd-map-toolbar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search in English, Hindi, city or state..."
          aria-label="Search monuments"
        />

        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option>All categories</option>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select value={region} onChange={(event) => setRegion(event.target.value)}>
          <option>All regions</option>
          {regions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <label className="bd-unesco-filter">
          <input
            type="checkbox"
            checked={unescoOnly}
            onChange={(event) => setUnescoOnly(event.target.checked)}
          />
          UNESCO only
        </label>

        <button type="button" onClick={clearFilters}>
          Reset
        </button>
      </div>

      <div className="bd-map-layout">
        <div className="bd-map-main">
          <div className="bd-map-style-controls">
            <button
              type="button"
              className={mapStyle === 'street' ? 'active' : ''}
              onClick={() => setMapStyle('street')}
            >
              Street
            </button>
            <button
              type="button"
              className={mapStyle === 'satellite' ? 'active' : ''}
              onClick={() => setMapStyle('satellite')}
            >
              Satellite
            </button>
          </div>

          <div ref={mapElement} className="bd-map-canvas" />

          {message && <div className="bd-map-message">{message}</div>}

          <div className="bd-map-legend">
            <span><i className="unesco-dot" /> UNESCO heritage</span>
            <span><i className="other-dot" /> Other monuments</span>
            <span><i className="journey-dot" /> My Journey</span>
          </div>
        </div>

        <aside className="bd-map-directory">
          <div className="bd-directory-heading">
            <div>
              <span className="bd-map-eyebrow">DISCOVER</span>
              <h2>Monuments</h2>
            </div>
            <span>{filteredMonuments.length} places</span>
          </div>

          <div className="bd-monument-list">
            {filteredMonuments.map((monument) => {
              const inJourney = journey.includes(monument.slug);
              const isVisited = visited.includes(monument.slug);

              return (
                <article
                  key={monument.slug}
                  className={`bd-monument-row ${selected === monument.slug ? 'selected' : ''}`}
                >
                  <button
                    type="button"
                    className="bd-monument-select"
                    onClick={() => focusMonument(monument)}
                  >
                    <span className="bd-monument-name">{monument.name}</span>
                    <span className="bd-monument-hindi">{monument.hindi}</span>
                    <span className="bd-monument-location">
                      {monument.city}, {monument.state}
                    </span>
                    <span className="bd-monument-meta">
                      {monument.category} · {monument.period}
                    </span>
                    {monument.unesco && <span className="bd-unesco-tag">UNESCO</span>}
                  </button>

                  <div className="bd-monument-actions">
                    <button
                      type="button"
                      onClick={() => toggleJourney(monument.slug)}
                    >
                      {inJourney ? '✓ Added' : '+ Journey'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVisited(monument.slug)}
                    >
                      {isVisited ? '✓ Visited' : 'Mark visited'}
                    </button>
                  </div>
                </article>
              );
            })}

            {filteredMonuments.length === 0 && (
              <p className="bd-empty-results">No monuments match your search.</p>
            )}
          </div>
        </aside>
      </div>

      {selectedMonument && (
        <section className="bd-selected-card">
          <img
            src={selectedMonument.image}
            alt={selectedMonument.name}
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden';
            }}
          />

          <div>
            <span className="bd-map-eyebrow">MONUMENT DETAILS</span>
            <h2>{selectedMonument.name}</h2>
            <p>{selectedMonument.hindi}</p>
            <p>{selectedMonument.city}, {selectedMonument.state}</p>
            <p>{selectedMonument.description}</p>
            <a href={`/monument/${selectedMonument.slug}`}>
              Explore full history ↗
            </a>
          </div>

          <button type="button" onClick={() => setSelected(null)}>
            Close
          </button>
        </section>
      )}

      <section className="bd-journey-panel">
        <div className="bd-journey-heading">
          <div>
            <span className="bd-map-eyebrow">PLAN YOUR EXPLORATION</span>
            <h2>My Journey</h2>
            <p>Select up to five monuments to create your heritage journey.</p>
          </div>
          <strong>{journey.length}/5 selected</strong>
        </div>

        {journeyMonuments.length === 0 ? (
          <p className="bd-journey-empty">
            Your journey is empty. Add monuments from the directory to begin.
          </p>
        ) : (
          <>
            <ol className="bd-journey-stops">
              {journeyMonuments.map((monument, index) => (
                <li key={monument.slug}>
                  <span className="bd-stop-number">{index + 1}</span>
                  <div>
                    <strong>{monument.name}</strong>
                    <span>{monument.city}, {monument.state}</span>
                    {index > 0 && (
                      <small>
                        Approx. {formatDistance(
                          distanceBetween(journeyMonuments[index - 1], monument)
                        )} from previous stop
                      </small>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleJourney(monument.slug)}
                    aria-label={`Remove ${monument.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ol>

            <div className="bd-journey-summary">
              <span>
                Approximate total distance: <strong>{formatDistance(journeyDistance)}</strong>
              </span>
              <button type="button" onClick={showJourney}>
                Show journey on map
              </button>
              <button type="button" onClick={() => setJourney([])}>
                Clear journey
              </button>
            </div>
          </>
        )}

        {message && <p className="bd-map-notice">{message}</p>}
      </section>

      <section className="bd-visited-summary">
        <div>
          <span className="bd-map-eyebrow">YOUR PROGRESS</span>
          <h2>Visited Monuments</h2>
          <p>{visited.length} of {monuments.length} monuments visited</p>
        </div>

        <div className="bd-progress-track">
          <div
            style={{
              width: `${(visited.length / monuments.length) * 100}%`,
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => setVisited([])}
          disabled={visited.length === 0}
        >
          Reset visited list
        </button>
      </section>
    </section>
  );
}
