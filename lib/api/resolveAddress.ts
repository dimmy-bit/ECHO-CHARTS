import { createPublicClient, http, isAddress } from 'viem';
import { base, mainnet } from 'viem/chains';

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const baseClient = createPublicClient({
  chain: base,
  transport: http(),
});

function isName(input: string) {
  return (
    input.endsWith('.eth') ||
    input.endsWith('.base') ||
    input.endsWith('.base.eth')
  );
}

export async function resolveAddress(input: string): Promise<string | null> {
  if (isAddress(input)) return input;
  if (!isName(input)) return null;

  try {
    const ens = await mainnetClient.getEnsAddress({ name: input });
    if (ens) return ens;
  } catch {
    // Ignore and try Base
  }

  try {
    const baseEns = await baseClient.getEnsAddress({ name: input });
    if (baseEns) return baseEns;
  } catch {
    // Ignore and fall through
  }

  return null;
}
