const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "ECHO CHARTS",
    subtitle: "Your Web3 Year in Review",
    description:
      "Visualize your on-chain activity with beautiful charts and insights. Track transactions, DApp usage, rewards, and mini-app engagement on Base.",
    screenshotUrls: [
      `${ROOT_URL}/screenshots/portrait-1.png`,
      `${ROOT_URL}/screenshots/portrait-2.png`,
      `${ROOT_URL}/screenshots/portrait-3.png`,
    ],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0A0A0A",
    heroImageUrl: `${ROOT_URL}/hero.png`,
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "analytics",
    tags: ["analytics", "crypto", "personal", "social", "charts", "web3"],
    tagline: "Your Crypto Activity, Visualized",
    requiredChains: ["eip155:8453"],
    ogTitle: "ECHO CHARTS – My Web3 Year in Review 2025",
    ogDescription: "Check out my on-chain stats for 2025! Track transactions, DApps, and rewards.",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
    noindex: process.env.NODE_ENV === "development",
  },
} as const;
