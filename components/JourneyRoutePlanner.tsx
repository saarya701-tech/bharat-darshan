
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeftRight, Clock3, MapPin, Route, Sparkles } from 'lucide-react';
import type { Monument } from '@/lib/monuments';

type Schedule = {
  day: number;
  minutes: number;
};

type RouteLeg = {
  from: string;
  to: string;
  distance: number;
  duration: number;
};

type Props = {
  monuments: Monument[];
  tripDays: number;
  allocations: Record<string, Schedule>;
};

type RouteResult = {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  legs: RouteLeg[];
};

const MAP_ID = 'bd-road-route';

function formatDistance(metres: number) {
  return metres >= 1000
    ? `${(metres / 1000).toFixed(1)} km`
    : `${Math.round(metres)} m`;
}

function formatTime(seconds: number) {
  const minutes = Math.round(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours && remaining) return `${hours} hr ${remaining} min`;
  if (hours) return `${hours} hr`;
  return `${minutes} min`;
}

function getPermutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];

  return items.flatMap((item, index) =>
    getPermutations(items.filter((_, i) => i !== index))
      .map(rest => [item, ...rest])
  );
}

export default function JourneyRoutePlanner({
  monuments,
  tripDays,
  allocations,
}: Props) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [activeDay, setActiveDay] = useState(1);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimising, setOptimising] = useState(false);
  const [message, setMessage] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [routeOrder, setRouteOrder] = useState<Record<number, string[]>>({});

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  const dayStops = useMemo(() => {
    const ordered = routeOrder[activeDay];

    const assigned = monuments.filter((monument, index) => {
      const assignedDay = Math.min(
        tripDays,
        Math.max(1, allocations[monument.slug]?.day ?? ((index % tripDays) + 1))
      );

      return assignedDay === activeDay;
    });

    if (!ordered) return assigned;

    return [...assigned].sort(
      (a, b) => ordered.indexOf(a.slug) - ordered.indexOf(b.slug)
    );
  }, [monuments, tripDays, allocations, activeDay, routeOrder]);

  // Create the route map.
  useEffect(() => {
    if (!mapElement.current || !apiKey) return;

    const map = new maplibregl.Map({
      container: mapElement.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [78.5, 22.5],
      zoom: 4,
      minZoom: 3,
      maxZoom: 18,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => setMapReady(true));

    map.on('error', event => {
      console.error('Route map error:', event.error);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [apiKey]);

  // Show numbered monument markers with visible names.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // Remove markers from the previous day.
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    dayStops.forEach((monument, index) => {
      const element = document.createElement('div');

      element.style.display = 'flex';
      element.style.flexDirection = 'column';
      element.style.alignItems = 'center';
      element.style.gap = '5px';
      element.style.width = 'max-content';
      element.style.pointerEvents = 'none';

      const number = document.createElement('div');
      number.textContent = String(index + 1);
      number.style.width = '30px';
      number.style.height = '30px';
      number.style.borderRadius = '50%';
      number.style.display = 'grid';
      number.style.placeItems = 'center';
      number.style.background = '#8b2635';
      number.style.color = '#ffffff';
      number.style.border = '3px solid #fff4df';
      number.style.fontWeight = '800';
      number.style.fontSize = '13px';
      number.style.boxShadow = '0 2px 8px rgba(0,0,0,0.45)';

      const label = document.createElement('div');
      label.textContent = monument.name;
      label.style.padding = '5px 9px';
      label.style.borderRadius = '5px';
      label.style.background = '#fff4df';
      label.style.color = '#492b25';
      label.style.border = '1px solid #a77b43';
      label.style.fontSize = '12px';
      label.style.fontWeight = '700';
      label.style.whiteSpace = 'nowrap';
      label.style.boxShadow = '0 2px 7px rgba(0,0,0,0.3)';

      element.append(number, label);

      const marker = new maplibregl.Marker({
        element,
        anchor: 'bottom',
      })
        .setLngLat(monument.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [dayStops, mapReady]);

  // Fetch an actual road route for the selected day.
  useEffect(() => {
    let cancelled = false;

    async function loadRoute() {
      setRoute(null);
      setMessage('');

      if (dayStops.length === 0) {
        setMessage('Add destinations to this day to see a route.');
        return;
      }

      if (dayStops.length === 1) {
        setMessage('Add another destination to calculate a road route.');
        return;
      }

      setLoading(true);

      try {
        const coordinates = dayStops
          .map(m => m.coordinates.join(','))
          .join(';');

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`
        );

        if (!response.ok) throw new Error('Routing service unavailable.');

        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes?.length) {
          throw new Error('No driving route could be found for these destinations.');
        }

        if (cancelled) return;

        const result = data.routes[0];

        setRoute({
          coordinates: result.geometry.coordinates,
          distance: result.distance,
          duration: result.duration,
          legs: result.legs.map((leg: any, index: number) => ({
            from: dayStops[index].name,
            to: dayStops[index + 1].name,
            distance: leg.distance,
            duration: leg.duration,
          })),
        });
      } catch (error) {
        if (!cancelled) {
          setMessage(
            error instanceof Error
              ? error.message
              : 'Unable to calculate this route.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRoute();

    return () => {
      cancelled = true;
    };
  }, [dayStops]);

  // Draw a high-contrast road route.
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapReady || !map.isStyleLoaded()) return;

    const outlineId = `${MAP_ID}-outline`;

    if (map.getLayer(MAP_ID)) map.removeLayer(MAP_ID);
    if (map.getLayer(outlineId)) map.removeLayer(outlineId);
    if (map.getSource(MAP_ID)) map.removeSource(MAP_ID);

    if (!route) return;

    map.addSource(MAP_ID, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates,
        },
      },
    });

    // Light outline underneath the route.
    map.addLayer({
      id: outlineId,
      type: 'line',
      source: MAP_ID,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#fff4df',
        'line-width': 10,
        'line-opacity': 0.95,
      },
    });

    // Deep heritage-maroon route.
    map.addLayer({
      id: MAP_ID,
      type: 'line',
      source: MAP_ID,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#8b2635',
        'line-width': 5,
        'line-opacity': 1,
      },
    });

    const bounds = new maplibregl.LngLatBounds();

    route.coordinates.forEach(coordinate => bounds.extend(coordinate));

    map.fitBounds(bounds, {
      padding: 90,
      maxZoom: 12,
      duration: 1000,
    });
  }, [route, mapReady]);

  // Optimise the visiting order using road travel times.
  async function optimiseRoute() {
    if (dayStops.length < 3) {
      setMessage('At least three destinations are needed to optimise the order.');
      return;
    }

    setOptimising(true);
    setMessage('');

    try {
      const coordinates = dayStops
        .map(m => m.coordinates.join(','))
        .join(';');

      const response = await fetch(
        `https://router.project-osrm.org/table/v1/driving/${coordinates}?annotations=duration`
      );

      if (!response.ok) throw new Error('Could not retrieve travel-time data.');

      const data = await response.json();

      if (data.code !== 'Ok' || !data.durations) {
        throw new Error('Travel-time data is unavailable.');
      }

      const permutations = getPermutations(dayStops);
      let bestOrder = dayStops;
      let bestDuration = Infinity;

      for (const order of permutations) {
        const indexes = order.map(monument =>
          dayStops.findIndex(item => item.slug === monument.slug)
        );

        let total = 0;
        let valid = true;

        for (let i = 0; i < indexes.length - 1; i++) {
          const duration = data.durations[indexes[i]][indexes[i + 1]];

          if (duration == null) {
            valid = false;
            break;
          }

          total += duration;
        }

        if (valid && total < bestDuration) {
          bestDuration = total;
          bestOrder = order;
        }
      }

      if (!Number.isFinite(bestDuration)) {
        throw new Error('No complete route could be found.');
      }

      setRouteOrder(previous => ({
        ...previous,
        [activeDay]: bestOrder.map(m => m.slug),
      }));

      setMessage('A more efficient visiting order has been applied.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to optimise the route.'
      );
    } finally {
      setOptimising(false);
    }
  }

  return (
    <section className="bd-route-planner">
      <div className="bd-section-title">
        <div>
          <span className="bd-journey-kicker">SMART TRAVEL ASSISTANT</span>
          <h2>Road route planner</h2>
          <p>Explore road distances and estimated driving times for each travel day.</p>
        </div>
        <Route size={34} strokeWidth={1.4} />
      </div>

      <div className="bd-route-day-tabs">
        {Array.from({ length: tripDays }, (_, index) => index + 1).map(day => (
          <button
            key={day}
            className={activeDay === day ? 'active' : ''}
            onClick={() => setActiveDay(day)}
          >
            Day {day}
          </button>
        ))}
      </div>

      <div className="bd-route-map" ref={mapElement} />

      {!apiKey && (
        <p className="bd-route-message">
          Add your MapTiler key to .env.local to display the route map.
        </p>
      )}

      {loading && <p className="bd-route-message">Calculating road route…</p>}

      {message && <p className="bd-route-message">{message}</p>}

      {route && (
        <>
          <div className="bd-route-stats">
            <div>
              <Route size={19} />
              <strong>{formatDistance(route.distance)}</strong>
              <span>Total road distance</span>
            </div>
            <div>
              <Clock3 size={19} />
              <strong>{formatTime(route.duration)}</strong>
              <span>Estimated driving time</span>
            </div>
            <div>
              <MapPin size={19} />
              <strong>{dayStops.length}</strong>
              <span>Destinations</span>
            </div>
          </div>

          <div className="bd-route-legs">
            <div className="bd-route-legs-heading">
              <h3>Day {activeDay} route breakdown</h3>
              <button
                onClick={optimiseRoute}
                disabled={optimising || loading}
              >
                <Sparkles size={15} />
                {optimising ? 'Optimising…' : 'Optimise order'}
              </button>
            </div>

            {route.legs.map((leg, index) => (
              <article className="bd-route-leg" key={`${leg.from}-${leg.to}`}>
                <span className="bd-route-leg-number">{index + 1}</span>
                <div>
                  <strong>{leg.from}</strong>
                  <span>to {leg.to}</span>
                </div>
                <div className="bd-route-leg-time">
                  <strong>{formatDistance(leg.distance)}</strong>
                  <span>{formatTime(leg.duration)}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {dayStops.length > 0 && (
        <div className="bd-route-order">
          <span>VISITING ORDER</span>
          {dayStops.map((monument, index) => (
            <div key={monument.slug}>
              <span>{index + 1}</span>
              <strong>{monument.name}</strong>
              {index < dayStops.length - 1 && <ArrowLeftRight size={14} />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
