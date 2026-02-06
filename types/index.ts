export interface BaseScanTx {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
    methodId?: string;
    functionName?: string;
}

export interface WalletStats {
    totalTransactions: number;
    totalGasUsed: string;
    firstActive: string | null;
    lastActive: string | null;
    uniqueDaysActive: number;
    topInteractions: { address: string; count: number; name?: string }[];
    dailyActivity: { date: string; count: number }[];
}
