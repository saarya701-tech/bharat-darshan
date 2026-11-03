'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown, ArrowUp, Check, Compass, Heart,
  MapPin, Search, Trash2, X, RotateCcw
} from 'lucide-react';
import { monuments, categories, regions } from '@/lib/monuments';
import type { Monument } from '@/lib/monuments';
import JourneyRoutePlanner from '@/components/JourneyRoutePlanner';

const MAX_STOPS = 5;

type MonumentSchedule = {
  day: number;
  minutes: number;
};

type ActiveView = 'overview' | 'itinerary' | 'explore' | 'wishlist' | 'visited';

export default function Journey() {
  const [journey, setJourney] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All regions');
  const [category, setCategory] = useState('All categories');
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'wishlist' | 'visited'>('all');
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [ready, setReady] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [tripDays, setTripDays] = useState(2);
  const [allocations, setAllocations] = useState<Record<string, MonumentSchedule>>({});

  // Restore saved journey data.
  useEffect(() => {
    try {
      setJourney(JSON.parse(localStorage.getItem('bd-journey') || '[]'));
      setVisited(JSON.parse(localStorage.getItem('bd-visited') || '[]'));
      setWishlist(JSON.parse(localStorage.getItem('bd-wishlist') || '[]'));
    } catch {
      setJourney([]);
      setVisited([]);
      setWishlist([]);
    }

    setReady(true);
  }, []);

  // Restore saved trip calendar.
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('bd-trip-plan');

      if (savedPlan) {
        const plan = JSON.parse(savedPlan);

        setStartDate(plan.startDate || '');
        setTripDays(Math.min(14, Math.max(1, Number(plan.tripDays) || 2)));
        setAllocations(plan.allocations || {});
      }
    } catch {
      setStartDate('');
      setTripDays(2);
      setAllocations({});
    }
  }, []);

  // Save calendar changes automatically.
  useEffect(() => {
    if (!ready) return;

    localStorage.setItem(
      'bd-trip-plan',
      JSON.stringify({ startDate, tripDays, allocations })
    );
  }, [ready, startDate, tripDays, allocations]);

  const saveJourney = (items: string[]) => {
    setJourney(items);
    localStorage.setItem('bd-journey', JSON.stringify(items));
  };

  const saveVisited = (items: string[]) => {
    setVisited(items);
    localStorage.setItem('bd-visited', JSON.stringify(items));
  };

  const saveWishlist = (items: string[]) => {
    setWishlist(items);
    localStorage.setItem('bd-wishlist', JSON.stringify(items));
  };

  const updateSchedule = (
    slug: string,
    changes: Partial<MonumentSchedule>,
    defaultDay: number
  ) => {
    setAllocations(previous => ({
      ...previous,
      [slug]: {
        day: previous[slug]?.day ?? defaultDay,
        minutes: previous[slug]?.minutes ?? 90,
        ...changes,
      },
    }));
  };

  const getTripDate = (day: number) => {
    if (!startDate) return '';

    const date = new Date(`${startDate}T12:00:00`);
    date.setDate(date.getDate() + day - 1);

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours && remaining) return `${hours} hr ${remaining} min`;
    if (hours) return `${hours} hr`;
    return `${remaining} min`;
  };

  const selectedMonuments = journey
    .map(slug => monuments.find(m => m.slug === slug))
    .filter((m): m is Monument => Boolean(m));

  const filteredMonuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return monuments.filter(m => {
      const matchesSearch = !query || [
        m.name, m.hindi, m.city, m.state, m.category
      ].some(value => value?.toLowerCase().includes(query));

      const matchesRegion = region === 'All regions' || m.region === region;
      const matchesCategory = category === 'All categories' || m.category === category;
      const matchesUnesco = !unescoOnly || m.unesco;

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'wishlist' && wishlist.includes(m.slug)) ||
        (activeTab === 'visited' && visited.includes(m.slug));

      return matchesSearch && matchesRegion && matchesCategory &&
        matchesUnesco && matchesTab;
    });
  }, [search, region, category, unescoOnly, activeTab, wishlist, visited]);

  const addToJourney = (slug: string) => {
    if (journey.length >= MAX_STOPS || journey.includes(slug)) return;
    saveJourney([...journey, slug]);
  };

  const moveStop = (index: number, direction: number) => {
    const next = [...journey];
    const target = index + direction;

    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [next[target], next[index]];
    saveJourney(next);
  };

  const toggleWishlist = (slug: string) => {
    saveWishlist(
      wishlist.includes(slug)
        ? wishlist.filter(item => item !== slug)
        : [...wishlist, slug]
    );
  };

  const toggleVisited = (slug: string) => {
    saveVisited(
      visited.includes(slug)
        ? visited.filter(item => item !== slug)
        : [...visited, slug]
    );
  };

  const progressPercentage = Math.round(
    (visited.length / Math.max(monuments.length, 1)) * 100
  );

  if (!ready) {
    return (
      <div className="page-wrap">
        <p>Preparing your heritage journal…</p>
      </div>
    );
  }

  return (
    <div className="page-wrap bd-journey-page bd-command-page">

      {/* Dashboard header */}
      <header className="bd-command-hero">
        <div>
          <span className="bd-journey-kicker">
            BHARAT DARSHAN · PERSONAL TRAVEL SPACE
          </span>
          <h1>The art of travelling through time.</h1>
          <p>
            Plan your route, organise your days and keep your heritage
            discoveries together.
          </p>
        </div>
        <Compass size={52} strokeWidth={1} />
      </header>

      <div className="bd-command-layout">

        {/* Sidebar navigation */}
        <aside className="bd-command-sidebar">
          <span className="bd-sidebar-label">YOUR WORKSPACE</span>

          <button
            className={activeView === 'overview' ? 'active' : ''}
            onClick={() => setActiveView('overview')}
          >
            <Compass size={17} /> Overview
          </button>

          <button
            className={activeView === 'itinerary' ? 'active' : ''}
            onClick={() => setActiveView('itinerary')}
          >
            <MapPin size={17} /> My itinerary
          </button>

          <button
            className={activeView === 'explore' ? 'active' : ''}
            onClick={() => {
              setActiveView('explore');
              setActiveTab('all');
            }}
          >
            <Search size={17} /> Explore places
          </button>

          <button
            className={activeView === 'wishlist' ? 'active' : ''}
            onClick={() => {
              setActiveView('wishlist');
              setActiveTab('wishlist');
            }}
          >
            <Heart size={17} /> Wishlist
            <span>{wishlist.length}</span>
          </button>

          <button
            className={activeView === 'visited' ? 'active' : ''}
            onClick={() => {
              setActiveView('visited');
              setActiveTab('visited');
            }}
          >
            <Check size={17} /> Visited
            <span>{visited.length}</span>
          </button>

          <div className="bd-sidebar-note">
            <span>YOUR HERITAGE STORY</span>
            <strong>{progressPercentage}%</strong>
            <div className="bd-progress-track">
              <div style={{ width: `${progressPercentage}%` }} />
            </div>
            <small>{visited.length} of {monuments.length} places explored</small>
          </div>
        </aside>

        {/* Main dashboard content */}
        <main className="bd-command-main">

          {/* OVERVIEW */}
          {activeView === 'overview' && (
            <div className="bd-command-view">

              <div className="bd-command-view-heading">
                <div>
                  <span className="bd-journey-kicker">YOUR DASHBOARD</span>
                  <h2>Journey overview</h2>
                  <p>A quick look at your heritage plans and progress.</p>
                </div>

                <button
                  className="bd-command-primary"
                  onClick={() => setActiveView('itinerary')}
                >
                  Plan my journey <MapPin size={15} />
                </button>
              </div>

              <section className="bd-journey-stats">
                <div>
                  <strong>{monuments.length}</strong>
                  <span>Heritage places</span>
                </div>
                <div>
                  <strong>{journey.length}/{MAX_STOPS}</strong>
                  <span>Journey stops</span>
                </div>
                <div>
                  <strong>{wishlist.length}</strong>
                  <span>Saved favourites</span>
                </div>
                <div>
                  <strong>{visited.length}</strong>
                  <span>Places explored</span>
                </div>
              </section>

              <div className="bd-overview-grid">

                <section className="bd-overview-panel">
                  <div className="bd-panel-heading">
                    <div>
                      <span className="bd-journey-kicker">YOUR NEXT ADVENTURE</span>
                      <h3>Selected destinations</h3>
                    </div>
                    <button onClick={() => setActiveView('itinerary')}>
                      Manage →
                    </button>
                  </div>

                  {selectedMonuments.length === 0 ? (
                    <p className="bd-overview-empty">
                      Your itinerary is empty. Explore the collection and add
                      your first destination.
                    </p>
                  ) : (
                    <div className="bd-overview-stops">
                      {selectedMonuments.slice(0, 4).map((m, index) => (
                        <div className="bd-overview-stop" key={m.slug}>
                          <img src={m.image} alt={m.name} />
                          <span className="bd-overview-number">{index + 1}</span>
                          <div>
                            <strong>{m.name}</strong>
                            <small>{m.city}, {m.state}</small>
                          </div>
                        </div>
                      ))}

                      {selectedMonuments.length > 4 && (
                        <small>
                          + {selectedMonuments.length - 4} more destinations
                        </small>
                      )}
                    </div>
                  )}
                </section>

                <section className="bd-overview-panel bd-overview-calendar">
                  <div className="bd-panel-heading">
                    <div>
                      <span className="bd-journey-kicker">TRAVEL SCHEDULE</span>
                      <h3>Trip calendar</h3>
                    </div>
                    <button onClick={() => setActiveView('itinerary')}>
                      Edit →
                    </button>
                  </div>

                  <strong>
                    {startDate
                      ? `${getTripDate(1)} – ${getTripDate(tripDays)}`
                      : 'Dates not selected'}
                  </strong>

                  <p>
                    {tripDays} {tripDays === 1 ? 'travel day' : 'travel days'}
                    {' · '}
                    {selectedMonuments.length} selected destinations
                  </p>

                  <div className="bd-mini-days">
                    {Array.from(
                      { length: Math.min(tripDays, 5) },
                      (_, i) => (
                        <span key={i}>
                          <b>{i + 1}</b>Day {i + 1}
                        </span>
                      )
                    )}
                  </div>
                </section>
              </div>

              <section className="bd-overview-route">
                <div className="bd-panel-heading">
                  <div>
                    <span className="bd-journey-kicker">
                      SMART TRAVEL ASSISTANT
                    </span>
                    <h3>Road route planner</h3>
                    <p>View road distances and estimated driving times by day.</p>
                  </div>

                  <button onClick={() => setActiveView('itinerary')}>
                    Open planner →
                  </button>
                </div>

                <p className="bd-overview-route-hint">
                  Your route map and day-by-day route details are available
                  in My itinerary.
                </p>
              </section>

              <section className="bd-exploration-progress">
                <div>
                  <span className="bd-journey-kicker">YOUR HERITAGE STORY</span>
                  <h2>Places you've explored</h2>
                  <p>
                    Every monument you visit becomes part of your own
                    heritage story.
                  </p>
                </div>

                <div className="bd-progress-number">
                  {visited.length}
                  <span> / {monuments.length}</span>
                </div>

                <div className="bd-progress-track">
                  <div style={{ width: `${progressPercentage}%` }} />
                </div>

                <p className="bd-progress-caption">
                  {progressPercentage}% of the collection explored
                </p>
              </section>
            </div>
          )}

          {/* MY ITINERARY */}
          {activeView === 'itinerary' && (
            <div className="bd-command-view">

              <div className="bd-command-view-heading">
                <div>
                  <span className="bd-journey-kicker">PLAN YOUR EXPLORATION</span>
                  <h2>My itinerary</h2>
                  <p>
                    Arrange destinations, schedule visits and review your
                    road routes.
                  </p>
                </div>
              </div>

              {/* Selected journey builder */}
              <section className="bd-journey-builder">
                <div className="bd-section-title">
                  <div>
                    <span className="bd-journey-kicker">DESIGN YOUR OWN ROUTE</span>
                    <h2>Your selected journey</h2>
                    <p>
                      Arrange up to five monuments in the order you want
                      to visit them.
                    </p>
                  </div>
                  <span className="bd-stop-count">
                    {journey.length} / {MAX_STOPS}
                  </span>
                </div>

                {selectedMonuments.length === 0 ? (
                  <div className="bd-journey-empty">
                    <Compass size={38} />
                    <h3>Your journey is waiting to be created</h3>
                    <p>
                      Explore the heritage collection and add your first
                      destination.
                    </p>
                    <button
                      className="bd-action-button"
                      onClick={() => {
                        setActiveView('explore');
                        setActiveTab('all');
                      }}
                    >
                      Explore places
                    </button>
                  </div>
                ) : (
                  <div className="bd-selected-grid">
                    {selectedMonuments.map((m, index) => (
                      <article className="bd-selected-card" key={m.slug}>
                        <span className="bd-stop-number">{index + 1}</span>
                        <img src={m.image} alt={m.name} />

                        <div className="bd-selected-info">
                          <h3>{m.name}</h3>
                          <p>
                            <MapPin size={13} /> {m.city}, {m.state}
                          </p>
                          <span>{m.category} · {m.period}</span>
                        </div>

                        <div className="bd-stop-actions">
                          <button
                            aria-label="Move up"
                            title="Move up"
                            disabled={index === 0}
                            onClick={() => moveStop(index, -1)}
                          >
                            <ArrowUp size={17} />
                          </button>

                          <button
                            aria-label="Move down"
                            title="Move down"
                            disabled={index === selectedMonuments.length - 1}
                            onClick={() => moveStop(index, 1)}
                          >
                            <ArrowDown size={17} />
                          </button>

                          <button
                            aria-label="Remove from journey"
                            title="Remove"
                            onClick={() =>
                              saveJourney(journey.filter(x => x !== m.slug))
                            }
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                <div className="bd-journey-builder-footer">
                  <span>
                    {journey.length === MAX_STOPS
                      ? 'Your journey has reached its five-stop limit.'
                      : `${MAX_STOPS - journey.length} more ${
                          MAX_STOPS - journey.length === 1 ? 'place' : 'places'
                        } can be added.`}
                  </span>

                  {journey.length > 0 && (
                    <button
                      className="bd-text-button"
                      onClick={() => saveJourney([])}
                    >
                      <RotateCcw size={14} /> Clear journey
                    </button>
                  )}
                </div>
              </section>

              {/* Trip calendar */}
              <section className="bd-calendar-section">
                <div className="bd-section-title">
                  <div>
                    <span className="bd-journey-kicker">YOUR TRAVEL SCHEDULE</span>
                    <h2>Trip calendar &amp; daily itinerary</h2>
                    <p>
                      Choose your dates and organise your selected monuments
                      into daily plans.
                    </p>
                  </div>
                </div>

                <div className="bd-calendar-settings">
                  <label>
                    <span>Trip start date</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={event => setStartDate(event.target.value)}
                    />
                  </label>

                  <label>
                    <span>Trip duration</span>
                    <select
                      value={tripDays}
                      onChange={event => setTripDays(Number(event.target.value))}
                    >
                      {Array.from({ length: 14 }, (_, index) => index + 1).map(day => (
                        <option key={day} value={day}>
                          {day} {day === 1 ? 'day' : 'days'}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="bd-calendar-date-summary">
                    <span>PLANNED JOURNEY</span>
                    <strong>
                      {startDate
                        ? `${getTripDate(1)} – ${getTripDate(tripDays)}`
                        : 'Choose your travel dates'}
                    </strong>
                  </div>
                </div>

                {selectedMonuments.length === 0 ? (
                  <div className="bd-journey-empty">
                    <Compass size={34} />
                    <h3>Add monuments to begin planning</h3>
                    <p>Your selected monuments will appear here automatically.</p>
                  </div>
                ) : (
                  <>
                    <div className="bd-calendar-overview">
                      <div>
                        <strong>{selectedMonuments.length}</strong>
                        <span>Selected destinations</span>
                      </div>
                      <div>
                        <strong>{tripDays}</strong>
                        <span>Travel days</span>
                      </div>
                      <div>
                        <strong>
                          {selectedMonuments.filter(m => visited.includes(m.slug)).length}
                        </strong>
                        <span>Already visited</span>
                      </div>
                    </div>

                    <div className="bd-day-list">
                      {Array.from({ length: tripDays }, (_, index) => index + 1).map(day => {
                        const dayStops = selectedMonuments
                          .map((monument, index) => ({
                            monument,
                            day: Math.min(
                              tripDays,
                              Math.max(
                                1,
                                allocations[monument.slug]?.day ??
                                  ((index % tripDays) + 1)
                              )
                            ),
                          }))
                          .filter(item => item.day === day);

                        const totalMinutes = dayStops.reduce(
                          (total, item) =>
                            total +
                            (allocations[item.monument.slug]?.minutes ?? 90),
                          0
                        );

                        return (
                          <article className="bd-day-card" key={day}>
                            <header className="bd-day-header">
                              <div>
                                <span className="bd-journey-kicker">
                                  DAY {String(day).padStart(2, '0')}
                                </span>
                                <h3>{getTripDate(day) || `Travel day ${day}`}</h3>
                              </div>

                              <span className="bd-day-total">
                                {dayStops.length}{' '}
                                {dayStops.length === 1 ? 'stop' : 'stops'}
                                {' · '}
                                {formatDuration(totalMinutes)}
                              </span>
                            </header>

                            {dayStops.length === 0 ? (
                              <p className="bd-day-empty">
                                No monuments assigned to this day. You can
                                move a destination here using its day selector.
                              </p>
                            ) : (
                              <div className="bd-day-stops">
                                {dayStops.map(({ monument }) => {
                                  const minutes =
                                    allocations[monument.slug]?.minutes ?? 90;

                                  return (
                                    <div className="bd-day-stop" key={monument.slug}>
                                      <img src={monument.image} alt={monument.name} />

                                      <div className="bd-day-stop-info">
                                        <strong>{monument.name}</strong>
                                        <span>
                                          {monument.city}, {monument.state}
                                        </span>
                                        <small>
                                          {monument.category} · {monument.period}
                                        </small>
                                      </div>

                                      <label className="bd-day-control">
                                        <span>Visit on</span>
                                        <select
                                          value={day}
                                          onChange={event =>
                                            updateSchedule(
                                              monument.slug,
                                              { day: Number(event.target.value) },
                                              day
                                            )
                                          }
                                        >
                                          {Array.from(
                                            { length: tripDays },
                                            (_, i) => i + 1
                                          ).map(option => (
                                            <option key={option} value={option}>
                                              Day {option}
                                            </option>
                                          ))}
                                        </select>
                                      </label>

                                      <label className="bd-day-control">
                                        <span>Visit duration</span>
                                        <select
                                          value={minutes}
                                          onChange={event =>
                                            updateSchedule(
                                              monument.slug,
                                              { minutes: Number(event.target.value) },
                                              day
                                            )
                                          }
                                        >
                                          <option value={30}>30 minutes</option>
                                          <option value={60}>1 hour</option>
                                          <option value={90}>1.5 hours</option>
                                          <option value={120}>2 hours</option>
                                          <option value={180}>3 hours</option>
                                          <option value={240}>4 hours</option>
                                        </select>
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </>
                )}
              </section>

              {/* Smart route planner */}
              <JourneyRoutePlanner
                monuments={selectedMonuments}
                tripDays={tripDays}
                allocations={allocations}
              />
            </div>
          )}

          {/* EXPLORE, WISHLIST AND VISITED */}
          {(activeView === 'explore' ||
            activeView === 'wishlist' ||
            activeView === 'visited') && (
            <div className="bd-command-view">

              <div className="bd-command-view-heading">
                <div>
                  <span className="bd-journey-kicker">
                    DISCOVER INDIA'S HERITAGE
                  </span>

                  <h2>
                    {activeView === 'wishlist'
                      ? 'Your wishlist'
                      : activeView === 'visited'
                      ? "Places you've visited"
                      : 'Explore heritage places'}
                  </h2>

                  <p>
                    {activeView === 'wishlist'
                      ? 'The monuments you have saved for a future visit.'
                      : activeView === 'visited'
                      ? 'Keep track of the heritage places you have explored.'
                      : 'Find monuments by name, location, region or architectural style.'}
                  </p>
                </div>
              </div>

              <section className="bd-discover-section">
                <div className="bd-section-title">
                  <div>
                    <span className="bd-journey-kicker">EXPLORE THE COLLECTION</span>
                    <h2>Add a heritage place</h2>
                    <p>
                      Find monuments by name, location, region or architectural style.
                    </p>
                  </div>

                  <span className="bd-result-total">
                    {filteredMonuments.length} places
                  </span>
                </div>

                <div className="bd-discover-toolbar">
                  <label className="bd-journey-search">
                    <Search size={18} />

                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search in English, Hindi, city or state..."
                    />

                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </label>

                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    aria-label="Filter by region"
                  >
                    <option>All regions</option>
                    {regions.map(item => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    aria-label="Filter by category"
                  >
                    <option>All categories</option>
                    {categories.map(item => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <label className="bd-unesco-filter">
                    <input
                      type="checkbox"
                      checked={unescoOnly}
                      onChange={e => setUnescoOnly(e.target.checked)}
                    />
                    UNESCO sites
                  </label>
                </div>

                <div className="bd-collection-tabs">
                  <button
                    className={activeTab === 'all' ? 'active' : ''}
                    onClick={() => setActiveTab('all')}
                  >
                    All places
                  </button>

                  <button
                    className={activeTab === 'wishlist' ? 'active' : ''}
                    onClick={() => setActiveTab('wishlist')}
                  >
                    <Heart size={15} /> Wishlist ({wishlist.length})
                  </button>

                  <button
                    className={activeTab === 'visited' ? 'active' : ''}
                    onClick={() => setActiveTab('visited')}
                  >
                    <Check size={15} /> Visited ({visited.length})
                  </button>
                </div>

                {filteredMonuments.length === 0 ? (
                  <div className="bd-journey-empty">
                    <Search size={32} />
                    <h3>No heritage places found</h3>
                    <p>Try changing your search or filters.</p>

                    <button
                      className="bd-action-button"
                      onClick={() => {
                        setSearch('');
                        setRegion('All regions');
                        setCategory('All categories');
                        setUnescoOnly(false);
                        setActiveTab('all');
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="bd-heritage-grid">
                    {filteredMonuments.map(m => {
                      const isSelected = journey.includes(m.slug);
                      const isSaved = wishlist.includes(m.slug);
                      const isVisited = visited.includes(m.slug);

                      return (
                        <article className="bd-heritage-card" key={m.slug}>
                          <Link
                            href={`/monument/${m.slug}`}
                            className="bd-heritage-image"
                          >
                            <img
                              src={m.image}
                              alt={m.name}
                              loading="lazy"
                            />

                            {m.unesco && (
                              <span className="bd-heritage-badge">
                                UNESCO HERITAGE
                              </span>
                            )}

                            <span className="bd-image-caption">
                              Discover the story ↗
                            </span>
                          </Link>

                          <button
                            className={`bd-wishlist-button ${isSaved ? 'saved' : ''}`}
                            onClick={() => toggleWishlist(m.slug)}
                            aria-label={
                              isSaved
                                ? 'Remove from wishlist'
                                : 'Save to wishlist'
                            }
                            title={
                              isSaved
                                ? 'Remove from wishlist'
                                : 'Add to wishlist'
                            }
                          >
                            <Heart
                              size={18}
                              fill={isSaved ? 'currentColor' : 'none'}
                            />
                          </button>

                          <div className="bd-heritage-content">
                            <span className="bd-heritage-meta">
                              {m.category} · {m.period}
                            </span>

                            <h3>{m.name}</h3>
                            <p className="bd-hindi-name">{m.hindi}</p>

                            <p className="bd-heritage-location">
                              <MapPin size={14} /> {m.city}, {m.state}
                            </p>

                            <div className="bd-heritage-actions">
                              <button
                                className={`bd-action-button ${isSelected ? 'is-added' : ''}`}
                                disabled={
                                  isSelected || journey.length >= MAX_STOPS
                                }
                                onClick={() => addToJourney(m.slug)}
                              >
                                {isSelected
                                  ? <><Check size={15} /> Added</>
                                  : '＋ Add to journey'}
                              </button>

                              <button
                                className={`bd-visited-button ${isVisited ? 'is-visited' : ''}`}
                                onClick={() => toggleVisited(m.slug)}
                              >
                                {isVisited ? 'Visited ✓' : 'Mark visited'}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              {activeView === 'visited' && (
                <section className="bd-exploration-progress">
                  <div>
                    <span className="bd-journey-kicker">YOUR HERITAGE STORY</span>
                    <h2>Places you've explored</h2>
                    <p>
                      Every monument you visit becomes part of your own
                      heritage story.
                    </p>
                  </div>

                  <div className="bd-progress-number">
                    {visited.length}
                    <span> / {monuments.length}</span>
                  </div>

                  <div className="bd-progress-track">
                    <div style={{ width: `${progressPercentage}%` }} />
                  </div>

                  <p className="bd-progress-caption">
                    {progressPercentage}% of the collection explored
                  </p>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
