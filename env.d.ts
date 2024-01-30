namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_INFURA_BSC_PROVIDER: string;
    NEXT_PUBLIC_INFURA_BSC_TESTNET_PROVIDER: string;
    NEXT_PUBLIC_INFURA_ETHEREUM_PROVIDER: string;
    NEXT_PUBLIC_INFURA_ETHEREUM_TESTNET_PROVIDER: string;
    NEXT_PUBLIC_MNEMONIC: string;

    NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS: string;
    NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS_PRIVATE_KEY: string;

    NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS_FOR_OUR_SMART_CONTRACT: string;
    NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS_PRIVATE_KEY_FOR_OUR_SMART_CONTRACT: string;

    DATABASE_STRING: string;
    NEXT_PUBLIC_OUR_ETH_CONTRACT: string;
    NEXT_PUBLIC_OUR_BSC_CONTRACT: string;

    NEXT_PUBLIC_IS_BONUS_ACTIVE: string;

    NEXT_PUBLIC_UI_URL: string;

    NEXT_PUBLIC_BLOCK_TIME_PER_HOURS: string;

    NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID: string;
  }
}
