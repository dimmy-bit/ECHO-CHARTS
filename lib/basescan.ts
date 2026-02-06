import { BaseScanTx } from '@/types';

// Using Base Blockscout (Free, Etherscan-compatible)
const BASESCAN_API_URL = 'https://base.blockscout.com/api';
// Blockscout doesn't strictly require a key for basic rate limits, but we keep the env var if user has one for Blockscout
const API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;

export async function fetchTransactions(address: string): Promise<BaseScanTx[]> {
    try {
        const params = new URLSearchParams({
            module: 'account',
            action: 'txlist',
            address,
            startblock: '0',
            endblock: '99999999',
            sort: 'asc',
        });

        if (API_KEY) {
            params.append('apikey', API_KEY);
        }

        const res = await fetch(`${BASESCAN_API_URL}?${params.toString()}`);
        const data = await res.json();

        if (data.status === '1' && Array.isArray(data.result)) {
            return data.result;
        }

        // Return empty array if no txs or error (to avoid breaking UI)
        console.warn('BaseScan API Error or No Txs:', data.message, data.result);
        return [];
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return [];
    }
}

export function processWalletStats(txs: BaseScanTx[], userAddress: string) {
    const normalizedUser = userAddress.toLowerCase();

    if (!txs.length) return null;

    let gasUsed = 0n;
    const interactions = new Map<string, number>();
    const dailyCounts = new Map<string, number>();
    let firstTx = txs[0];
    let lastTx = txs[txs.length - 1];

    txs.forEach(tx => {
        // Gas
        gasUsed += BigInt(tx.gasUsed) * BigInt(tx.gasPrice);

        // Interactions (outgoing only for "top apps")
        if (tx.from.toLowerCase() === normalizedUser && tx.to) {
            const contract = tx.to.toLowerCase();
            interactions.set(contract, (interactions.get(contract) || 0) + 1);
        }

        // Daily Activity
        const date = new Date(parseInt(tx.timeStamp) * 1000).toISOString().split('T')[0];
        dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
    });

    // Top Interactions
    const sortedInteractions = Array.from(interactions.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([address, count]) => ({ address, count }));

    // Daily Activity Array
    const dailyActivity = Array.from(dailyCounts.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return {
        totalTransactions: txs.length,
        totalGasUsed: (gasUsed / BigInt(1e18)).toString(), // In ETH
        firstActive: firstTx ? new Date(parseInt(firstTx.timeStamp) * 1000).toLocaleDateString() : null,
        lastActive: lastTx ? new Date(parseInt(lastTx.timeStamp) * 1000).toLocaleDateString() : null,
        uniqueDaysActive: dailyCounts.size,
        topInteractions: sortedInteractions,
        dailyActivity
    };
}
