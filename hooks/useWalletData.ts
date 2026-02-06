import { useQuery } from '@tanstack/react-query';

export function useWalletData(address: string | null) {
    return useQuery({
        queryKey: ['walletData', address],
        queryFn: async () => {
            if (!address) return null;
            const response = await fetch(`/api/stats?address=${encodeURIComponent(address)}`);
            if (!response.ok) {
                let message = 'Failed to fetch stats';
                try {
                    const errorData = await response.json();
                    if (errorData?.error) {
                        message = errorData.error;
                    }
                } catch {
                    // ignore
                }
                throw new Error(message);
            }
            const data = await response.json();
            return data.stats ?? null;
        },
        enabled: !!address,
        staleTime: 1000 * 60 * 5, // 5 mins
        refetchOnWindowFocus: false,
        retry: 1,
    });
}
