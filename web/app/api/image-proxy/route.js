// Proxy gambar universal — auto-detect sumber dan set Referer yang sesuai.
// - nekopoi.care / img.nekopoi.care → Referer: https://nekopoi.care/
// - amz-ch.desu.pics (chapter manga) → Referer: https://doujin.desu.xxx/
import { NextResponse } from 'next/server';

function getReferer(url) {
  try {
    const { hostname } = new URL(url);
    if (hostname === 'nekopoi.care' || hostname.endsWith('.nekopoi.care')) {
      return 'https://nekopoi.care/';
    }
  } catch { /* ignore */ }
  return 'https://doujin.desu.xxx/';
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  if (!url || !url.startsWith('https://')) {
    return NextResponse.json({ error: 'URL tidak valid' }, { status: 400 });
  }

  try {
    const parsedUrl = new URL(url);
    const ALLOWED_DOMAINS = [
      'pic.desu.xxx', 
      'cdn-static.desu.xxx', 
      'amz-ch.desu.pics',
      'nekopoi.care',
      'img.nekopoi.care'
    ];
    if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
      return NextResponse.json({ error: 'Domain tidak diizinkan (SSRF Protection)' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Format URL salah' }, { status: 400 });
  }
  try {
    const res = await fetch(url, {
      headers: {
        Referer: getReferer(url),
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });
    if (!res.ok) return NextResponse.json({ error: `HTTP ${res.status}` }, { status: res.status });
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
