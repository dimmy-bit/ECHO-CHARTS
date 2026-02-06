import { NextResponse } from 'next/server';
import { resolveAddress } from '@/lib/api/resolveAddress';
import { isAddress, createPublicClient, http } from 'viem';
import { base, mainnet } from 'viem/chains';

const mainnetClient = createPublicClient({ chain: mainnet, transport: http() });
const baseClient = createPublicClient({ chain: base, transport: http() });

async function reverseResolve(address: string): Promise<string | null> {
  try {
    const name = await mainnetClient.getEnsName({ address });
    if (name) return name;
  } catch {
    // ignore
  }
  try {
    const name = await baseClient.getEnsName({ address });
    if (name) return name;
  } catch {
    // ignore
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('address')?.trim();

  if (!input) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  if (input.endsWith('.eth') || input.endsWith('.base') || input.endsWith('.base.eth')) {
    const resolved = await resolveAddress(input);
    return NextResponse.json({ address: resolved, name: input });
  }

  if (!isAddress(input)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  const name = await reverseResolve(input);
  return NextResponse.json({ address: input, name });
}
