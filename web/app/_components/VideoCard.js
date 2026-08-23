'use client';
import Link from 'next/link';

function proxied(url) {
  if (!url) return '';
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export default function VideoCard({ video }) {
  return (
    <Link href={`/video/${video.slug}`} className="video-card">
      <div className="video-card-thumb">
        {video.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={proxied(video.thumb)} alt={video.title} loading="lazy" />
        ) : (
          <div className="thumb-placeholder">🎬</div>
        )}
        <div className="play-overlay">
          <div className="play-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="video-card-info">
        <div className="video-card-title">{video.title}</div>
        {video.date && <div className="video-card-meta">{video.date}</div>}
        {video.synopsis && (
          <div className="video-card-meta" style={{ marginTop: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.synopsis}
          </div>
        )}
      </div>
    </Link>
  );
}
