export type DAppCategory =
  | 'DEX'
  | 'Lending'
  | 'Gaming'
  | 'NFT'
  | 'Social'
  | 'Bridge'
  | 'Analytics'
  | 'Other';

export type KnownContract = {
  address: string;
  name: string;
  category: DAppCategory;
  iconText?: string;
  appUrl?: string;
};

export const KNOWN_CONTRACTS: Record<string, KnownContract> = {
  // Example entries (extend as needed)
  '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24': {
    address: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
    name: 'Uniswap V3',
    category: 'DEX',
    iconText: 'UNI',
    appUrl: 'https://app.uniswap.org',
  },
};

export function getKnownContract(address: string): KnownContract | null {
  const key = address.toLowerCase();
  return KNOWN_CONTRACTS[key] || null;
}
