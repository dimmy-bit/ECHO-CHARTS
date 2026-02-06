'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Header } from '@/components/Dashboard/Header';
import { AddressInput } from '@/components/Dashboard/AddressInput';
import { Dashboard } from '@/components/Dashboard/Dashboard';

export const dynamic = 'force-dynamic';

function MiniKitAddressProvider({ onAddress }: { onAddress: (addr: string | null) => void }) {
  const { context } = useMiniKit();

  useEffect(() => {
    const anyContext = context as unknown as { user?: { address?: string; wallet?: { address?: string } } };
    const addr =
      anyContext?.user?.address ||
      anyContext?.user?.wallet?.address ||
      null;
    onAddress(addr);
  }, [context, onAddress]);

  return null;
}

function MiniKitReady() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  return null;
}

export default function Home() {
  const { address: connectedAddress, isConnected } = useAccount();
  const [viewAddress, setViewAddress] = useState<string | null>(null);
  const [resolvedDisplay, setResolvedDisplay] = useState<string | null>(null);
  const [contextAddress, setContextAddress] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // If user connects wallet, we can default to it, but manual input overrides
  const activeAddress = connectedAddress || contextAddress || viewAddress;

  useEffect(() => {
    if (isConnected && connectedAddress) {
      setViewAddress(null);
    }
  }, [isConnected, connectedAddress]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function resolveDisplay() {
      if (!activeAddress) {
        setResolvedDisplay(null);
        return;
      }
      if (activeAddress.endsWith('.eth') || activeAddress.endsWith('.base') || activeAddress.endsWith('.base.eth')) {
        setResolvedDisplay(activeAddress);
        return;
      }
      try {
        const response = await fetch(`/api/resolve?address=${encodeURIComponent(activeAddress)}`);
        if (!response.ok) {
          setResolvedDisplay(null);
          return;
        }
        const data = await response.json();
        if (!cancelled) {
          setResolvedDisplay(data.name || null);
        }
      } catch {
        if (!cancelled) setResolvedDisplay(null);
      }
    }
    resolveDisplay();
    return () => {
      cancelled = true;
    };
  }, [activeAddress]);

  return (
    <div className="flex flex-col h-full">
      <Header />
      {mounted && (
        <>
          <MiniKitReady />
          <MiniKitAddressProvider onAddress={setContextAddress} />
        </>
      )}

      {!activeAddress ? (
        <AddressInput onSubmit={setViewAddress} />
      ) : (
        <div className="flex flex-col w-full flex-1">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col">
              <span className="text-muted text-xs uppercase tracking-wider">Viewing Address</span>
              <span className="font-mono text-sm text-foreground/80">
                {resolvedDisplay || `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`}
              </span>
            </div>
            <button
              onClick={() => setViewAddress(null)}
              className="text-xs bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors text-foreground"
            >
              Change
            </button>
          </div>

          <Dashboard address={activeAddress} />
        </div>
      )}
    </div>
  );
}
