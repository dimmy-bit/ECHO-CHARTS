'use client';

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownLink,
    WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from '@coinbase/onchainkit/identity';
import { useAccount, useDisconnect } from 'wagmi';


export function Header() {
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    return (
        <header className="flex justify-between items-center py-4 px-2 mb-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center neon-border">
                    <span className="text-white font-bold text-lg">E</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight neon-text">ECHO CHARTS</h1>
            </div>

            <div className="flex items-center gap-2">
                <Wallet>
                    <ConnectWallet className="bg-primary hover:bg-primary/80 transition-all text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold active:scale-95">
                        <Avatar className="h-6 w-6" />
                        <Name />
                    </ConnectWallet>
                    <WalletDropdown>
                        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                            <Avatar />
                            <Name />
                            <Address className="text-muted" />
                            <EthBalance />
                        </Identity>
                        <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
                            Wallet
                        </WalletDropdownLink>
                        <WalletDropdownDisconnect />
                    </WalletDropdown>
                </Wallet>
                {isConnected && (
                    <button
                        onClick={() => disconnect()}
                        className="bg-primary/20 hover:bg-primary/30 transition-all text-white border border-primary/30 rounded-xl px-4 py-2 text-xs font-semibold active:scale-95"
                    >
                        Disconnect
                    </button>
                )}
            </div>
        </header>
    );
}
