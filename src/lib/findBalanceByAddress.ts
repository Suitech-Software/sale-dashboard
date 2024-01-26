import Web3 from 'web3';
import erc20ContractArtifact from '@/contracts/Erc20Token.json';

export const findBalanceByAddress = async (
  currentNetwork: string,
  walletAddress: string
) => {
  let provider, contractAddress;

  if (process.env.NODE_ENV === 'development') {
    if (currentNetwork === 'bsc') {
      provider = process.env.NEXT_PUBLIC_INFURA_BSC_TESTNET_PROVIDER;
      contractAddress = process.env.NEXT_PUBLIC_OUR_BSC_CONTRACT;
    } else {
      provider = process.env.NEXT_PUBLIC_INFURA_ETHEREUM_TESTNET_PROVIDER;
      contractAddress = process.env.NEXT_PUBLIC_OUR_ETH_CONTRACT;
    }
  } else if (process.env.NODE_ENV === 'production') {
    if (currentNetwork === 'bsc') {
      provider = process.env.NEXT_PUBLIC_INFURA_BSC_PROVIDER;
      contractAddress = process.env.NEXT_PUBLIC_OUR_BSC_CONTRACT;
    } else {
      provider = process.env.NEXT_PUBLIC_INFURA_ETHEREUM_PROVIDER;
      contractAddress = process.env.NEXT_PUBLIC_OUR_ETH_CONTRACT;
    }
  }
  const web3 = new Web3(provider);

  const contract = new web3.eth.Contract(
    erc20ContractArtifact.abi,
    contractAddress
  );

  const balance: any = await contract.methods
    // @ts-ignore
    .balanceOf(walletAddress)
    .call();

  return Number(Number(balance) / Math.pow(10, 18));
};
