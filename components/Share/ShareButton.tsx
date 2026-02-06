'use client';

import { useComposeCast } from '@coinbase/onchainkit/minikit';
import { Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonProps {
  address: string;
  displayName?: string;
  avatarUrl?: string;
  stats: {
    totalTransactions: number;
    uniqueDaysActive: number;
    uniqueDApps: number;
    tokenTransfersIn: number;
  };
}

export function ShareButton({ address, displayName, avatarUrl, stats }: ShareButtonProps) {
  const { composeCast } = useComposeCast();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const params = new URLSearchParams({
      transactions: stats.totalTransactions.toLocaleString(),
      days: stats.uniqueDaysActive.toString(),
      dapps: stats.uniqueDApps.toString(),
      rewards: stats.tokenTransfersIn.toString(),
      handle: displayName || (address.slice(0, 6) + '...' + address.slice(-4)),
    });
    if (avatarUrl) {
      params.set('avatar', avatarUrl);
    }

    const shareImageUrl = `/api/share-image?${params.toString()}`;
    const shareImageAbs = `${window.location.origin}${shareImageUrl}`;

    const text = `🎯 My Web3 Year in Review with ECHO CHARTS!

📊 ${stats.totalTransactions.toLocaleString()} transactions
⚡ ${stats.uniqueDaysActive} active days
🏆 ${stats.uniqueDApps} DApps explored
💰 ${stats.tokenTransfersIn} token rewards

Check yours at ${window.location.origin}`;

    if (!composeCast) {
      try {
        await navigator.clipboard.writeText(`${text}\n\n${window.location.origin}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        return;
      } catch (error) {
        console.error('Failed to copy share text:', error);
        return;
      }
    }

    try {
      await composeCast({
        text,
        embeds: [shareImageAbs],
      });
    } catch (error) {
      console.error('Failed to compose cast:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition-colors active:scale-95"
    >
      <Share2 className="h-4 w-4" />
      {copied ? 'Copied' : 'Share'}
    </button>
  );
}
