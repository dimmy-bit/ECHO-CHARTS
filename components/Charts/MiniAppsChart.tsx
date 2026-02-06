'use client';

interface MiniAppItem {
  appName: string;
  usageCount: number;
  category: string;
  deepLink?: string;
}

export function MiniAppsChart({ data }: { data: MiniAppItem[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-[140px] text-muted text-sm">No mini apps yet</div>;
  }

  const shown = data.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Top Mini Apps</h3>
        <span className="text-[10px] text-muted">365d</span>
      </div>

      <div className="space-y-2">
        {shown.map((app, idx) => (
          <div
            key={`${app.appName}-${idx}`}
            className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                {idx + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold truncate max-w-[150px]">{app.appName}</span>
                <span className="text-[10px] text-muted">{app.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-mono text-primary tabular-nums">{app.usageCount} uses</div>
              {app.deepLink && (
                <a
                  className="text-[10px] text-muted hover:text-foreground transition-colors"
                  href={app.deepLink}
                >
                  Open
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
