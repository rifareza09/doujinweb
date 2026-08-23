import { scrapeGenres } from '@/lib/scraper.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await scrapeGenres();
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
