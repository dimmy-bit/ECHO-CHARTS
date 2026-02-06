'use client';

interface RewardPoint {
  label: string;
  value: number;
  sublabel?: string;
}

export function RewardsChart({ data }: { data: RewardPoint[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-[160px] text-muted text-sm">No rewards data yet</div>;
  }

  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Rewards & Earnings</h3>
        <span className="text-[10px] text-muted">Estimate</span>
      </div>

      <div className="flex items-end gap-2 h-[120px]">
        {data.map(point => (
          <div key={point.label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-primary/30 rounded-t-lg"
              style={{ height: `${Math.round((point.value / max) * 100)}%` }}
            />
            <div className="text-[10px] text-muted">{point.label}</div>
            {point.sublabel && (
              <div className="text-[9px] text-muted/70 truncate max-w-[70px] text-center">{point.sublabel}</div>
            )}
            <div className="text-[10px] font-mono text-foreground">{point.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
