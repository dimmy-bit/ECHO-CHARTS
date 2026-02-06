# 🚀 ECHO CHARTS - Complete Implementation SKILL Guide

## 📚 Table of Contents
1. [Project Setup](#1-project-setup)
2. [Environment Configuration](#2-environment-configuration)
3. [MiniKit Integration](#3-minikit-integration)
4. [Basescan API Integration](#4-basescan-api-integration)
5. [Data Processing](#5-data-processing)
6. [UI Components](#6-ui-components)
7. [Chart Implementation](#7-chart-implementation)
8. [Animations](#8-animations)
9. [Share Functionality](#9-share-functionality)
10. [Deployment](#10-deployment)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Project Setup

### Step 1.1: Create MiniKit Project

```bash
# Use the official MiniKit CLI
npx create-onchain --mini

# Project name
✔ What is your project named? … echo-charts

# Navigate to project
cd echo-charts

# Install dependencies
npm install
```

### Step 1.2: Install Additional Dependencies

```bash
# Charts and animations
npm install recharts framer-motion date-fns

# State management and data fetching
npm install zustand @tanstack/react-query

# Utilities
npm install clsx tailwind-merge zod

# Icons
npm install lucide-react

# Already included in template:
# @coinbase/onchainkit
# @farcaster/frame-sdk
# viem
# wagmi
```

### Step 1.3: Project Structure

```bash
echo-charts/
├── app/
│   ├── api/
│   │   ├── stats/
│   │   │   └── route.ts
│   │   ├── transactions/
│   │   │   └── route.ts
│   │   ├── dapps/
│   │   │   └── route.ts
│   │   ├── share-image/
│   │   │   └── route.ts
│   │   └── webhook/
│   │       └── route.ts
│   ├── [address]/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── address/
│   │   ├── AddressInput.tsx
│   │   ├── ProfileHeader.tsx
│   │   └── ConnectWalletButton.tsx
│   ├── stats/
│   │   ├── StatsCard.tsx
│   │   ├── SummaryGrid.tsx
│   │   ├── BadgeDisplay.tsx
│   │   └── ProgressBar.tsx
│   ├── charts/
│   │   ├── ActivityChart.tsx
│   │   ├── DAppUsageChart.tsx
│   │   ├── RewardsChart.tsx
│   │   └── MiniAppsChart.tsx
│   ├── share/
│   │   ├── ShareButton.tsx
│   │   ├── ShareCard.tsx
│   │   └── GenerateImage.tsx
│   └── ui/
│       ├── card.tsx
│       ├── button.tsx
│       ├── badge.tsx
│       └── skeleton.tsx
├── lib/
│   ├── api/
│   │   ├── basescan.ts
│   │   ├── cache.ts
│   │   └── types.ts
│   ├── data/
│   │   ├── known-contracts.ts
│   │   ├── badges.ts
│   │   └── categories.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── calculations.ts
│   │   └── validators.ts
│   ├── hooks/
│   │   ├── useUserStats.ts
│   │   ├── useDAppData.ts
│   │   └── useBadges.ts
│   └── utils.ts
├── public/
│   ├── .well-known/
│   │   └── farcaster.json
│   ├── screenshots/
│   │   ├── portrait-1.png
│   │   ├── portrait-2.png
│   │   └── portrait-3.png
│   ├── icon.png
│   ├── splash.png
│   ├── hero.png
│   └── og-image.png
├── minikit.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 2. Environment Configuration

### Step 2.1: Get Required API Keys

**Basescan API Key:**
1. Visit: https://basescan.org/myapikey
2. Create account or login
3. Navigate to "API Keys"
4. Click "Add" to create new key
5. Copy API Key Token

**Coinbase Developer Platform (CDP) Key:**
1. Visit: https://portal.cdp.coinbase.com/
2. Create account or login
3. Create new project
4. Get API Key from project settings
5. Copy API Key

**Upstash Redis (Optional - for caching):**
1. Visit: https://upstash.com/
2. Create account
3. Create new Redis database
4. Copy connection details

### Step 2.2: Create Environment Files

**File: `.env.local`**

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ECHO CHARTS

# Basescan API (REQUIRED)
NEXT_PUBLIC_BASESCAN_API_KEY=your_basescan_api_key_here

# Coinbase Developer Platform (REQUIRED)
NEXT_PUBLIC_CDP_CLIENT_API_KEY=your_cdp_api_key_here

# OnchainKit Project ID
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=echo-charts

# Upstash Redis (OPTIONAL - for caching)
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your_redis_token

# ETH Price (can use a real API in production)
NEXT_PUBLIC_ETH_PRICE_USD=3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MUSIC_MODE=true

# Image URLs
NEXT_PUBLIC_ICON_URL=/icon.png
NEXT_PUBLIC_SPLASH_IMAGE=/splash.png
NEXT_PUBLIC_HERO_IMAGE=/hero.png
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=#0A0A0A
```

**File: `.env.production`**

```bash
# Production environment
NEXT_PUBLIC_APP_URL=https://echo-charts.base.app
NEXT_PUBLIC_APP_NAME=ECHO CHARTS
NEXT_PUBLIC_BASESCAN_API_KEY=your_production_basescan_key
NEXT_PUBLIC_CDP_CLIENT_API_KEY=your_production_cdp_key
# ... rest of production vars
```

### Step 2.3: Update Tailwind Config

**File: `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        base: {
          blue: "#0052FF",
          electric: "#0066FF",
          deep: "#0041CC",
        },
        
        // Chart colors
        chart: {
          1: "#0052FF",
          2: "#8B5CF6",
          3: "#EC4899",
          4: "#F59E0B",
          5: "#10B981",
        },
        
        // shadcn/ui colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'confetti': 'confetti 3s ease-out forwards',
      },
      
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### Step 2.4: Update Global Styles

**File: `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 4%;
    --foreground: 0 0% 98%;
    --card: 0 0% 10%;
    --card-foreground: 0 0% 98%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Glass effect */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #0052FF 0%, #0066FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Chart tooltips */
.recharts-tooltip-wrapper {
  outline: none !important;
}
```

---

## 3. MiniKit Integration

### Step 3.1: Configure MiniKit

**File: `minikit.config.ts`**

```typescript
const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const minikitConfig = {
  accountAssociation: {
    // Will be filled after signing with Farcaster
    header: "",
    payload: "",
    signature: ""
  },
  
  miniapp: {
    version: "1",
    name: "ECHO CHARTS",
    subtitle: "Your Web3 Year in Review",
    description: "Visualize your on-chain activity with beautiful charts and insights. Track transactions, DApp usage, rewards, and mini-app engagement on Base.",
    
    // Images (1024x1024 PNG for icon, 1200x630 for others)
    screenshotUrls: [
      `${ROOT_URL}/screenshots/portrait-1.png`,
      `${ROOT_URL}/screenshots/portrait-2.png`,
      `${ROOT_URL}/screenshots/portrait-3.png`
    ],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0A0A0A",
    heroImageUrl: `${ROOT_URL}/hero.png`,
    
    // URLs
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    
    // Metadata
    primaryCategory: "analytics",
    tags: ["analytics", "crypto", "personal", "social", "charts", "web3"],
    tagline: "Your Crypto Activity, Visualized",
    
    // Chains
    requiredChains: ["eip155:8453"], // Base mainnet
    
    // Open Graph
    ogTitle: "ECHO CHARTS – My Web3 Year in Review 2025",
    ogDescription: "Check out my on-chain stats for 2025! Track transactions, DApps, and rewards.",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
    
    // Development
    noindex: process.env.NODE_ENV === 'development'
  }
} as const;
```

### Step 3.2: Create MiniKit Provider

**File: `app/providers.tsx`**

```tsx
'use client';

import { ReactNode } from 'react';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MiniKitProvider
        apiKey={process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY!}
        chain={base}
        notificationProxyUrl="/api/notification"
      >
        {children}
      </MiniKitProvider>
    </QueryClientProvider>
  );
}
```

### Step 3.3: Update Root Layout

**File: `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { minikitConfig } from '@/minikit.config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: minikitConfig.miniapp.name,
  description: minikitConfig.miniapp.description,
  other: {
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: minikitConfig.miniapp.heroImageUrl,
      button: {
        title: `Launch ${minikitConfig.miniapp.name}`,
        action: {
          type: 'launch_frame',
          name: minikitConfig.miniapp.name,
          url: minikitConfig.miniapp.homeUrl,
          splashImageUrl: minikitConfig.miniapp.splashImageUrl,
          splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Step 3.4: Create Farcaster Manifest Route

**File: `app/.well-known/farcaster.json/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { minikitConfig } from '@/minikit.config';

export async function GET() {
  return NextResponse.json(minikitConfig, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
```

---

## 4. Basescan API Integration

### Step 4.1: Create API Client

**File: `lib/api/basescan.ts`**

```typescript
const BASESCAN_API_URL = 'https://api.basescan.org/api';
const API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;

interface BasescanResponse<T> {
  status: string;
  message: string;
  result: T;
}

export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  isError: string;
  contractAddress: string;
}

export interface TokenTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  contractAddress: string;
}

export interface GasPrice {
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
  suggestBaseFee: string;
  gasUsedRatio: string;
}

class BasescanClient {
  private async fetch<T>(params: Record<string, string>): Promise<T> {
    const url = new URL(BASESCAN_API_URL);
    
    // Add API key
    url.searchParams.append('apikey', API_KEY || '');
    
    // Add other params
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Basescan API error: ${response.statusText}`);
    }

    const data: BasescanResponse<T> = await response.json();
    
    if (data.status !== '1' && data.message !== 'No transactions found') {
      throw new Error(data.message || 'API request failed');
    }

    return data.result;
  }

  /**
   * Get normal transactions for an address
   */
  async getTransactions(
    address: string,
    startBlock = 0,
    endBlock = 99999999
  ): Promise<Transaction[]> {
    return this.fetch<Transaction[]>({
      module: 'account',
      action: 'txlist',
      address,
      startblock: startBlock.toString(),
      endblock: endBlock.toString(),
      page: '1',
      offset: '10000', // Max allowed
      sort: 'desc'
    });
  }

  /**
   * Get ERC-20 token transactions
   */
  async getTokenTransactions(address: string): Promise<TokenTransaction[]> {
    return this.fetch<TokenTransaction[]>({
      module: 'account',
      action: 'tokentx',
      address,
      page: '1',
      offset: '10000',
      sort: 'desc'
    });
  }

  /**
   * Get internal transactions
   */
  async getInternalTransactions(address: string): Promise<Transaction[]> {
    return this.fetch<Transaction[]>({
      module: 'account',
      action: 'txlistinternal',
      address,
      page: '1',
      offset: '10000',
      sort: 'desc'
    });
  }

  /**
   * Get NFT (ERC-721) transactions
   */
  async getNFTTransactions(address: string): Promise<TokenTransaction[]> {
    return this.fetch<TokenTransaction[]>({
      module: 'account',
      action: 'tokennfttx',
      address,
      page: '1',
      offset: '10000',
      sort: 'desc'
    });
  }

  /**
   * Get current gas prices
   */
  async getGasPrice(): Promise<GasPrice> {
    return this.fetch<GasPrice>({
      module: 'gastracker',
      action: 'gasoracle'
    });
  }

  /**
   * Get ETH balance for an address
   */
  async getBalance(address: string): Promise<string> {
    return this.fetch<string>({
      module: 'account',
      action: 'balance',
      address,
      tag: 'latest'
    });
  }
}

export const basescan = new BasescanClient();
```

### Step 4.2: Create Cache Helper

**File: `lib/api/cache.ts`**

```typescript
import { Redis } from '@upstash/redis';

// Initialize Redis (optional)
const redis = process.env.UPSTASH_REDIS_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN!,
    })
  : null;

// In-memory cache fallback
const memoryCache = new Map<string, { data: any; expires: number }>();

export const CACHE_DURATIONS = {
  TRANSACTIONS: 60 * 5,      // 5 minutes
  STATS: 60 * 10,            // 10 minutes
  DAPP_MAPPINGS: 60 * 60,    // 1 hour
  GAS_PRICE: 60,             // 1 minute
};

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  duration: number
): Promise<T> {
  try {
    // Try Redis first
    if (redis) {
      const cached = await redis.get(key);
      if (cached) return cached as T;
    } else {
      // Try memory cache
      const cached = memoryCache.get(key);
      if (cached && cached.expires > Date.now()) {
        return cached.data;
      }
    }

    // Fetch fresh data
    const data = await fetcher();

    // Cache it
    if (redis) {
      await redis.setex(key, duration, JSON.stringify(data));
    } else {
      memoryCache.set(key, {
        data,
        expires: Date.now() + duration * 1000,
      });
    }

    return data;
  } catch (error) {
    console.error('Cache error:', error);
    // Fallback to direct fetch
    return fetcher();
  }
}

export function invalidateCache(key: string) {
  if (redis) {
    redis.del(key);
  } else {
    memoryCache.delete(key);
  }
}
```

---

## 5. Data Processing

### Step 5.1: Create Type Definitions

**File: `lib/api/types.ts`**

```typescript
export interface UserStats {
  address: string;
  totalTransactions: number;
  daysActive: number;
  uniqueDApps: number;
  totalRewards: {
    eth: number;
    usd: number;
  };
  gasSpent: {
    eth: number;
    usd: number;
  };
  nftCount: number;
  miniAppsUsed: number;
  firstTransaction: Date;
  lastTransaction: Date;
}

export interface DAppUsage {
  address: string;
  name: string;
  category: 'DEX' | 'Lending' | 'Gaming' | 'NFT' | 'Social' | 'Other';
  transactionCount: number;
  percentage: number;
  icon?: string;
}

export interface ActivityData {
  date: string;
  transactions: number;
  volume: number; // in ETH
  gasSpent: number; // in ETH
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  level: 'bronze' | 'silver' | 'gold' | 'diamond';
  icon: string;
  unlocked: boolean;
}

export interface MiniAppUsage {
  appName: string;
  iconUrl: string;
  usageCount: number;
  lastUsed: Date;
  category: string;
}
```

### Step 5.2: Create Known Contracts Database

**File: `lib/data/known-contracts.ts`**

```typescript
export interface KnownContract {
  address: string;
  name: string;
  category: 'DEX' | 'Lending' | 'Gaming' | 'NFT' | 'Social' | 'Bridge' | 'Other';
  icon?: string;
}

export const KNOWN_CONTRACTS: Record<string, KnownContract> = {
  // DEXes
  '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24': {
    address: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
    name: 'Uniswap V3: Router',
    category: 'DEX',
  },
  '0x2626664c2603336e57b271c5c0b26f421741e481': {
    address: '0x2626664c2603336e57b271c5c0b26f421741e481',
    name: 'BaseSwap',
    category: 'DEX',
  },
  
  // NFT Marketplaces
  '0x00000000000000adc04c56bf30ac9d3c0aaf14dc': {
    address: '0x00000000000000adc04c56bf30ac9d3c0aaf14dc',
    name: 'OpenSea: Seaport',
    category: 'NFT',
  },
  
  // Gaming
  '0x...': {
    address: '0x...',
    name: 'Example Game',
    category: 'Gaming',
  },
  
  // Add more contracts as needed
};

export function getContractInfo(address: string): KnownContract {
  const lowercaseAddress = address.toLowerCase();
  return KNOWN_CONTRACTS[lowercaseAddress] || {
    address,
    name: 'Unknown Contract',
    category: 'Other',
  };
}
```

### Step 5.3: Create Stats Calculation Logic

**File: `lib/utils/calculations.ts`**

```typescript
import { Transaction, TokenTransaction } from '@/lib/api/basescan';
import { UserStats, DAppUsage, ActivityData } from '@/lib/api/types';
import { getContractInfo } from '@/lib/data/known-contracts';

const ETH_PRICE = parseFloat(process.env.NEXT_PUBLIC_ETH_PRICE_USD || '3000');

export function calculateUserStats(
  transactions: Transaction[],
  tokenTransactions: TokenTransaction[],
  nftTransactions: TokenTransaction[]
): UserStats {
  if (transactions.length === 0) {
    throw new Error('No transactions found for this address');
  }

  // Calculate unique days active
  const uniqueDays = new Set(
    transactions.map(tx => {
      const date = new Date(parseInt(tx.timeStamp) * 1000);
      return date.toDateString();
    })
  );

  // Calculate total gas spent
  const totalGas = transactions.reduce((sum, tx) => {
    const gasUsed = BigInt(tx.gasUsed);
    const gasPrice = BigInt(tx.gasPrice);
    return sum + (gasUsed * gasPrice);
  }, BigInt(0));

  const gasEth = Number(totalGas) / 1e18;

  // Get unique DApps
  const dappAddresses = new Set(
    transactions
      .map(tx => tx.to)
      .filter(addr => addr && addr !== '')
  );

  // Calculate rewards (incoming token transfers)
  const address = transactions[0].from.toLowerCase();
  const rewards = tokenTransactions
    .filter(tx => tx.to.toLowerCase() === address)
    .reduce((sum, tx) => {
      const value = parseFloat(tx.value);
      const decimals = parseInt(tx.tokenDecimal);
      return sum + (value / Math.pow(10, decimals));
    }, 0);

  // Get first and last transaction dates
  const timestamps = transactions.map(tx => parseInt(tx.timeStamp));
  const firstTx = new Date(Math.min(...timestamps) * 1000);
  const lastTx = new Date(Math.max(...timestamps) * 1000);

  return {
    address,
    totalTransactions: transactions.length,
    daysActive: uniqueDays.size,
    uniqueDApps: dappAddresses.size,
    totalRewards: {
      eth: rewards,
      usd: rewards * ETH_PRICE,
    },
    gasSpent: {
      eth: gasEth,
      usd: gasEth * ETH_PRICE,
    },
    nftCount: nftTransactions.length,
    miniAppsUsed: 0, // Will calculate separately
    firstTransaction: firstTx,
    lastTransaction: lastTx,
  };
}

export function calculateDAppUsage(
  transactions: Transaction[]
): DAppUsage[] {
  const dappMap = new Map<string, number>();

  transactions.forEach(tx => {
    if (tx.to) {
      const count = dappMap.get(tx.to) || 0;
      dappMap.set(tx.to, count + 1);
    }
  });

  const total = transactions.length;
  const dapps: DAppUsage[] = [];

  dappMap.forEach((count, address) => {
    const info = getContractInfo(address);
    dapps.push({
      address,
      name: info.name,
      category: info.category,
      transactionCount: count,
      percentage: (count / total) * 100,
      icon: info.icon,
    });
  });

  // Sort by transaction count
  dapps.sort((a, b) => b.transactionCount - a.transactionCount);

  return dapps.slice(0, 10); // Top 10
}

export function calculateActivityData(
  transactions: Transaction[],
  timeRange: '7d' | '30d' | '90d' | '365d' | 'all'
): ActivityData[] {
  const now = Date.now();
  const ranges: Record<string, number> = {
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
    '365d': 365 * 24 * 60 * 60 * 1000,
    'all': Infinity,
  };

  const cutoff = now - ranges[timeRange];

  // Filter transactions by time range
  const filtered = transactions.filter(tx => {
    const timestamp = parseInt(tx.timeStamp) * 1000;
    return timestamp >= cutoff;
  });

  // Group by date
  const byDate = new Map<string, Transaction[]>();

  filtered.forEach(tx => {
    const date = new Date(parseInt(tx.timeStamp) * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    if (!byDate.has(dateStr)) {
      byDate.set(dateStr, []);
    }
    byDate.get(dateStr)!.push(tx);
  });

  // Calculate stats for each date
  const activityData: ActivityData[] = [];

  byDate.forEach((txs, dateStr) => {
    const volume = txs.reduce((sum, tx) => {
      return sum + (parseFloat(tx.value) / 1e18);
    }, 0);

    const gasSpent = txs.reduce((sum, tx) => {
      const gasUsed = BigInt(tx.gasUsed);
      const gasPrice = BigInt(tx.gasPrice);
      return sum + Number(gasUsed * gasPrice);
    }, 0) / 1e18;

    activityData.push({
      date: dateStr,
      transactions: txs.length,
      volume,
      gasSpent,
    });
  });

  // Sort by date
  activityData.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return activityData;
}
```

### Step 5.4: Create Badge System

**File: `lib/data/badges.ts`**

```typescript
import { Badge, UserStats } from '@/lib/api/types';

export const BADGES: Record<string, Omit<Badge, 'unlocked'>> = {
  'getting-started': {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Made your first 10 transactions',
    level: 'bronze',
    icon: '🎯',
  },
  'gas-warrior': {
    id: 'gas-warrior',
    name: 'Gas Warrior',
    description: 'Completed 100+ transactions',
    level: 'silver',
    icon: '⚡',
  },
  'chain-legend': {
    id: 'chain-legend',
    name: 'Chain Legend',
    description: 'Reached 1,000 transactions',
    level: 'gold',
    icon: '👑',
  },
  'yield-hunter': {
    id: 'yield-hunter',
    name: 'Yield Hunter',
    description: 'Earned $1,000+ in rewards',
    level: 'gold',
    icon: '💰',
  },
  'whale': {
    id: 'whale',
    name: 'Whale',
    description: 'Earned $10,000+ in rewards',
    level: 'diamond',
    icon: '🐋',
  },
  'explorer': {
    id: 'explorer',
    name: 'Explorer',
    description: 'Used 10+ different DApps',
    level: 'bronze',
    icon: '🧭',
  },
  'ecosystem-pro': {
    id: 'ecosystem-pro',
    name: 'Ecosystem Pro',
    description: 'Used 50+ different DApps',
    level: 'gold',
    icon: '🌐',
  },
  'consistent': {
    id: 'consistent',
    name: 'Consistent',
    description: 'Active for 100+ days',
    level: 'gold',
    icon: '📅',
  },
  'year-veteran': {
    id: 'year-veteran',
    name: 'Year Veteran',
    description: 'Active for 365+ days',
    level: 'diamond',
    icon: '🏆',
  },
  'nft-collector': {
    id: 'nft-collector',
    name: 'NFT Collector',
    description: 'Collected 10+ NFTs',
    level: 'silver',
    icon: '🖼️',
  },
};

export function calculateBadges(stats: UserStats): Badge[] {
  const badges: Badge[] = [];

  // Transaction badges
  if (stats.totalTransactions >= 1000) {
    badges.push({ ...BADGES['chain-legend'], unlocked: true });
  } else if (stats.totalTransactions >= 100) {
    badges.push({ ...BADGES['gas-warrior'], unlocked: true });
  } else if (stats.totalTransactions >= 10) {
    badges.push({ ...BADGES['getting-started'], unlocked: true });
  }

  // Rewards badges
  if (stats.totalRewards.usd >= 10000) {
    badges.push({ ...BADGES['whale'], unlocked: true });
  } else if (stats.totalRewards.usd >= 1000) {
    badges.push({ ...BADGES['yield-hunter'], unlocked: true });
  }

  // DApp exploration badges
  if (stats.uniqueDApps >= 50) {
    badges.push({ ...BADGES['ecosystem-pro'], unlocked: true });
  } else if (stats.uniqueDApps >= 10) {
    badges.push({ ...BADGES['explorer'], unlocked: true });
  }

  // Activity badges
  if (stats.daysActive >= 365) {
    badges.push({ ...BADGES['year-veteran'], unlocked: true });
  } else if (stats.daysActive >= 100) {
    badges.push({ ...BADGES['consistent'], unlocked: true });
  }

  // NFT badges
  if (stats.nftCount >= 10) {
    badges.push({ ...BADGES['nft-collector'], unlocked: true });
  }

  return badges;
}
```

---

## 6. UI Components

### Step 6.1: Create Address Input

**File: `components/address/AddressInput.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isAddress } from 'viem';

export function AddressInput() {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address) {
      setError('Please enter an address');
      return;
    }

    // Validate address format
    if (!isAddress(address)) {
      setError('Invalid address format');
      return;
    }

    // Navigate to address page
    router.push(`/${address}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter wallet address or ENS name"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="pr-12 h-14 text-lg"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-1 top-1 h-12 w-12"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </form>
  );
}
```

### Step 6.2: Create Stats Card

**File: `components/stats/StatsCard.tsx`**

```tsx
'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  badge?: {
    level: 'bronze' | 'silver' | 'gold' | 'diamond';
    icon: string;
  };
  delay?: number;
}

const levelColors = {
  bronze: 'from-orange-600 to-orange-800',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-yellow-600',
  diamond: 'from-blue-400 to-purple-600',
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  badge,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden glass p-6 h-full">
        {/* Badge overlay */}
        {badge && (
          <div className="absolute top-3 right-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xl",
              "bg-gradient-to-br",
              levelColors[badge.level]
            )}>
              {badge.icon}
            </div>
          </div>
        )}

        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-base-blue/10 text-base-blue">
            {icon}
          </div>
          
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                trend.direction === 'up' && 'text-green-500',
                trend.direction === 'down' && 'text-red-500',
                trend.direction === 'neutral' && 'text-muted-foreground'
              )}
            >
              {trend.direction === 'up' && <TrendingUp className="h-4 w-4" />}
              {trend.direction === 'down' && <TrendingDown className="h-4 w-4" />}
              {Math.abs(trend.value).toFixed(1)}%
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl font-bold font-mono">
            {value}
          </div>
        </div>

        {/* Title */}
        <p className="text-sm text-muted-foreground">{title}</p>
        
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </Card>
    </motion.div>
  );
}
```

---

Due to character limits, I'll create the rest of the SKILL.md in the next file. Let me continue:
# 🚀 ECHO CHARTS - SKILL Guide Part 2

## 7. Chart Implementation

### Step 7.1: Activity Chart

**File: `components/charts/ActivityChart.tsx`**

```tsx
'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivityData } from '@/lib/api/types';
import { motion } from 'framer-motion';

interface ActivityChartProps {
  data: ActivityData[];
  onRangeChange?: (range: '7d' | '30d' | '90d' | '365d' | 'all') => void;
}

const TIME_RANGES = [
  { label: '7D', value: '7d' as const },
  { label: '30D', value: '30d' as const },
  { label: '90D', value: '90d' as const },
  { label: '1Y', value: '365d' as const },
  { label: 'All', value: 'all' as const },
];

export function ActivityChart({ data, onRangeChange }: ActivityChartProps) {
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d' | '365d' | 'all'>('30d');

  const handleRangeChange = (range: typeof selectedRange) => {
    setSelectedRange(range);
    onRangeChange?.(range);
  };

  return (
    <Card className="glass p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Activity Over Time</h3>
        
        <div className="flex gap-2">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.value}
              variant={selectedRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRangeChange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0052FF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            
            <XAxis
              dataKey="date"
              stroke="rgba(255, 255, 255, 0.5)"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            
            <YAxis
              stroke="rgba(255, 255, 255, 0.5)"
              fontSize={12}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            
            <Area
              type="monotone"
              dataKey="transactions"
              stroke="#0052FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTx)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
}
```

### Step 7.2: DApp Usage Donut Chart

**File: `components/charts/DAppUsageChart.tsx`**

```tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { DAppUsage } from '@/lib/api/types';

interface DAppUsageChartProps {
  data: DAppUsage[];
}

const COLORS = ['#0052FF', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

export function DAppUsageChart({ data }: DAppUsageChartProps) {
  const chartData = data.slice(0, 5).map((dapp) => ({
    name: dapp.name,
    value: dapp.transactionCount,
  }));

  return (
    <Card className="glass p-6">
      <h3 className="text-lg font-semibold mb-6">Top DApps</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.slice(0, 5).map((dapp, index) => (
          <div key={dapp.address} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-muted-foreground">{dapp.name}</span>
            </div>
            <span className="font-mono">{dapp.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

### Step 7.3: Create Main Dashboard Page

**File: `app/[address]/page.tsx`**

```tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { isAddress } from 'viem';
import { ProfileHeader } from '@/components/address/ProfileHeader';
import { StatsCard } from '@/components/stats/StatsCard';
import { ActivityChart } from '@/components/charts/ActivityChart';
import { DAppUsageChart } from '@/components/charts/DAppUsageChart';
import { ShareButton } from '@/components/share/ShareButton';
import { Activity, Zap, Users, Fuel, Award, Calendar } from 'lucide-react';
import { basescan } from '@/lib/api/basescan';
import { calculateUserStats, calculateDAppUsage, calculateActivityData } from '@/lib/utils/calculations';
import { calculateBadges } from '@/lib/data/badges';
import { getCached, CACHE_DURATIONS } from '@/lib/api/cache';

interface PageProps {
  params: {
    address: string;
  };
}

async function getAddressData(address: string) {
  return getCached(
    `address:${address}`,
    async () => {
      const [transactions, tokenTxs, nftTxs] = await Promise.all([
        basescan.getTransactions(address),
        basescan.getTokenTransactions(address),
        basescan.getNFTTransactions(address),
      ]);

      const stats = calculateUserStats(transactions, tokenTxs, nftTxs);
      const dappUsage = calculateDAppUsage(transactions);
      const activityData = calculateActivityData(transactions, '30d');
      const badges = calculateBadges(stats);

      return { stats, dappUsage, activityData, badges };
    },
    CACHE_DURATIONS.STATS
  );
}

export default async function AddressPage({ params }: PageProps) {
  const { address } = params;

  // Validate address
  if (!isAddress(address)) {
    notFound();
  }

  // Fetch data
  const data = await getAddressData(address);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 glass">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold gradient-text">ECHO CHARTS</h1>
            <ShareButton stats={data.stats} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <ProfileHeader address={address} badges={data.badges} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <StatsCard
            title="Total Transactions"
            value={data.stats.totalTransactions.toLocaleString()}
            subtitle="All time"
            icon={<Activity className="w-6 h-6" />}
            delay={0}
          />
          
          <StatsCard
            title="Days Active"
            value={data.stats.daysActive}
            subtitle={`Since ${data.stats.firstTransaction.toLocaleDateString()}`}
            icon={<Calendar className="w-6 h-6" />}
            delay={0.1}
          />
          
          <StatsCard
            title="DApps Used"
            value={data.stats.uniqueDApps}
            subtitle="Unique contracts"
            icon={<Users className="w-6 h-6" />}
            delay={0.2}
          />
          
          <StatsCard
            title="Gas Spent"
            value={`${data.stats.gasSpent.eth.toFixed(4)} ETH`}
            subtitle={`$${data.stats.gasSpent.usd.toLocaleString()}`}
            icon={<Fuel className="w-6 h-6" />}
            delay={0.3}
          />
          
          <StatsCard
            title="Rewards Earned"
            value={`$${data.stats.totalRewards.usd.toFixed(2)}`}
            subtitle={`${data.stats.totalRewards.eth.toFixed(4)} ETH`}
            icon={<Award className="w-6 h-6" />}
            delay={0.4}
          />
          
          <StatsCard
            title="NFTs"
            value={data.stats.nftCount}
            subtitle="Collected"
            icon={<Zap className="w-6 h-6" />}
            delay={0.5}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <ActivityChart data={data.activityData} />
          </div>
          
          <div>
            <DAppUsageChart data={data.dappUsage} />
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## 8. Animations

### Step 8.1: Confetti Animation

**File: `lib/utils/confetti.ts`**

```typescript
export function triggerConfetti() {
  // Simple confetti using CSS
  const colors = ['#0052FF', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      opacity: 1;
      animation: confetti 3s ease-out forwards;
      z-index: 9999;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
  }
}

// Add keyframes to global CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes confetti {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
```

### Step 8.2: Badge Unlock Animation

**File: `components/stats/BadgeDisplay.tsx`**

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/lib/api/types';
import { Card } from '@/components/ui/card';

interface BadgeDisplayProps {
  badges: Badge[];
}

const levelColors = {
  bronze: 'from-orange-600 to-orange-800',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-yellow-600',
  diamond: 'from-blue-400 to-purple-600',
};

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <Card className="glass p-6">
      <h3 className="text-lg font-semibold mb-4">Achievements</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <AnimatePresence>
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <div
                className={`
                  w-full aspect-square rounded-xl
                  bg-gradient-to-br ${levelColors[badge.level]}
                  flex flex-col items-center justify-center
                  p-4
                  cursor-pointer
                `}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-xs text-center font-medium">
                  {badge.name}
                </div>
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                <div className="bg-black/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {badge.description}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
```

---

## 9. Share Functionality

### Step 9.1: Share Button Component

**File: `components/share/ShareButton.tsx`**

```tsx
'use client';

import { useComposeCast } from '@coinbase/onchainkit/minikit';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { UserStats } from '@/lib/api/types';

interface ShareButtonProps {
  stats: UserStats;
}

export function ShareButton({ stats }: ShareButtonProps) {
  const { composeCast } = useComposeCast();

  const handleShare = async () => {
    const text = `🎯 My Web3 Year in Review with ECHO CHARTS!

📊 ${stats.totalTransactions.toLocaleString()} transactions
⚡ ${stats.daysActive} active days
🏆 ${stats.uniqueDApps} DApps explored
💰 $${stats.totalRewards.usd.toFixed(2)} earned

Check yours at ${window.location.origin}`;

    try {
      await composeCast({
        text,
        embeds: [window.location.href],
      });
    } catch (error) {
      console.error('Failed to compose cast:', error);
    }
  };

  return (
    <Button onClick={handleShare} className="gap-2">
      <Share2 className="w-4 h-4" />
      Share on Farcaster
    </Button>
  );
}
```

### Step 9.2: Generate Share Image API

**File: `app/api/share-image/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const transactions = searchParams.get('transactions') || '0';
  const days = searchParams.get('days') || '0';
  const dapps = searchParams.get('dapps') || '0';
  const rewards = searchParams.get('rewards') || '$0';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          backgroundImage: 'linear-gradient(135deg, #0052FF 0%, #0066FF 100%)',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 40 }}>
          ECHO CHARTS
        </div>
        
        <div style={{ fontSize: 32, color: 'white', marginBottom: 60 }}>
          My Web3 Year in Review
        </div>

        <div style={{ display: 'flex', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>{transactions}</div>
            <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)' }}>Transactions</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>{days}</div>
            <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)' }}>Days Active</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>{dapps}</div>
            <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)' }}>DApps Used</div>
          </div>
        </div>

        <div style={{ fontSize: 28, color: 'white', marginTop: 60 }}>
          💰 {rewards} Earned
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

---

## 10. Deployment

### Step 10.1: Build & Test Locally

```bash
# Build the project
npm run build

# Test production build
npm start

# Visit http://localhost:3000
```

### Step 10.2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Step 10.3: Configure Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all variables from `.env.production`

### Step 10.4: Sign Manifest with Base

**Using Base.dev:**

1. Visit: https://base.dev/
2. Login with your Farcaster account
3. Go to "Mini Apps" → "Preview"
4. Enter your production URL
5. Click "Verify" → "Sign"
6. Copy the `accountAssociation` object
7. Update `minikit.config.ts`:

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjEyMzQ1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4Li4uIn0",
    payload: "eyJkb21haW4iOiJlY2hvLWNoYXJ0cy5iYXNlLmFwcCJ9",
    signature: "0x..."
  },
  // ... rest of config
};
```

8. Commit and push to trigger redeployment

### Step 10.5: Submit for Verification

**In Base.dev:**

1. Go to Dashboard → Mini Apps
2. Click "Submit for Verification"
3. Fill out the form:
   - App name: ECHO CHARTS
   - Description: (copy from PRD)
   - Category: Analytics
   - Tags: analytics, crypto, personal, social, charts
4. Upload assets:
   - Icon (1024×1024 PNG)
   - Hero image (1200×630 PNG)
   - 3 screenshots (1284×2778 PNG)
5. Submit

### Step 10.6: Test in Base App

1. Open Base App or Warpcast
2. Search for your mini app URL
3. Test all functionality
4. Check share functionality
5. Verify analytics tracking

---

## 11. Troubleshooting

### Common Issues

**Issue 1: "API Key Invalid"**

```
Solution: Check that your Basescan API key is correct in .env.local
Verify at: https://basescan.org/myapikey
```

**Issue 2: "Network Error" when fetching data**

```typescript
// Add error handling in API calls
try {
  const data = await basescan.getTransactions(address);
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Implement exponential backoff
    await new Promise(resolve => setTimeout(resolve, 1000));
    return retry();
  }
  throw error;
}
```

**Issue 3: Charts not rendering**

```
Solution: Ensure recharts is installed and data is in correct format
Check browser console for errors
Verify data structure matches chart expectations
```

**Issue 4: MiniKit not initializing**

```tsx
// Make sure to call setFrameReady
useEffect(() => {
  if (!isFrameReady) {
    setFrameReady();
  }
}, [setFrameReady, isFrameReady]);
```

**Issue 5: Share button not working**

```
Solution: Check that composeCast hook is available
Verify you're testing in Farcaster environment
Test with real Farcaster client, not browser
```

**Issue 6: Manifest not loading**

```
Solution: Check that farcaster.json is accessible
Visit: https://your-domain/.well-known/farcaster.json
Verify CORS headers are set
Check JSON syntax
```

---

## 12. Performance Optimization

### Step 12.1: Implement Rate Limiting

**File: `lib/api/rate-limiter.ts`**

```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastRequest = 0;
  private minInterval = 200; // 5 requests per second

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequest;

      if (timeSinceLastRequest < this.minInterval) {
        await new Promise(resolve => 
          setTimeout(resolve, this.minInterval - timeSinceLastRequest)
        );
      }

      const fn = this.queue.shift();
      if (fn) {
        this.lastRequest = Date.now();
        await fn();
      }
    }

    this.processing = false;
  }
}

export const rateLimiter = new RateLimiter();

// Usage in basescan.ts
async getTransactions(address: string) {
  return rateLimiter.add(() => this.fetch<Transaction[]>({...}));
}
```

### Step 12.2: Add Loading States

**File: `components/LoadingStates.tsx`**

```tsx
import { Skeleton } from '@/components/ui/skeleton';

export function StatsCardSkeleton() {
  return (
    <div className="glass p-6 rounded-lg">
      <Skeleton className="h-12 w-12 rounded-xl mb-4" />
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass p-6 rounded-lg">
      <Skeleton className="h-6 w-48 mb-6" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}
```

---

## 13. Analytics & Monitoring

### Step 13.1: Add Vercel Analytics

```bash
npm install @vercel/analytics
```

**File: `app/layout.tsx`**

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
```

### Step 13.2: Track Custom Events

**File: `lib/analytics.ts`**

```typescript
import { track } from '@vercel/analytics';

export function trackEvent(event: string, properties?: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
    track(event, properties);
  }
}

// Usage examples
trackEvent('address_searched', { address: '0x...' });
trackEvent('stats_loaded', { address, loadTime: 1234 });
trackEvent('share_clicked', { platform: 'farcaster' });
trackEvent('badge_unlocked', { badgeId: 'gas-warrior' });
```

---

## 14. Testing

### Step 14.1: Unit Tests

**File: `__tests__/calculations.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { calculateUserStats } from '@/lib/utils/calculations';

describe('calculateUserStats', () => {
  it('calculates total transactions correctly', () => {
    const mockTransactions = [
      { /* ... */ },
      { /* ... */ },
    ];
    
    const stats = calculateUserStats(mockTransactions, [], []);
    
    expect(stats.totalTransactions).toBe(2);
  });

  it('calculates gas spent correctly', () => {
    // Test implementation
  });
});
```

### Step 14.2: E2E Tests

```bash
npm install -D @playwright/test
```

**File: `tests/e2e/address-page.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test('should load address page', async ({ page }) => {
  await page.goto('/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  
  await expect(page.getByText('ECHO CHARTS')).toBeVisible();
  await expect(page.getByText('Total Transactions')).toBeVisible();
});

test('should share to Farcaster', async ({ page }) => {
  await page.goto('/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  
  await page.click('text=Share on Farcaster');
  
  // Verify share modal or action
});
```

---

## 15. Production Checklist

### Pre-Launch

- [ ] All environment variables set in Vercel
- [ ] Basescan API key working
- [ ] CDP API key configured
- [ ] Redis cache configured (optional)
- [ ] All images uploaded and accessible
- [ ] Manifest signed with Farcaster
- [ ] App verified on Base.dev
- [ ] Analytics tracking working
- [ ] Error tracking setup
- [ ] Performance audit passed (Lighthouse)
- [ ] Mobile testing complete
- [ ] Cross-browser testing done

### Assets Checklist

- [ ] Icon (1024×1024 PNG, no transparency)
- [ ] Splash image (1200×630 PNG)
- [ ] Hero image (1200×630 PNG)
- [ ] OG image (1200×630 PNG)
- [ ] Screenshot 1 (1284×2778 PNG, portrait)
- [ ] Screenshot 2 (1284×2778 PNG, portrait)
- [ ] Screenshot 3 (1284×2778 PNG, portrait)

### Post-Launch

- [ ] Monitor error rates
- [ ] Track user engagement
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Plan feature updates
- [ ] Engage with community
- [ ] Share on social media

---

## 16. Maintenance & Updates

### Regular Tasks

**Weekly:**
- Check error logs
- Monitor API rate limits
- Review user feedback
- Update known contracts list

**Monthly:**
- Performance audit
- Security update dependencies
- Review analytics data
- Plan new features

**Quarterly:**
- Major feature releases
- Re-verify with Base
- Update documentation
- Community engagement campaigns

---

## 17. Resources

### Documentation Links

- **Base Docs:** https://docs.base.org/
- **MiniKit Docs:** https://docs.base.org/builderkits/minikit/overview
- **OnchainKit:** https://onchainkit.xyz/
- **Basescan API:** https://docs.basescan.org/
- **Farcaster Docs:** https://docs.farcaster.xyz/
- **Next.js Docs:** https://nextjs.org/docs
- **Recharts:** https://recharts.org/
- **Framer Motion:** https://www.framer.com/motion/

### Community

- **Base Discord:** https://base.org/discord
- **Farcaster:** https://warpcast.com/
- **Base Builders:** https://paragraph.com/@base
- **GitHub Discussions:** https://github.com/base-org

---

## 18. API Reference

### Basescan API Limits

**Free Tier:**
- 5 calls per second
- 100,000 calls per day
- Standard endpoints only

**Pro Tier ($99/month):**
- 10 calls per second
- Unlimited daily calls
- Priority support

### Rate Limiting Strategy

```typescript
// Implement exponential backoff
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

---

## 🎉 Congratulations!

You now have a complete implementation guide for ECHO CHARTS! 

**Next Steps:**

1. Follow the setup instructions
2. Get your API keys
3. Start building components
4. Test locally
5. Deploy to production
6. Submit for verification
7. Launch and promote!

**Need Help?**

- Check the troubleshooting section
- Review the documentation links
- Join the Base Discord community
- Open a GitHub issue

**Good luck building! 🚀**

---

*SKILL.md Version: 1.0.0*  
*Last Updated: February 5, 2026*  
*Status: Complete & Ready for Implementation*