import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatsCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    icon?: ReactNode;
    className?: string;
    delay?: number;
}

export function StatsCard({ label, value, subtext, icon, className, delay = 0 }: StatsCardProps) {
    return (
        <div
            className={cn("glass-panel p-4 rounded-2xl min-h-[96px] flex flex-col relative overflow-hidden group hover:neon-border transition-all duration-300 active:scale-[0.98]", className)}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-2 z-10">
                <span className="text-muted text-[10px] font-medium uppercase tracking-wider">{label}</span>
                {icon && <div className="text-primary opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">{icon}</div>}
            </div>

            <div className="z-10 overflow-hidden">
                <h3 className="text-xl md:text-2xl font-bold mb-1 group-hover:text-primary transition-colors leading-tight tabular-nums truncate">
                    {value}
                </h3>
                {subtext && <p className="text-[10px] text-muted/80">{subtext}</p>}
            </div>

            {/* Background glow effect */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 blur-2xl rounded-full group-hover:bg-primary/20 transition-all" />
        </div>
    );
}
