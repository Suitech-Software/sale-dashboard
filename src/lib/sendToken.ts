import { get } from 'lodash';
import Web3 from 'web3';
import erc20 from '@/contracts/Erc20Token.json';
import { toast } from 'react-toastify';
import { BigNumber } from 'bignumber.js';
// 0xd6c61d1c12b743B92aaeac6FF5e8445694870683

export const sendToken = async (
  value: number,
  contractAddress: string,
  network: string
) => {
  const wallet = process.env.NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS;

  let our_contract = '';
  if (network === 'bsc') {
    our_contract = process.env.OUR_BSC_CONTRACT;
  } else if (network === 'eth') {
    our_contract = process.env.OUR_ETH_CONTRACT;
  }

  if (get(window, 'ethereum')) {
    const ethereum = get(window, 'ethereum') as any;
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts[0]) {
      const provider = ethereum;

      const web3 = new Web3(provider);

      const contract = new web3.eth.Contract(erc20.abi, contractAddress);

      // @ts-ignore
      const balance = await contract.methods.balanceOf(accounts[0]).call();
      const decimals = await contract.methods.decimals().call();

      const amount = value * Math.pow(10, Number(decimals));

      const isBalanceGreater = new BigNumber(
        Number(balance)
      ).isGreaterThanOrEqualTo(Number(amount));

      if (isBalanceGreater) {
        // @ts-ignore
        const data = contract.methods.transfer(wallet, amount).encodeABI();

        const tx = {
          to: our_contract,
          from: accounts[0],
          data: data,
        } as any;

        const gas = await web3.eth.estimateGas(tx);
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(accounts[0]);

        tx.gas = web3.utils.toHex(gas);
        tx.gasPrice = web3.utils.toHex(gasPrice);
        tx.nonce = web3.utils.toHex(nonce);

        await ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
        });
      } else {
        toast.info('Your balance is not enough');
      }
    } else {
      toast.info('You have to connect your wallet');
    }
  }
};
