import { scrapeNekoDetail } from '@/lib/nekoScraper.js';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const data = await scrapeNekoDetail(slug);
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
