'use client';

export function StatsCardSkeleton() {
  return (
    <div className="glass-panel p-6 rounded-2xl animate-pulse">
      <div className="h-4 w-24 bg-white/10 rounded mb-3" />
      <div className="h-8 w-20 bg-white/10 rounded mb-2" />
      <div className="h-3 w-28 bg-white/10 rounded" />
    </div>
  );
}

export function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div className="glass-panel p-4 rounded-xl animate-pulse">
      <div className="h-5 w-40 bg-white/10 rounded mb-4" />
      <div className="w-full bg-white/5 rounded" style={{ height }} />
    </div>
  );
}
