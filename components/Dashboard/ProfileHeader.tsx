'use client';

import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { Copy } from 'lucide-react';
import { useState } from 'react';

interface ProfileHeaderProps {
  address: string;
  onShare?: React.ReactNode;
}

export function ProfileHeader({ address, onShare }: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="glass-panel p-3 rounded-2xl flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Identity address={address} className="flex items-center gap-3">
          <Avatar className="h-10 w-10" />
          <div className="flex flex-col">
            <Name className="text-base font-semibold leading-tight" />
            <Address className="text-[10px] text-muted" />
          </div>
        </Identity>
        <div className="flex flex-col">
          <div className="text-[10px] text-muted uppercase tracking-wider">Profile</div>
          <div className="text-[11px] font-mono text-foreground/80">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-muted hover:text-foreground transition-colors active:scale-95"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
          {copied ? 'Copied' : 'Copy'}
        </button>
        {onShare}
      </div>
    </div>
  );
}
