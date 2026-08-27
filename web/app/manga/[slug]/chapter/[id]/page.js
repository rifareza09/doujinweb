'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ChapterReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { slug, id } = params;

  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch chapter images + daftar chapter manga (untuk navigasi prev/next)
  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      fetch(`/api/manga/${slug}/chapter/${id}`).then(r => r.json()),
      fetch(`/api/manga/${slug}`).then(r => r.json()),
    ])
      .then(([chData, mangaData]) => {
        if (chData.error) throw new Error(chData.error);
        setChapter(chData.data);
        // chapters diurutkan dari yang terbaru ke terlama (nomor terbesar duluan)
        setChapters(mangaData.data?.chapters || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug, id]);

  // Cari posisi chapter sekarang di dalam daftar
  const currentIndex = chapters.findIndex(ch => String(ch.id) === String(id));
  // chapters[0] = terbaru (nomor besar) → next = index-1, prev = index+1
  const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const prevChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const goToChapter = (ch) => {
    router.push(`/manga/${slug}/chapter/${ch.id}`);
  };

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
          {/* Tombol chapter sebelumnya (nomor lebih kecil) */}
          <button
            id="btn-prev-chapter-top"
            className="btn btn-outline"
            style={{ padding: '6px 14px', fontSize: 13 }}
            disabled={!prevChapter}
            onClick={() => prevChapter && goToChapter(prevChapter)}
            title={prevChapter ? `Chapter ${prevChapter.number}` : 'Sudah chapter pertama'}
          >
            ‹ Prev
          </button>

          <Link href={`/manga/${slug}`} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 13 }}>
            Daftar
          </Link>

          {/* Tombol chapter berikutnya (nomor lebih besar) */}
          <button
            id="btn-next-chapter-top"
            className="btn btn-outline"
            style={{ padding: '6px 14px', fontSize: 13 }}
            disabled={!nextChapter}
            onClick={() => nextChapter && goToChapter(nextChapter)}
            title={nextChapter ? `Chapter ${nextChapter.number}` : 'Sudah chapter terbaru'}
          >
            Next ›
          </button>
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

        {/* Navigasi bawah setelah selesai baca */}
        <div className="reader-end-nav">
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
            📖 Selesai membaca <strong>{chapter?.title || `Chapter ${chapter?.number}`}</strong>
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              id="btn-prev-chapter-bottom"
              className="btn btn-outline"
              style={{ minWidth: 130 }}
              disabled={!prevChapter}
              onClick={() => prevChapter && goToChapter(prevChapter)}
            >
              ‹ Chapter {prevChapter?.number ?? '—'}
            </button>

            <Link href={`/manga/${slug}`} className="btn btn-outline" style={{ minWidth: 130, textAlign: 'center' }}>
              📋 Daftar Chapter
            </Link>

            <button
              id="btn-next-chapter-bottom"
              className={`btn ${nextChapter ? 'btn-primary' : 'btn-outline'}`}
              style={{ minWidth: 130 }}
              disabled={!nextChapter}
              onClick={() => nextChapter && goToChapter(nextChapter)}
            >
              Chapter {nextChapter?.number ?? '—'} ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

