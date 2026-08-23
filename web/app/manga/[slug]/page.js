import Link from 'next/link';
import { scrapeMangaDetail } from '@/lib/scraper.js';
import { notFound } from 'next/navigation';
import SynopsisClient from './_SynopsisClient.js';

function proxied(url) {
  if (!url) return '';
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export const revalidate = 600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const manga = await scrapeMangaDetail(slug);
    if (!manga) return { title: 'Manga Not Found' };
    return {
      title: manga.title,
      description: manga.synopsis?.slice(0, 160),
      openGraph: { images: manga.thumb ? [{ url: manga.thumb }] : [] },
    };
  } catch { return { title: 'Manga' }; }
}

export default async function MangaDetailPage({ params }) {
  const { slug } = await params;
  let manga;
  try {
    manga = await scrapeMangaDetail(slug);
    if (!manga) notFound();
  } catch {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="error-box">Gagal memuat detail manga.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="detail-grid">
        {/* Cover */}
        <div>
          <div className="detail-cover">
            {manga.thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={proxied(manga.thumb)} alt={manga.title} />
            ) : (
              <div className="thumb-placeholder" style={{ aspectRatio: '2/3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>📚</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
            <Link href="/manga" style={{ color: 'var(--text-muted)', fontSize: 13 }}>← Kembali</Link>
          </div>
          <h1 className="detail-info" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 8 }}>{manga.title}</h1>
          {manga.altTitle && <p className="detail-alt">{manga.altTitle}</p>}

          <div className="detail-stats">
            {manga.status && <div className="stat-item"><span className="stat-label">Status</span><span className="stat-val">{manga.status}</span></div>}
            {manga.type && <div className="stat-item"><span className="stat-label">Tipe</span><span className="stat-val">{manga.type}</span></div>}
            {manga.rating && <div className="stat-item"><span className="stat-label">Rating</span><span className="stat-val" style={{ color: 'var(--gold)' }}>★ {Number(manga.rating).toFixed(1)}</span></div>}
            {manga.views > 0 && <div className="stat-item"><span className="stat-label">Views</span><span className="stat-val">{manga.views.toLocaleString('id-ID')}</span></div>}
            {manga.author && <div className="stat-item"><span className="stat-label">Author</span><span className="stat-val">{manga.author}</span></div>}
          </div>

          {manga.genres?.length > 0 && (
            <div className="genre-tags">
              {manga.genres.map(g => (
                <Link key={g.slug} href={`/manga?genre=${g.slug}`} className="genre-tag">{g.name}</Link>
              ))}
            </div>
          )}

          {manga.synopsis && (
            <SynopsisClient text={manga.synopsis} />
          )}

          {/* Chapter List */}
          {manga.chapters?.length > 0 && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                📋 {manga.chapters.length} Chapter
              </h2>
              <div className="chapter-list" style={{ maxHeight: 400, overflowY: 'auto' }}>
                {manga.chapters.map(ch => (
                  <Link key={ch.id} href={`/manga/${slug}/chapter/${ch.id}`} className="chapter-item">
                    <span className="chapter-num">Chapter {ch.number}{ch.title ? ` — ${ch.title}` : ''}</span>
                    <span className="chapter-date">{ch.date}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
