import { scrapeMangaDetail } from '@/lib/scraper.js';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const data = await scrapeMangaDetail(slug);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
