'use client';

interface DAppUsageItem {
  name: string;
  value: number;
  color: string;
  category?: string;
  iconText?: string;
}

export function DAppUsageChart({ data }: { data: DAppUsageItem[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-[140px] text-muted text-sm">No DApp usage yet</div>;
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const shown = data.slice(0, 5);

  return (
    <div className="h-full flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">DApp Usage</h3>
        <span className="text-[10px] text-muted">{total} txns</span>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-2">
        {shown.map(item => (
          <div key={`${item.name}-${item.value}`} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-semibold">
              {item.iconText || item.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-foreground truncate max-w-[140px]">{item.name}</span>
                <span className="text-muted tabular-nums">{item.value}</span>
              </div>
              {item.category && (
                <div className="mt-1 inline-flex items-center gap-2 text-[9px] text-muted/80">
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.category}
                </div>
              )}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${total ? Math.round((item.value / total) * 100) : 0}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
