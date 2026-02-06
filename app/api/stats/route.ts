import { NextResponse } from 'next/server';
import { calculateStats } from '@/lib/api/stats';
import { getCached, CACHE_DURATIONS } from '@/lib/api/cache';
import { resolveAddress } from '@/lib/api/resolveAddress';

function isHexAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address')?.trim();
  const debug = searchParams.get('debug') === '1';

  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  const resolved = isHexAddress(address) ? address : await resolveAddress(address);

  if (!resolved || !isHexAddress(resolved)) {
    return NextResponse.json(
      { error: 'Invalid address or name. Unable to resolve.' },
      { status: 400 }
    );
  }

  try {
    const stats = await getCached(
      `stats:${resolved.toLowerCase()}`,
      () => calculateStats(resolved),
      CACHE_DURATIONS.STATS
    );

    if (debug) {
      return NextResponse.json({ address: resolved, stats, debug: { resolved } });
    }

    return NextResponse.json({ address: resolved, stats });
  } catch (error) {
    if (error instanceof Error && error.message === 'RATE_LIMIT') {
      return NextResponse.json(
        { error: 'Rate limit hit. Please wait a moment and try again.' },
        { status: 429 }
      );
    }
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
