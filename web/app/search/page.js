'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MangaCard from '../_components/MangaCard.js';
import VideoCard from '../_components/VideoCard.js';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const [input, setInput] = useState(q);
  const [mangas, setMangas] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading(true); setError('');
    try {
      const [mRes, vRes] = await Promise.all([
        fetch(`/api/manga?q=${encodeURIComponent(query)}&limit=12`),
        fetch(`/api/video?q=${encodeURIComponent(query)}`),
      ]);
      const [mJson, vJson] = await Promise.all([mRes.json(), vRes.json()]);
      setMangas(mJson.data || []);
      setVideos(vJson.videos || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (q) { setInput(q); doSearch(q); } }, [q, doSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/search?q=${encodeURIComponent(input.trim())}`);
  };

  return (
    <>
      {/* Search box */}
      <div className="search-hero">
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>🔍 Pencarian</h1>
        <form onSubmit={handleSubmit} className="search-box-big">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Cari manga, video..."
            id="search-page-input"
            autoFocus
          />
          <button type="submit" className="btn btn-primary">Cari</button>
        </form>
      </div>

      <div className="container" style={{ paddingBottom: 60 }}>
        {loading && <div className="loading"><div className="spinner" /><span>Mencari...</span></div>}
        {error && <div className="error-box">⚠️ {error}</div>}

        {!loading && q && (
          <>
            {/* Manga results */}
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">Manga ({mangas.length})</h2>
              </div>
              {mangas.length > 0 ? (
                <div className="card-grid">
                  {mangas.map(m => <MangaCard key={m.slug} manga={m} />)}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Tidak ada manga ditemukan untuk &quot;{q}&quot;</p>
              )}
            </section>

            {/* Video results */}
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">Video ({videos.length})</h2>
              </div>
              {videos.length > 0 ? (
                <div className="card-grid-wide">
                  {videos.map(v => <VideoCard key={v.slug} video={v} />)}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Tidak ada video ditemukan untuk &quot;{q}&quot;</p>
              )}
            </section>
          </>
        )}

        {!q && !loading && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 20 }}>
            Ketik kata kunci untuk mencari manga dan video
          </p>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loading"><div className="spinner" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
