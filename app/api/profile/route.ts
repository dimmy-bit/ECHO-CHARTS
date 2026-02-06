import { NextResponse } from 'next/server';
import { createPublicClient, http, isAddress } from 'viem';
import { base, mainnet } from 'viem/chains';

const mainnetClient = createPublicClient({ chain: mainnet, transport: http() });
const baseClient = createPublicClient({ chain: base, transport: http() });

async function resolveName(address: string) {
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

async function resolveAvatar(name: string) {
  try {
    const avatar = await mainnetClient.getEnsAvatar({ name });
    if (avatar) return avatar;
  } catch {
    // ignore
  }
  try {
    const avatar = await baseClient.getEnsAvatar({ name });
    if (avatar) return avatar;
  } catch {
    // ignore
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address')?.trim();
  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  const name = await resolveName(address);
  const avatar = name ? await resolveAvatar(name) : null;

  return NextResponse.json({
    address,
    name,
    avatar,
  });
}
