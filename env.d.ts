namespace NodeJS {
  interface ProcessEnv {
    INFURA_BSC_PROVIDER: string;
    INFURA_BSC_TESTNET_PROVIDER: string;
    INFURA_ETHEREUM_PROVIDER: string;
    INFURA_ETHEREUM_TESTNET_PROVIDER: string;
    INFURA_POLYGON_PROVIDER: string;
    INFURA_POLYGON_TESTNET_PROVIDER: string;
    NEXT_PUBLIC_MNEMONIC: string;

    NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS: string;
    NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS_PRIVATE_KEY: string;

    DATABASE_STRING: string;
    NEXT_PUBLIC_OUR_ETH_CONTRACT: string;
    NEXT_PUBLIC_OUR_BSC_CONTRACT: string;
  }
}
