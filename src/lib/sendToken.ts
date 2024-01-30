import { get } from 'lodash';
import Web3 from 'web3';
import ethUSDTContract from '@/contracts/eth_usdt_contract.json';
import ethUSDCContract from '@/contracts/eth_usdc_contract.json';
import bscUSDTContract from '@/contracts/bsc_usdt_contract.json';
import bscUSDCContract from '@/contracts/bsc_usdc_contract.json';
import bscETHContract from '@/contracts/bsc_eth_contract.json';
import { toast } from 'react-toastify';
import { BigNumber } from 'bignumber.js';
import { BrowserProvider, ethers } from 'ethers';

export const sendToken = async (
  address: any,
  value: number,
  currentNetwork: string,
  currentToken: string,
  walletProvider: any
) => {
  try {
    if (get(window, 'ethereum')) {
      if (address) {
        const wallet = process.env.NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS;
        const privateKey =
          process.env.NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS_PRIVATE_KEY;
        let provider;

        if (process.env.NODE_ENV === 'development') {
          if (currentNetwork === 'bsc') {
            provider = process.env.NEXT_PUBLIC_INFURA_BSC_TESTNET_PROVIDER;
          } else {
            provider = process.env.NEXT_PUBLIC_INFURA_ETHEREUM_TESTNET_PROVIDER;
          }
        } else if (process.env.NODE_ENV === 'production') {
          if (currentNetwork === 'bsc') {
            provider = process.env.NEXT_PUBLIC_INFURA_BSC_PROVIDER;
          } else {
            provider = process.env.NEXT_PUBLIC_INFURA_ETHEREUM_PROVIDER;
          }
        }

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();

        if (currentNetwork === 'bsc') {
          if (currentToken === 'tether') {
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(
              bscUSDTContract,
              '0x55d398326f99059fF775485246999027B3197955'
            );

            const balance = await contract.methods
              // @ts-ignore
              .balanceOf(address)
              .call();
            const decimals = await contract.methods.decimals().call();

            const amount = value * Math.pow(10, Number(decimals));

            const isBalanceGreater = new BigNumber(
              Number(balance)
            ).isGreaterThanOrEqualTo(Number(amount));

            if (isBalanceGreater) {
              const data = contract.methods
                // @ts-ignore
                .transfer(wallet, amount)
                .encodeABI();

              const tx = {
                to: '0x55d398326f99059fF775485246999027B3197955',
                from: address,
                data: data,
              } as any;

              const gas = await web3.eth.estimateGas(tx);
              const gasPrice = await web3.eth.getGasPrice();
              const nonce = await web3.eth.getTransactionCount(address);

              tx.gas = web3.utils.toHex(gas);
              tx.gasPrice = web3.utils.toHex(gasPrice);
              tx.nonce = web3.utils.toHex(nonce);

              const signedTransaction = await web3.eth.accounts.signTransaction(
                tx,
                privateKey
              );

              await web3.eth.sendSignedTransaction(
                signedTransaction.rawTransaction
              );
              return true;
            } else {
              toast.info('Your balance is not enough');
            }
          } else if (currentToken === 'usd-coin') {
            const web3 = new Web3(provider);

            const contract = new web3.eth.Contract(
              bscUSDCContract,
              '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
            );

            const balance = await contract.methods
              // @ts-ignore
              .balanceOf(address)
              .call();
            const decimals = await contract.methods.decimals().call();

            const amount = value * Math.pow(10, Number(decimals));

            const isBalanceGreater = new BigNumber(
              Number(balance)
            ).isGreaterThanOrEqualTo(Number(amount));

            if (isBalanceGreater) {
              const data = contract.methods
                // @ts-ignore
                .transfer(wallet, amount)
                .encodeABI();

              const tx = {
                to: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
                from: address,
                data: data,
              } as any;

              const gas = await web3.eth.estimateGas(tx);
              const gasPrice = await web3.eth.getGasPrice();
              const nonce = await web3.eth.getTransactionCount(address);

              tx.gas = web3.utils.toHex(gas);
              tx.gasPrice = web3.utils.toHex(gasPrice);
              tx.nonce = web3.utils.toHex(nonce);

              const signedTransaction = await web3.eth.accounts.signTransaction(
                tx,
                privateKey
              );

              await web3.eth.sendSignedTransaction(
                signedTransaction.rawTransaction
              );
              return true;
            } else {
              toast.info('Your balance is not enough');
            }
          } else if (currentToken === 'binancecoin') {
            const amount = ethers.parseUnits(value.toString(), 18);

            await signer.sendTransaction({
              from: address,
              to: wallet,
              value: amount,
              gasLimit: 32000,
              gasPrice: '32000',
            });

            return true;
          } else if (currentToken === 'ethereum') {
            const web3 = new Web3(provider);

            const contract = new web3.eth.Contract(
              bscETHContract,
              '0x2170ed0880ac9a755fd29b2688956bd959f933f8'
            );

            const balance = await contract.methods
              // @ts-ignore
              .balanceOf(address)
              .call();
            const decimals = await contract.methods.decimals().call();

            const amount = value * Math.pow(10, Number(decimals));

            const isBalanceGreater = new BigNumber(
              Number(balance)
            ).isGreaterThanOrEqualTo(Number(amount));

            if (isBalanceGreater) {
              const data = contract.methods
                // @ts-ignore
                .transfer(wallet, amount)
                .encodeABI();

              const tx = {
                to: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
                from: address,
                data: data,
              } as any;

              const gas = await web3.eth.estimateGas(tx);
              const gasPrice = await web3.eth.getGasPrice();
              const nonce = await web3.eth.getTransactionCount(address);

              tx.gas = web3.utils.toHex(gas);
              tx.gasPrice = web3.utils.toHex(gasPrice);
              tx.nonce = web3.utils.toHex(nonce);

              const signedTransaction = await web3.eth.accounts.signTransaction(
                tx,
                privateKey
              );

              await web3.eth.sendSignedTransaction(
                signedTransaction.rawTransaction
              );

              return true;
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

            const balance = await contract.methods
              // @ts-ignore
              .balanceOf(address)
              .call();
            const decimals = await contract.methods.decimals().call();

            const amount = value * Math.pow(10, Number(decimals));

            const isBalanceGreater = new BigNumber(
              Number(balance)
            ).isGreaterThanOrEqualTo(Number(amount));

            if (isBalanceGreater) {
              const data = contract.methods
                // @ts-ignore
                .transfer(wallet, amount)
                .encodeABI();

              const tx = {
                to: '0xdac17f958d2ee523a2206206994597c13d831ec7',
                from: address,
                data: data,
              } as any;

              const gas = await web3.eth.estimateGas(tx);
              const gasPrice = await web3.eth.getGasPrice();
              const nonce = await web3.eth.getTransactionCount(address);

              tx.gas = web3.utils.toHex(gas);
              tx.gasPrice = web3.utils.toHex(gasPrice);
              tx.nonce = web3.utils.toHex(nonce);

              const signedTransaction = await web3.eth.accounts.signTransaction(
                tx,
                privateKey
              );

              await web3.eth.sendSignedTransaction(
                signedTransaction.rawTransaction
              );
              return true;
            } else {
              toast.info('Your balance is not enough');
            }
          } else if (currentToken === 'usd-coin') {
            const web3 = new Web3(provider);

            const contract = new web3.eth.Contract(
              ethUSDCContract,
              '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
            );

            const balance = await contract.methods
              // @ts-ignore
              .balanceOf(address)
              .call();
            const decimals = await contract.methods.decimals().call();

            const amount = value * Math.pow(10, Number(decimals));

            const isBalanceGreater = new BigNumber(
              Number(balance)
            ).isGreaterThanOrEqualTo(Number(amount));

            if (isBalanceGreater) {
              const data = contract.methods
                // @ts-ignore
                .transfer(wallet, amount)
                .encodeABI();

              const tx = {
                to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                from: address,
                data: data,
              } as any;

              const gas = await web3.eth.estimateGas(tx);
              const gasPrice = await web3.eth.getGasPrice();
              const nonce = await web3.eth.getTransactionCount(address);

              tx.gas = web3.utils.toHex(gas);
              tx.gasPrice = web3.utils.toHex(gasPrice);
              tx.nonce = web3.utils.toHex(nonce);

              const signedTransaction = await web3.eth.accounts.signTransaction(
                tx,
                privateKey
              );

              await web3.eth.sendSignedTransaction(
                signedTransaction.rawTransaction
              );
              return true;
            } else {
              toast.info('Your balance is not enough');
            }
          } else if (currentToken === 'ethereum') {
            const amount = ethers.parseUnits(value.toString(), 18);

            await signer.sendTransaction({
              from: address,
              to: wallet,
              value: amount,
              gasLimit: 32000,
              gasPrice: '32000',
            });

            return true;
          }
        }
        return false;
      } else {
        toast.info('You have to connect your wallet');
        return false;
      }
    }
  } catch (error: any) {
    console.log(error.message.includes('user reject'));
    if (error.message.includes('user reject')) {
      toast.info('You rejected it');
    } else if (
      error.message.includes(
        "Parameter decoding error: Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced."
      )
    ) {
      toast.error('There is a problem about contract ABIs');
    } else {
      toast.error(error.message);
    }
    return false;
  }
};
