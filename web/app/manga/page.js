'use client';
import { useState, useEffect, useCallback } from 'react';
import MangaCard from '../_components/MangaCard.js';

const TYPES = [
  { value: '', label: 'Semua Tipe' },
  { value: 'manga', label: 'Manga' },
  { value: 'manhwa', label: 'Manhwa' },
  { value: 'doujinshi', label: 'Doujinshi' },
];
const SORTS = [
  { value: 'latest_chapter', label: 'Chapter Terbaru' },
  { value: 'views', label: 'Terpopuler' },
  { value: 'rating', label: 'Rating Tertinggi' },
];

export default function MangaPage() {
  const [mangas, setMangas] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('latest_chapter');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetch('/api/genres').then(r => r.json()).then(d => setGenres((d.data || []).slice(0, 30)));
  }, []);

  const fetchMangas = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page, sort, limit: 24 });
      if (search) params.set('q', search);
      if (type) params.set('type', type);
      if (genre) params.set('genre', genre);
      const res = await fetch(`/api/manga?${params}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setMangas(json.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, type, genre, sort, search]);

  useEffect(() => { fetchMangas(); }, [fetchMangas]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
  const changeFilter = (setter) => (val) => { setter(val); setPage(1); };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>📚 Manga</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manga, manhwa, dan doujinshi terlengkap</p>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, flexWrap: 'wrap' }}>
          <input
            className="filter-input"
            placeholder="Cari judul manga..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            id="manga-search-input"
          />
          <button type="submit" className="btn btn-primary">Cari</button>
        </form>
        <select className="filter-select" value={type} onChange={e => changeFilter(setType)(e.target.value)} id="manga-type-select">
          {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className="filter-select" value={sort} onChange={e => changeFilter(setSort)(e.target.value)} id="manga-sort-select">
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Genre chips */}
      {genres.length > 0 && (
        <div className="chip-row">
          <button className={`chip ${!genre ? 'active' : ''}`} onClick={() => changeFilter(setGenre)('')}>Semua</button>
          {genres.map(g => (
            <button key={g.slug} className={`chip ${genre === g.slug ? 'active' : ''}`}
              onClick={() => changeFilter(setGenre)(genre === g.slug ? '' : g.slug)}>
              {g.name}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="loading"><div className="spinner" /><span>Memuat manga...</span></div>
      ) : error ? (
        <div className="error-box">⚠️ {error}</div>
      ) : mangas.length === 0 ? (
        <div className="loading"><span>Tidak ada hasil ditemukan</span></div>
      ) : (
        <div className="card-grid">
          {mangas.map(m => <MangaCard key={m.slug} manga={m} />)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
          {[...Array(5)].map((_, i) => {
            const p = Math.max(1, page - 2) + i;
            return (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                {p}
              </button>
            );
          })}
          <button className="page-btn" onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
