const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://echo-charts.vercel.app';

export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "ECHO CHARTS",
        description:
      "Visualize your on-chain activity with beautiful charts and insights. Track transactions, DApp usage, rewards, and mini-app engagement on Base.",
    screenshotUrls: [
      `${ROOT_URL}/s1.png`,
      `${ROOT_URL}/s2.png`,
      `${ROOT_URL}/s3.png`,
    ],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0A0A0A",
    heroImageUrl: `${ROOT_URL}/cover.png`,
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "finance",
    tags: ["analytics", "crypto", "personal"],
        requiredChains: ["eip155:8453"],
    ogTitle: "ECHO CHARTS – My Web3 Year in Review 2025",
    ogDescription: "Check out my on-chain stats for 2025! Track transactions, DApps, and rewards.",
    ogImageUrl: `${ROOT_URL}/cover.png`,
    noindex: process.env.NODE_ENV === "development",
  },
} as const;
