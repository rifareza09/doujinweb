import Link from 'next/link';
import { scrapeMangaList } from '@/lib/scraper.js';
import { scrapeNekoList } from '@/lib/nekoScraper.js';
import MangaCard from './_components/MangaCard.js';
import VideoCard from './_components/VideoCard.js';

export const revalidate = 300; // revalidate every 5 minutes

async function getHomeData() {
  try {
    const [mangas, { videos }] = await Promise.all([
      scrapeMangaList({ page: 1, limit: 12, sort: 'latest_chapter' }),
      scrapeNekoList(1),
    ]);
    return { mangas, videos: videos.slice(0, 8) };
  } catch {
    return { mangas: [], videos: [] };
  }
}

export default async function HomePage() {
  const { mangas, videos } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1>Manga & Video<br />Terlengkap</h1>
        <p>Baca manga, manhwa, doujinshi dan tonton video. Konten update otomatis setiap saat.</p>
        <div className="hero-badges">
          <span className="badge purple">📚 Manga & Doujin</span>
          <span className="badge pink">🎬 Video Streaming</span>
          <span className="badge">⚡ Update Otomatis</span>
        </div>
      </section>

      <div className="container">
        {/* Manga terbaru */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Manga Terbaru</h2>
            <Link href="/manga" className="see-all">Lihat Semua →</Link>
          </div>
          {mangas.length > 0 ? (
            <div className="card-grid">
              {mangas.map((m) => <MangaCard key={m.slug} manga={m} />)}
            </div>
          ) : (
            <div className="error-box">Gagal memuat manga. Pastikan .env sudah diisi.</div>
          )}
        </section>

        {/* Video terbaru */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Video Terbaru</h2>
            <Link href="/video" className="see-all">Lihat Semua →</Link>
          </div>
          {videos.length > 0 ? (
            <div className="card-grid-wide">
              {videos.map((v) => <VideoCard key={v.slug} video={v} />)}
            </div>
          ) : (
            <div className="error-box">Gagal memuat video.</div>
          )}
        </section>
      </div>
    </>
  );
}
