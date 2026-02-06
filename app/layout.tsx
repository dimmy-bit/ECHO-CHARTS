import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from '@/components/Providers';
import { minikitConfig } from '@/minikit.config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: minikitConfig.miniapp.name,
  description: minikitConfig.miniapp.description,
  manifest: '/.well-known/farcaster.json',
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary`}>
        <Providers>
          <div className="mx-auto w-full max-w-[420px] h-screen flex flex-col relative overflow-hidden bg-background">
            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-primary/10 blur-[120px] rounded-full opacity-40 mix-blend-screen animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[50%] bg-accent/10 blur-[100px] rounded-full opacity-30 mix-blend-screen" />
            </div>

            <main className="flex-1 min-h-0 flex flex-col p-4 z-10 overflow-hidden">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
