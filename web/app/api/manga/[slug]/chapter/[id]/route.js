import { scrapeChapterImages } from '@/lib/scraper.js';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const data = await scrapeChapterImages(id);
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
