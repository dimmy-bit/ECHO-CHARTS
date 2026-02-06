import type { WalletStats } from '@/lib/api/stats';

export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'diamond';

export type Badge = {
  id: string;
  name: string;
  level: BadgeLevel;
  description: string;
};

export function calculateBadges(stats: WalletStats): Badge[] {
  const badges: Badge[] = [];

  if (stats.totalTransactions >= 1000) {
    badges.push({ id: 'chain-legend', name: 'Chain Legend', level: 'gold', description: '1000+ transactions' });
  } else if (stats.totalTransactions >= 100) {
    badges.push({ id: 'gas-warrior', name: 'Gas Warrior', level: 'silver', description: '100+ transactions' });
  } else if (stats.totalTransactions >= 10) {
    badges.push({ id: 'getting-started', name: 'Getting Started', level: 'bronze', description: '10+ transactions' });
  }

  if (stats.uniqueDApps >= 50) {
    badges.push({ id: 'ecosystem-pro', name: 'Ecosystem Pro', level: 'gold', description: '50+ DApps used' });
  } else if (stats.uniqueDApps >= 10) {
    badges.push({ id: 'explorer', name: 'Explorer', level: 'bronze', description: '10+ DApps used' });
  }

  if (stats.uniqueDaysActive >= 365) {
    badges.push({ id: 'year-veteran', name: 'Year Veteran', level: 'diamond', description: '365+ active days' });
  } else if (stats.uniqueDaysActive >= 100) {
    badges.push({ id: 'consistent', name: 'Consistent', level: 'gold', description: '100+ active days' });
  }

  return badges;
}
