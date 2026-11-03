
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPinned, Sparkles } from "lucide-react";

const royalImages = [
  "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=85",
];

export default function Hero() {
  const [opening, setOpening] = useState(false);
  const [showEntrance, setShowEntrance] = useState(true);

  const beginJourney = () => {
    if (opening) return;

    setOpening(true);

    window.setTimeout(() => {
  setShowEntrance(false);
}, 2600);
  };

  return (
    <>
      {/* MAIN HOMEPAGE HERO */}
      <section className="hero cinematic-hero">
        
<div className="hero-particles" aria-hidden="true">
  {Array.from({ length: 32 }).map((_, index) => (
    <span key={index} />
  ))}
</div>

        <div className="hero-gallery" aria-hidden="true">
          {royalImages.map((image, index) => (
            <div
              className={`hero-gallery-image gallery-image-${index + 1}`}
              key={image}
              style={{ backgroundImage: `url("${image}")` }}
            />
          ))}
        </div>

        <div className="hero-image-wash" />
        <div className="hero-vignette" />
        <div className="sun-glow" />

        <div className="cloud cloud-one" />
        <div className="cloud cloud-two" />
        <div className="cloud cloud-three" />

        <div className="bird-flock bird-flock-one">
          <i /><i /><i />
        </div>
        <div className="bird-flock bird-flock-two">
          <i /><i />
        </div>

        <div className="dust dust-one" />
        <div className="dust dust-two" />
        <div className="dust dust-three" />
        <div className="dust dust-four" />

        <div className="hero-arch">
          <div className="arch-inner">
            <div className="hero-kicker">
              A JOURNEY THROUGH TIME
            </div>

            <div className="hero-symbol">✥</div>

            <h1>भारत दर्शन</h1>
            <h2>Bharat Darshan</h2>

            <div className="ornament-divider">✦</div>

            <p className="hero-subtitle">
              HERITAGE ATLAS OF INDIA
            </p>

            <p className="hero-copy">
              Every stone holds a story. Every monument preserves
              a thousand memories. Discover the soul of India.
            </p>

            <div className="hero-actions">
              <Link
                href="/heritage-map"
                className="btn btn-primary"
              >
                <MapPinned size={17} />
                Explore Heritage Map
              </Link>

              <Link
                href="/explore"
                className="btn btn-outline"
              >
                Begin Your Journey
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="hero-footnote">
              EXPLORE · EXPERIENCE · PRESERVE
            </div>
          </div>
        </div>

        <div className="hero-side-ornament" aria-hidden="true">
          ❧
        </div>

        <div className="hero-bottom-note">
          AN ATLAS OF INDIA'S LIVING HISTORY
        </div>
      </section>

      {/* FULL-SCREEN ROYAL INTRODUCTION */}
      {showEntrance && (
        <div
          className={`entry-gate ${opening ? "is-opening" : ""}`}
          role="dialog"
          aria-label="Welcome to Bharat Darshan"
        >
          <div className="entry-gallery">
            {royalImages.map((image, index) => (
              <div
                key={image}
                className={`entry-gallery-image entry-image-${index + 1}`}
                style={{ backgroundImage: `url("${image}")` }}
              />
            ))}
          </div>

          <div className="entry-dark-overlay" />

          <div className="entry-frame">
            <div className="entry-top-ornament">❧ ✥ ❧</div>

            <p className="entry-kicker">
              AN INVITATION TO EXPLORE
            </p>

            <h1>भारत दर्शन</h1>
            <h2>BHARAT DARSHAN</h2>

            <div className="entry-divider">
              <span>✦</span>
            </div>

            <p className="entry-description">
              Step beyond the present.
              <br />
              Enter the living history of India.
            </p>

            <button
              type="button"
              className="entry-start-button"
              onClick={beginJourney}
              disabled={opening}
            >
              <span>START YOUR JOURNEY</span>
              <ArrowRight size={18} />
            </button>

            <p className="entry-footer">
              A HERITAGE ATLAS · A CIVILIZATION · A THOUSAND STORIES
            </p>
          </div>

          {/* Animated palace doors */}
          <div className="entry-door entry-door-left" />
          <div className="entry-door entry-door-right" />

          <div className="entry-corner entry-corner-tl">✥</div>
          <div className="entry-corner entry-corner-tr">✥</div>
          <div className="entry-corner entry-corner-bl">✥</div>
          <div className="entry-corner entry-corner-br">✥</div>

          <div className="entry-particles" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
