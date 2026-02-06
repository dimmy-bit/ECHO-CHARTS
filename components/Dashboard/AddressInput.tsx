'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { isAddress } from 'viem';

interface AddressInputProps {
    onSubmit: (address: string) => void;
}

export function AddressInput({ onSubmit }: AddressInputProps) {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input) return;

        if (
            input.endsWith('.eth') ||
            input.endsWith('.base') ||
            input.endsWith('.base.eth') ||
            isAddress(input)
        ) {
            onSubmit(input);
        } else {
            setError('Invalid address or ENS name');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center w-full max-w-sm mx-auto mt-10"
        >
            <h2 className="text-2xl font-bold mb-2 text-center neon-text">
                Your <span className="text-primary">Base Journey</span>
            </h2>
            <p className="text-muted text-center mb-6 text-sm">
                Visualize your Base activity, rewards, and history in seconds.
            </p>

            <form onSubmit={handleSubmit} className="w-full relative">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                        <Search className="h-5 w-5" />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter 0x... or name.base.eth"
                        aria-invalid={!!error}
                        className={`w-full bg-card/50 backdrop-blur-md border ${error ? 'border-red-500/60' : 'border-border'} rounded-xl py-4 pl-10 pr-12 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/50 shadow-lg`}
                        suppressHydrationWarning
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-1 right-1 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-lg p-2 transition-all"
                        suppressHydrationWarning
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
                {error && (
                    <p className="text-red-500 text-sm mt-2 ml-1 animate-pulse">{error}</p>
                )}
            </form>

            <div className="mt-6 grid grid-cols-2 gap-3 w-full">
                <div className="glass-panel p-4 rounded-xl flex flex-col items-center">
                    <span className="text-2xl font-bold text-secondary">8453</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Base Chain</span>
                </div>
                <div className="glass-panel p-4 rounded-xl flex flex-col items-center">
                    <span className="text-2xl font-bold text-accent">100%</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Mini App</span>
                </div>
            </div>
        </motion.div>
    );
}
