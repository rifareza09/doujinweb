import './globals.css';

export const metadata = {
  title: { default: 'RXVDoujin — Manga & Video', template: '%s | RXVDoujin' },
  description: 'Baca manga, manhwa, doujinshi dan tonton video streaming. Konten terlengkap, update terbaru.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main className="page-wrapper">{children}</main>
        <footer className="footer">
          <p>© 2024 RXVDoujin — Data dari doujin.desu.xxx & nekopoi.care</p>
        </footer>
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">⚡ RXVDoujin</a>
      <div className="navbar-links">
        <a href="/" className="navbar-link">Home</a>
        <a href="/manga" className="navbar-link">Manga</a>
        <a href="/video" className="navbar-link">Video</a>
      </div>
      <form action="/search" className="navbar-search">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{color:'var(--text-muted)', flexShrink:0}}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input name="q" placeholder="Cari manga, video..." id="navbar-search-input" />
        <button type="submit" id="navbar-search-btn" aria-label="Cari" style={{
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          border: 'none', borderRadius: '6px', padding: '4px 10px',
          color: '#fff', fontSize: '12px', fontWeight: 600,
          cursor: 'pointer', transition: 'opacity 0.2s', flexShrink: 0,
        }}>Cari</button>
      </form>
    </nav>
  );
}
