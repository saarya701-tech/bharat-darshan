
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import type { Monument } from '@/lib/monuments';

export default function MonumentCard({
  monument: m,
}: {
  monument: Monument;
}) {
  return (
    <article className="monument-card royal-monument-card">

      <Link
        href={`/monument/${m.slug}`}
        className="card-image-wrap"
      >
        <img
          src={m.image}
          alt={m.name}
          className="card-image"
          loading="lazy"
        />

        <span className="card-image-shade" aria-hidden="true" />

        {m.unesco && (
          <span className="unesco-badge">
            UNESCO HERITAGE
          </span>
        )}

        <span className="card-discover">
          Discover the story
          <ArrowUpRight size={16} />
        </span>
      </Link>

      <div className="card-content">

        <div className="eyebrow">
          ✦ {m.category} · {m.period}
        </div>

        <h3>
          <Link href={`/monument/${m.slug}`}>
            {m.name}
          </Link>
        </h3>

        <div className="hindi-name">
          {m.hindi}
        </div>

        <p className="royal-card-location">
          <MapPin size={14} />
          {m.city}, {m.state}
        </p>

        <div className="card-bottom">
          <span>{m.region} India</span>

          <Link href={`/monument/${m.slug}`}>
            Explore
            <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>
    </article>
  );
}
