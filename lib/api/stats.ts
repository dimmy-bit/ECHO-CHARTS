import {
  getInternalTransactions,
  getNftTransactions,
  getNormalTransactions,
  getTokenTransactions,
  Transaction,
  TokenTransaction,
} from './basescan';
import { getKnownContract, type DAppCategory } from '@/lib/data/known-contracts';

export type ActivityPoint = { date: string; count: number };
export type Interaction = { address: string; count: number; name: string; category: DAppCategory };
export type DAppUsage = {
  name: string;
  value: number;
  category: DAppCategory;
  address: string;
  iconText?: string;
  appUrl?: string;
};
export type TokenReward = { symbol: string; count: number; name?: string };
export type MiniAppUsage = {
  appName: string;
  usageCount: number;
  category: DAppCategory;
  address: string;
  deepLink?: string;
};

export interface WalletStats {
  totalTransactions: number;
  totalGasUsed: string;
  gasSpentUsd: number;
  firstActive: string | null;
  lastActive: string | null;
  uniqueDaysActive: number;
  topInteractions: Interaction[];
  dailyActivity: ActivityPoint[];
  uniqueDApps: number;
  nftCount: number;
  tokenTransfersIn: number;
  rewardsUsdEstimate: number;
  dappUsage: DAppUsage[];
  tokenRewards: TokenReward[];
  miniApps: MiniAppUsage[];
}

function normalizeAddress(address: string) {
  return address.toLowerCase();
}

function formatEthFromWei(wei: bigint, decimals = 4) {
  const base = 10n ** 18n;
  const whole = wei / base;
  const fraction = wei % base;
  if (decimals <= 0) return whole.toString();
  const fracStr = fraction.toString().padStart(18, '0').slice(0, decimals);
  return `${whole.toString()}.${fracStr}`;
}

function toDateString(timestamp: string) {
  const date = new Date(parseInt(timestamp, 10) * 1000);
  return date.toISOString().split('T')[0];
}

function sumIncomingTokens(tokenTxs: TokenTransaction[], user: string) {
  const userLower = normalizeAddress(user);
  return tokenTxs.filter(tx => tx.to?.toLowerCase() === userLower).length;
}

function buildTokenRewards(tokenTxs: TokenTransaction[], user: string): TokenReward[] {
  const userLower = normalizeAddress(user);
  const bySymbol = new Map<string, { count: number; name?: string }>();
  tokenTxs.forEach(tx => {
    if (tx.to?.toLowerCase() !== userLower) return;
    const symbol = tx.tokenSymbol || 'UNKNOWN';
    const current = bySymbol.get(symbol) || { count: 0, name: tx.tokenName || undefined };
    bySymbol.set(symbol, { count: current.count + 1, name: current.name || tx.tokenName || undefined });
  });
  return Array.from(bySymbol.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([symbol, data]) => ({ symbol, count: data.count, name: data.name }));
}

function buildDailyActivity(txs: Transaction[]): ActivityPoint[] {
  const dailyCounts = new Map<string, number>();
  txs.forEach(tx => {
    const date = toDateString(tx.timeStamp);
    dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
  });
  return Array.from(dailyCounts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function buildTopInteractions(txs: Transaction[], user: string): Interaction[] {
  const userLower = normalizeAddress(user);
  const interactions = new Map<string, number>();
  txs.forEach(tx => {
    if (tx.from?.toLowerCase() === userLower && tx.to) {
      const to = tx.to.toLowerCase();
      interactions.set(to, (interactions.get(to) || 0) + 1);
    }
  });
  return Array.from(interactions.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([address, count]) => {
      const known = getKnownContract(address);
      return {
        address,
        count,
        name: known?.name || `${address.slice(0, 6)}...${address.slice(-4)}`,
        category: known?.category || 'Other',
      };
    });
}

function countUniqueDapps(txs: Transaction[], user: string) {
  const userLower = normalizeAddress(user);
  const set = new Set<string>();
  txs.forEach(tx => {
    if (tx.from?.toLowerCase() === userLower && tx.to) {
      set.add(tx.to.toLowerCase());
    }
  });
  return set.size;
}

function buildDappUsage(txs: Transaction[], user: string): DAppUsage[] {
  const userLower = normalizeAddress(user);
  const byAddress = new Map<string, number>();
  txs.forEach(tx => {
    if (tx.from?.toLowerCase() === userLower && tx.to) {
      const to = tx.to.toLowerCase();
      byAddress.set(to, (byAddress.get(to) || 0) + 1);
    }
  });
  return Array.from(byAddress.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([address, count]) => {
      const known = getKnownContract(address);
      return {
        address,
        value: count,
        name: known?.name || `${address.slice(0, 6)}...${address.slice(-4)}`,
        category: known?.category || 'Other',
        iconText: known?.iconText,
        appUrl: known?.appUrl,
      };
    });
}

function buildMiniApps(dapps: DAppUsage[]): MiniAppUsage[] {
  return dapps.slice(0, 5).map(dapp => ({
    appName: dapp.name,
    usageCount: dapp.value,
    category: dapp.category,
    address: dapp.address,
    deepLink: dapp.appUrl,
  }));
}

export async function calculateStats(address: string): Promise<WalletStats> {
  const [normalTxs, tokenTxs, internalTxs, nftTxs] = await Promise.all([
    getNormalTransactions(address),
    getTokenTransactions(address),
    getInternalTransactions(address),
    getNftTransactions(address),
  ]);

  const activitySource = normalTxs.length ? normalTxs : internalTxs;
  const allTxs = activitySource;

  if (!allTxs.length) {
    return {
      totalTransactions: 0,
      totalGasUsed: '0',
      gasSpentUsd: 0,
      firstActive: null,
      lastActive: null,
      uniqueDaysActive: 0,
      topInteractions: [],
      dailyActivity: [],
      uniqueDApps: 0,
      nftCount: nftTxs.length,
      tokenTransfersIn: 0,
      rewardsUsdEstimate: 0,
      dappUsage: [],
      tokenRewards: [],
      miniApps: [],
    };
  }

  let gasUsed = 0n;
  allTxs.forEach(tx => {
    gasUsed += BigInt(tx.gasUsed) * BigInt(tx.gasPrice);
  });

  const dailyActivity = buildDailyActivity(activitySource);
  const topInteractions = buildTopInteractions(activitySource, address);
  const dappUsage = buildDappUsage(activitySource, address);
  const miniApps = buildMiniApps(dappUsage);
  const uniqueDaysActive = new Set(dailyActivity.map(d => d.date)).size;

  const firstTx = normalTxs[0] || internalTxs[0];
  const lastTx = normalTxs[normalTxs.length - 1] || internalTxs[internalTxs.length - 1];

  const gasSpentEthStr = formatEthFromWei(gasUsed, 4);
  const gasSpentEth = parseFloat(gasSpentEthStr);
  const ethPrice = Number(process.env.NEXT_PUBLIC_ETH_PRICE_USD || '0');
  const rewardsPerTxUsd = Number(process.env.NEXT_PUBLIC_REWARD_USD_PER_TX || '0');

  const tokenTransfersIn = sumIncomingTokens(tokenTxs, address);

  return {
    totalTransactions: normalTxs.length || internalTxs.length,
    totalGasUsed: gasSpentEthStr,
    gasSpentUsd: gasSpentEth * ethPrice,
    firstActive: firstTx ? new Date(parseInt(firstTx.timeStamp, 10) * 1000).toLocaleDateString() : null,
    lastActive: lastTx ? new Date(parseInt(lastTx.timeStamp, 10) * 1000).toLocaleDateString() : null,
    uniqueDaysActive,
    topInteractions,
    dailyActivity,
    uniqueDApps: countUniqueDapps(activitySource, address),
    nftCount: nftTxs.length,
    tokenTransfersIn,
    rewardsUsdEstimate: tokenTransfersIn * rewardsPerTxUsd,
    dappUsage,
    tokenRewards: buildTokenRewards(tokenTxs, address),
    miniApps,
  };
}
