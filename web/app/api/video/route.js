import { scrapeNekoList, scrapeNekoSearch, scrapeNekoCategory } from '@/lib/nekoScraper.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category') || '';
    const q = searchParams.get('q') || '';

    let result;
    if (q) {
      result = await scrapeNekoSearch(q, page);
    } else if (category) {
      result = await scrapeNekoCategory(category, page);
    } else {
      result = await scrapeNekoList(page);
    }
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
