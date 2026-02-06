'use client';

import type { Badge } from '@/lib/utils/badges';

const levelStyles: Record<Badge['level'], string> = {
  bronze: 'from-[#1E3A8A] to-[#2563EB]',
  silver: 'from-[#0EA5E9] to-[#22D3EE]',
  gold: 'from-[#2563EB] to-[#60A5FA]',
  diamond: 'from-[#3B82F6] to-[#8B5CF6]',
};

export function BadgeDisplay({ badges }: { badges: Badge[] }) {
  return (
    <div className="h-full flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Badges & Achievements</h3>
        <span className="text-[10px] text-muted">{badges.length} unlocked</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {badges.slice(0, 4).map(badge => (
          <div
            key={badge.id}
            className="p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <div
              className={`w-full h-12 rounded-lg bg-gradient-to-br ${levelStyles[badge.level]} mb-2`}
            />
            <div className="text-[13px] font-semibold truncate">{badge.name}</div>
            <div className="text-[11px] text-muted truncate">{badge.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
