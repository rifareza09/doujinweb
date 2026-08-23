'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ChapterReaderPage() {
  const params = useParams();
  const { slug, id } = params;
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/manga/${slug}/chapter/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setChapter(d.data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug, id]);

  if (loading) return (
    <div className="loading" style={{ minHeight: '80vh' }}>
      <div className="spinner" /><span>Memuat chapter...</span>
    </div>
  );

  if (error) return (
    <div className="container" style={{ paddingTop: 40 }}>
      <div className="error-box">⚠️ {error}</div>
      <div style={{ marginTop: 16 }}>
        <Link href={`/manga/${slug}`} className="btn btn-outline">← Kembali ke manga</Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Reader Header */}
      <div className="reader-header">
        <div>
          <Link href={`/manga/${slug}`} style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            ← {chapter?.mangaTitle || 'Kembali'}
          </Link>
          <div className="reader-title">{chapter?.title || `Chapter ${chapter?.number}`}</div>
        </div>
        <div className="reader-nav">
          <Link href={`/manga/${slug}`} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 13 }}>
            Daftar Chapter
          </Link>
        </div>
      </div>

      {/* Images */}
      <div className="reader-images">
        {chapter?.images?.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={`/api/image-proxy?url=${encodeURIComponent(url)}`}
            alt={`Page ${i + 1}`}
            className="reader-img"
            loading={i < 3 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="reader-proxy-note">
          📖 Selesai membaca • <Link href={`/manga/${slug}`} style={{ color: 'var(--accent2)' }}>Kembali ke daftar chapter</Link>
        </div>
      </div>
    </>
  );
}
