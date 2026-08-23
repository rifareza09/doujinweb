'use client';
import Link from 'next/link';

function proxied(url) {
  if (!url) return '';
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export default function MangaCard({ manga }) {
  return (
    <Link href={`/manga/${manga.slug}`} className="manga-card">
      <div className="manga-card-thumb">
        {manga.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={proxied(manga.thumb)} alt={manga.title} loading="lazy" />
        ) : (
          <div className="thumb-placeholder">📚</div>
        )}
        {manga.type && (
          <span className="manga-card-badge">{manga.type}</span>
        )}
        {manga.rating && (
          <span className="manga-card-rating">★ {Number(manga.rating).toFixed(1)}</span>
        )}
      </div>
      <div className="manga-card-info">
        <div className="manga-card-title">{manga.title}</div>
        <div className="manga-card-meta">
          <span style={{ color: 'var(--text-muted)' }}>{manga.status || '—'}</span>
          {manga.latestChapter && (
            <span className="chapter-badge">Ch.{manga.latestChapter}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
