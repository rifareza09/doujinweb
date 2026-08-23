'use client';
import { useState, useEffect, useCallback } from 'react';
import VideoCard from '../_components/VideoCard.js';

const CATEGORIES = [
  { slug: '', name: 'Semua' },
  { slug: 'hentai', name: 'Hentai' },
  { slug: 'jav', name: 'JAV' },
  { slug: '2d-animation', name: '2D Animation' },
  { slug: '3d-hentai', name: '3D Hentai' },
  { slug: 'jav-cosplay', name: 'JAV Cosplay' },
];

export default function VideoPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchVideos = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page });
      if (search) params.set('q', search);
      else if (category) params.set('category', category);
      const res = await fetch(`/api/video?${params}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setVideos(json.videos || []);
      setHasNext(json.hasNext || false);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, category, search]);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
  const changeCategory = (cat) => { setCategory(cat); setSearch(''); setSearchInput(''); setPage(1); };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>🎬 Video</h1>
        <p style={{ color: 'var(--text-muted)' }}>Streaming video terbaru</p>
      </div>

      {/* Search */}
      <div className="filter-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1 }}>
          <input
            className="filter-input"
            placeholder="Cari video..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            id="video-search-input"
          />
          <button type="submit" className="btn btn-primary">Cari</button>
          {search && (
            <button type="button" className="btn btn-outline" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>
              ✕ Reset
            </button>
          )}
        </form>
      </div>

      {/* Category chips */}
      {!search && (
        <div className="chip-row">
          {CATEGORIES.map(cat => (
            <button key={cat.slug} className={`chip ${category === cat.slug ? 'active' : ''}`}
              onClick={() => changeCategory(cat.slug)}>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="loading"><div className="spinner" /><span>Memuat video...</span></div>
      ) : error ? (
        <div className="error-box">⚠️ {error}</div>
      ) : videos.length === 0 ? (
        <div className="loading"><span>Tidak ada video ditemukan</span></div>
      ) : (
        <div className="card-grid-wide">
          {videos.map(v => <VideoCard key={v.slug} video={v} />)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
          <button className="page-btn active">{page}</button>
          <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={!hasNext}>Next →</button>
        </div>
      )}
    </div>
  );
}
