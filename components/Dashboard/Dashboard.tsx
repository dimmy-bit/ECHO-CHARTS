'use client';

import { useWalletData } from '@/hooks/useWalletData';
import { StatsCard } from './StatsCard';
import { ActivityChart } from '@/components/Charts/ActivityChart';
import { DAppUsageChart } from '@/components/Charts/DAppUsageChart';
import { MiniAppsChart } from '@/components/Charts/MiniAppsChart';
import { BadgeDisplay } from '@/components/Dashboard/BadgeDisplay';
import { ProfileHeader } from '@/components/Dashboard/ProfileHeader';
import { ShareButton } from '@/components/Share/ShareButton';
import { calculateBadges } from '@/lib/utils/badges';
import { Activity, Zap, Calendar, TrendingUp, Layers, Sparkles, Home, BarChart3, Grid2x2, Share2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChartSkeleton, StatsCardSkeleton } from '@/components/Dashboard/LoadingStates';
import { useEffect, useMemo, useState } from 'react';

export function Dashboard({ address }: { address: string }) {
    const { data: stats, isLoading, isError } = useWalletData(address);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '365d' | 'all'>('30d');
    const [tab, setTab] = useState<'overview' | 'activity' | 'apps' | 'share'>('overview');
    const [profileName, setProfileName] = useState<string | null>(null);
    const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

    const displayName = profileName || `${address.slice(0, 6)}...${address.slice(-4)}`;
    const avatarUrl = profileAvatar || `https://api.dicebear.com/8.x/identicon/png?seed=${encodeURIComponent(address)}`;

    const dappPalette = ['#1A73FF', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
    const dappData = (stats?.dappUsage ?? []).map((item, idx) => ({
        name: item.name,
        value: item.value,
        color: dappPalette[idx % dappPalette.length],
        category: item.category,
        iconText: item.iconText || item.name.slice(0, 2).toUpperCase(),
    }));

    const miniAppsData = (stats?.miniApps ?? []).map(app => ({
        appName: app.appName,
        usageCount: app.usageCount,
        category: app.category,
        deepLink: app.deepLink || (app.address ? `https://basescan.org/address/${app.address}` : undefined),
    }));

    const badges = stats ? calculateBadges(stats) : [];

    const filteredActivity = useMemo(() => {
        const daily = stats?.dailyActivity ?? [];
        if (timeRange === 'all') return daily;
        const days =
            timeRange === '7d' ? 7 :
                timeRange === '30d' ? 30 :
                    timeRange === '90d' ? 90 :
                        365;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const data = daily.filter(point => {
            const date = new Date(point.date);
            return date >= cutoff;
        });
        if (!data.length) {
            // If there's at least one point overall, fall back to latest data
            return daily.slice(-Math.min(7, daily.length));
        }
        return data;
    }, [stats?.dailyActivity, timeRange]);

    useEffect(() => {
        let cancelled = false;
        async function loadProfile() {
            try {
                const res = await fetch(`/api/profile?address=${address}`);
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled) {
                    setProfileName(data.name || null);
                    setProfileAvatar(data.avatar || null);
                }
            } catch {
                // ignore
            }
        }
        loadProfile();
        return () => {
            cancelled = true;
        };
    }, [address]);

    if (isLoading) {
        return (
            <div className="w-full space-y-6 pb-20">
                <div className="glass-panel p-4 rounded-xl animate-pulse">
                    <div className="h-8 w-48 bg-white/10 rounded" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <StatsCardSkeleton key={`stat-skeleton-${idx}`} />
                    ))}
                </div>
                <ChartSkeleton height={240} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ChartSkeleton height={220} />
                    <ChartSkeleton height={220} />
                </div>
                <ChartSkeleton height={220} />
                <ChartSkeleton height={220} />
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <div className="text-center p-8 glass-panel rounded-xl">
                <p className="text-red-400 mb-2">Failed to load data.</p>
                <p className="text-sm text-muted">Please check the address and try again.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-muted hover:text-foreground transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col gap-3 min-h-0"
        >
            <ProfileHeader
                address={address}
                onShare={
                    <ShareButton
                        address={address}
                        displayName={displayName}
                        avatarUrl={avatarUrl}
                        stats={{
                            totalTransactions: stats.totalTransactions,
                            uniqueDaysActive: stats.uniqueDaysActive,
                            uniqueDApps: stats.uniqueDApps,
                            tokenTransfersIn: stats.tokenTransfersIn,
                        }}
                    />
                }
            />

            <div className="flex-1 min-h-0 overflow-y-auto mini-scroll space-y-3 pr-1 pb-12">
            <AnimatePresence mode="wait">
            {tab === 'overview' && (
                <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3"
                >
            {(stats.totalTransactions === 0 && stats.uniqueDaysActive === 0) && (
                <div className="glass-panel p-4 rounded-xl text-sm text-muted">
                    No on-chain activity found for this address. If you expected data, verify your BaseScan API key or try another address.
                </div>
            )}
            {/* Summary Hero */}
            <div className="glass-panel p-4 md:p-5 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-muted">Year in Review</span>
                    <div className="text-2xl md:text-3xl font-bold mt-1">
                        {stats.totalTransactions.toLocaleString()} txns • {stats.uniqueDaysActive} days
                    </div>
                    <div className="text-xs text-muted mt-1">
                        {stats.uniqueDApps} DApps • {stats.nftCount} NFTs • {stats.tokenTransfersIn} token rewards • {stats.gasSpentUsd ? `$${stats.gasSpentUsd.toFixed(0)} gas` : 'Gas N/A'}
                    </div>
                </div>
                <div className="hidden md:flex flex-col items-end">
                    <div className="text-xs text-muted">Active since</div>
                    <div className="text-sm font-mono text-foreground">{stats.firstActive || '—'}</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
                <StatsCard
                    label="Total Txns"
                    value={stats.totalTransactions}
                    icon={<Activity className="h-5 w-5" />}
                    delay={100}
                />
                <StatsCard
                    label="Gas Used (ETH)"
                    value={stats.totalTransactions === 0 ? '—' : parseFloat(stats.totalGasUsed).toFixed(4)}
                    subtext={stats.totalTransactions === 0 ? 'No txs yet' : (stats.gasSpentUsd ? `$${stats.gasSpentUsd.toFixed(2)}` : undefined)}
                    icon={<Zap className="h-5 w-5" />}
                    delay={200}
                />
                <StatsCard
                    label="Active Days"
                    value={stats.totalTransactions === 0 ? '—' : stats.uniqueDaysActive}
                    icon={<Calendar className="h-5 w-5" />}
                    delay={300}
                />
                <StatsCard
                    label="Top DApp"
                    value={stats.totalTransactions === 0 ? '—' : (stats.topInteractions[0]?.name || 'None')}
                    subtext={stats.topInteractions[0] ? 'Most interacted' : '-'}
                    icon={<TrendingUp className="h-5 w-5" />}
                    delay={400}
                />
                <StatsCard
                    label="Unique DApps"
                    value={stats.totalTransactions === 0 ? '—' : stats.uniqueDApps}
                    icon={<Layers className="h-5 w-5" />}
                    delay={500}
                />
                <StatsCard
                    label="NFTs"
                    value={stats.totalTransactions === 0 ? '—' : stats.nftCount}
                    icon={<Sparkles className="h-5 w-5" />}
                    delay={600}
                />
            </div>
                </motion.div>
            )}

            {/* Main Chart */}
            {tab === 'activity' && (
            <motion.div
                key="activity"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="glass-panel p-4 rounded-xl"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <span className="w-2 h-6 bg-primary rounded-full"></span>
                        Activity History
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                        {(['7d', '30d', '90d', '365d', 'all'] as const).map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-2 py-1 rounded-lg border transition-colors active:scale-95 ${timeRange === range ? 'bg-primary text-white border-primary' : 'bg-white/5 text-muted border-white/10 hover:text-foreground'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
                <ActivityChart data={filteredActivity} />
            </motion.div>
            )}

            {/* DApp Usage + Mini Apps */}
            {tab === 'apps' && (
            <motion.div
                key="apps"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-2 h-full"
            >
                <div className="glass-panel p-3 rounded-xl flex-1 min-h-[420px]">
                    <DAppUsageChart data={dappData} />
                </div>
            </motion.div>
            )}

            {/* Share */}
            {tab === 'share' && (
            <motion.div
                key="share"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-2 h-full"
            >
            <div className="glass-panel p-2.5 rounded-xl space-y-2 border border-primary/30 shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">Your Base Journey</h3>
                </div>
                <div className="rounded-xl overflow-hidden border border-primary/40 bg-[#1A73FF] aspect-[1200/630] max-h-[180px]">
                    {(stats.totalTransactions > 0 || stats.uniqueDaysActive > 0) ? (
                        <img
                            src={`/api/share-image?transactions=${stats.totalTransactions}&days=${stats.uniqueDaysActive}&dapps=${stats.uniqueDApps}&rewards=${stats.tokenTransfersIn}&handle=${encodeURIComponent(displayName)}&avatar=${encodeURIComponent(avatarUrl)}`}
                            alt="Share preview"
                            className="w-full h-full object-cover"
                            onError={(event) => {
                                const target = event.currentTarget;
                                target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted text-[11px]">
                            Share preview will appear after activity
                        </div>
                    )}
                </div>
            </div>

            {/* Badges */}
            <div className="glass-panel p-3 rounded-xl flex-1 min-h-[220px] border border-primary/20 shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
                <BadgeDisplay badges={badges} />
            </div>
            </motion.div>
            )}
            </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <div className="sticky bottom-0 left-0 right-0 z-20">
                <div className="mx-2 mb-2 grid grid-cols-4 gap-2 px-2 py-2 text-[11px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'activity', label: 'Activity' },
                        { id: 'apps', label: 'Apps' },
                        { id: 'share', label: 'Share' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setTab(item.id as typeof tab)}
                            className={`py-2 rounded-lg font-semibold active:scale-95 transition-transform ${
                                tab === item.id
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-muted'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-1">
                                {item.id === 'overview' && <Home className="h-4 w-4" />}
                                {item.id === 'activity' && <BarChart3 className="h-4 w-4" />}
                                {item.id === 'apps' && <Grid2x2 className="h-4 w-4" />}
                                {item.id === 'share' && <Share2 className="h-4 w-4" />}
                                <span className="text-[10px]">{item.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
