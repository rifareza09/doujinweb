import { scrapeMangaList, scrapeGenres } from '@/lib/scraper.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const genre = searchParams.get('genre') || '';
    const sort = searchParams.get('sort') || 'latest_chapter';
    const limit = parseInt(searchParams.get('limit') || '24');

    const data = await scrapeMangaList({ page, query, type, genre, sort, limit });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
