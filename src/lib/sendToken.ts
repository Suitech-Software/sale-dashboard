import { get } from 'lodash';
import Web3 from 'web3';
import ethUSDTContract from '@/contracts/eth_usdt_contract.json';
import ethUSDCContract from '@/contracts/eth_usdc_contract.json';
import bscUSDTContract from '@/contracts/bsc_usdt_contract.json';
import bscUSDCContract from '@/contracts/bsc_usdc_contract.json';
import bscETHContract from '@/contracts/bsc_eth_contract.json';
import { toast } from 'react-toastify';
import { BigNumber } from 'bignumber.js';
// 0xd6c61d1c12b743B92aaeac6FF5e8445694870683

export const sendToken = async (
  value: number,
  currentNetwork: string,
  currentToken: string
) => {
  if (get(window, 'ethereum')) {
    const ethereum = get(window, 'ethereum') as any;
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });

    const provider = ethereum;

    if (accounts[0]) {
      const wallet = process.env.NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS;

      if (currentNetwork === 'bsc') {
        if (currentToken === 'tether') {
          const web3 = new Web3(provider);

          const contract = new web3.eth.Contract(
            bscUSDTContract,
            '0x55d398326f99059ff775485246999027b3197955'
          );

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
              to: bscUSDTContract,
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
        } else if (currentToken === 'usd-coin') {
          // contractAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
          // abi = bscUSDCContract;
        } else if (currentToken === 'binancecoin') {
          const amount = Web3.utils.toWei(value.toString(), 'ether');

          await ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: accounts[0],
                to: wallet,
                value: Number(amount).toString(16),
                gas: 32000,
                gasPrice: '32000',
              },
            ],
          });
        } else if (currentToken === 'ethereum') {
          const web3 = new Web3(provider);

          const contract = new web3.eth.Contract(
            bscETHContract,
            '0x2170ed0880ac9a755fd29b2688956bd959f933f8'
          );

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
              to: bscETHContract,
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
        }
      } else if (currentNetwork === 'eth') {
        if (currentToken === 'tether') {
          const web3 = new Web3(provider);

          const contract = new web3.eth.Contract(
            ethUSDTContract,
            '0xdac17f958d2ee523a2206206994597c13d831ec7'
          );

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
              to: ethUSDTContract,
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
        } else if (currentToken === 'usd-coin') {
          // contractAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
          // abi = ethUSDCContract;
        } else if (currentToken === 'ethereum') {
          const amount = Web3.utils.toWei(value.toString(), 'ether');

          await ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: accounts[0],
                to: wallet,
                value: Number(amount).toString(16),
                gas: 7000000,
                gasPrice: '7000000',
              },
            ],
          });
        }
      } else {
        toast.info('You have to connect your wallet');
      }
    }
  }
};
