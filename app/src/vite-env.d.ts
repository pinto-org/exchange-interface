/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * API key for alchemy
   */
  readonly VITE_ALCHEMY_API_KEY: string;

  /**
   * API key for decentralized network subgraph
   */
  readonly VITE_THEGRAPH_API_KEY: number;

  /**
   * Wallet connect project ID
   */
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;

  /**
   *
   */
  readonly VITE_WELLS_ORIGIN_BLOCK: string;

  /**
   *
   */
  readonly VITE_LOAD_HISTORY_FROM_GRAPH: string;

  /**
   * VNET RPC URL for the network
   */
  readonly VITE_VNET_RPC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
