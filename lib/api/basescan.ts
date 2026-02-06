const BASESCAN_API_URL = 'https://api.basescan.org/api';
const BLOCKSCOUT_API_URL = 'https://base.blockscout.com/api';
const API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
const DEBUG = process.env.NEXT_PUBLIC_DEBUG_API === 'true';

interface BasescanResponse<T> {
  status: string;
  message: string;
  result: T;
}

export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  isError: string;
  contractAddress: string;
}

export interface TokenTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  contractAddress: string;
}

async function fetchFrom<T>(baseUrl: string, params: Record<string, string>, includeApiKey: boolean) {
  const url = new URL(baseUrl);
  if (includeApiKey && API_KEY) {
    url.searchParams.append('apikey', API_KEY);
  }
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data: BasescanResponse<T> = await response.json();
  return data;
}

async function fetchBasescan<T>(
  params: Record<string, string>,
  options: { allowNotOk?: boolean } = {}
): Promise<T> {
  try {
    const data = await fetchFrom<T>(BASESCAN_API_URL, params, true);
    if (DEBUG) {
      console.log('Basescan', params.action, {
        status: data.status,
        message: data.message,
        sample: Array.isArray(data.result) ? data.result.slice(0, 1) : data.result,
      });
    }
    if (data.status === '1' || data.message === 'No transactions found') {
      return data.result;
    }
    if (typeof data.message === 'string' && data.message.toLowerCase().includes('rate')) {
      throw new Error('RATE_LIMIT');
    }
    if (DEBUG) {
      console.warn('Basescan NOTOK, trying Blockscout:', data.message);
    }
  } catch (error) {
    if (DEBUG) {
      console.warn('Basescan request failed, trying Blockscout:', error);
    }
  }

  try {
    const fallback = await fetchFrom<T>(BLOCKSCOUT_API_URL, params, false);
    if (DEBUG) {
      console.log('Blockscout', params.action, {
        status: fallback.status,
        message: fallback.message,
        sample: Array.isArray(fallback.result) ? fallback.result.slice(0, 1) : fallback.result,
      });
    }
    if (fallback.status === '1' || fallback.message === 'No transactions found') {
      return fallback.result;
    }
    if (typeof fallback.message === 'string' && fallback.message.toLowerCase().includes('rate')) {
      throw new Error('RATE_LIMIT');
    }
  } catch (error) {
    if (DEBUG) {
      console.warn('Blockscout request failed:', error);
    }
  }

  if (!options.allowNotOk) {
    console.warn('All API sources failed for', params.action);
  }
  return [] as T;
}

export async function getNormalTransactions(address: string): Promise<Transaction[]> {
  return fetchBasescan<Transaction[]>({
    module: 'account',
    action: 'txlist',
    address,
    startblock: '0',
    endblock: '99999999',
    page: '1',
    offset: '10000',
    sort: 'asc',
  }, { allowNotOk: true });
}

export async function getTokenTransactions(address: string): Promise<TokenTransaction[]> {
  return fetchBasescan<TokenTransaction[]>({
    module: 'account',
    action: 'tokentx',
    address,
    page: '1',
    offset: '10000',
    sort: 'desc',
  }, { allowNotOk: true });
}

export async function getInternalTransactions(address: string): Promise<Transaction[]> {
  return fetchBasescan<Transaction[]>({
    module: 'account',
    action: 'txlistinternal',
    address,
    page: '1',
    offset: '10000',
    sort: 'desc',
  }, { allowNotOk: true });
}

export async function getNftTransactions(address: string): Promise<TokenTransaction[]> {
  return fetchBasescan<TokenTransaction[]>({
    module: 'account',
    action: 'tokennfttx',
    address,
    page: '1',
    offset: '10000',
    sort: 'desc',
  }, { allowNotOk: true });
}
