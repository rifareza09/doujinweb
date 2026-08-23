'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function proxied(url) {
  if (!url) return '';
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export default function VideoDetailPage() {
  const params = useParams();
  const { slug } = params;
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePlayer, setActivePlayer] = useState(0);

  useEffect(() => {
    fetch(`/api/video/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setVideo(d.data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="loading" style={{ minHeight: '80vh' }}>
      <div className="spinner" /><span>Memuat video...</span>
    </div>
  );

  if (error) return (
    <div className="container" style={{ paddingTop: 40 }}>
      <div className="error-box">⚠️ {error}</div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 960 }}>
      <div style={{ marginBottom: 16 }}>
        <Link href="/video" style={{ color: 'var(--text-muted)', fontSize: 13 }}>← Kembali ke Video</Link>
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 20, lineHeight: 1.3 }}>
        {video?.title}
      </h1>

      {/* Player tabs */}
      {video?.players?.length > 1 && (
        <div className="player-tabs">
          {video.players.map((_, i) => (
            <button key={i} className={`player-tab ${activePlayer === i ? 'active' : ''}`}
              onClick={() => setActivePlayer(i)}>
              Server {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Video player */}
      {video?.players?.length > 0 ? (
        <div className="video-player-wrap">
          <iframe
            key={activePlayer}
            src={video.players[activePlayer]}
            allowFullScreen
            allow="autoplay; fullscreen"
            title={`Player ${activePlayer + 1}`}
          />
        </div>
      ) : (
        <div className="error-box" style={{ marginBottom: 24 }}>
          Player tidak tersedia untuk video ini.
        </div>
      )}

      {/* Thumbnail + Synopsis */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {video?.thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={proxied(video.thumb)} alt={video.title}
            style={{ width: 200, borderRadius: 'var(--radius)', objectFit: 'cover', flexShrink: 0 }}
          />
        )}
        {video?.synopsis && (
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Sinopsis</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 14 }}>{video.synopsis}</p>
          </div>
        )}
      </div>

      {/* Player links */}
      {video?.players?.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: 'var(--text-muted)' }}>Link Player</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {video.players.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline" style={{ fontSize: 13 }}>
                🔗 Server {i + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
