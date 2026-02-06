'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { ReactNode, useState } from 'react';

const config = createConfig({
    chains: [base],
    connectors: [
        coinbaseWallet({
            appName: 'Echo Charts',
        }),
    ],
    transports: {
        [base.id]: http(),
    },
    ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const apiKey =
        process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY ||
        process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider apiKey={apiKey} chain={base}>
                    <MiniKitProvider
                        apiKey={apiKey}
                        chain={base}
                    >
                        {children}
                    </MiniKitProvider>
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
