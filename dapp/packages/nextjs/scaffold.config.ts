import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  burnerWalletMode: "localNetworksOnly" | "allNetworks" | "disabled";
};

export const DEFAULT_ALCHEMY_API_KEY = "";

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [chains.baseSepolia],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 3000,

  // Optional. Base Sepolia uses the public RPC override below.
  // Configure your own key when targeting an Alchemy-backed network.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,

  // If you want to use a different RPC for a specific network, you can add it here.
  // The key is the chain ID, and the value is the HTTP RPC URL
  rpcOverrides: {
    [chains.baseSepolia.id]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
  },

  // WalletConnect project IDs are public client identifiers, not secrets.
  // You can get your own at https://cloud.walletconnect.com
  // Use your own ID for a deployed app to avoid sharing project quotas.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Configure Burner Wallet visibility:
  // - "localOnly": only show when all target networks are local (hardhat/anvil)
  // - "allNetworks": show on any configured target networks
  // - "disabled": completely disable
  burnerWalletMode: "localNetworksOnly",
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
