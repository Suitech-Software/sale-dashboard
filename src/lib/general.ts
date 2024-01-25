import { AppDispatch } from '@/store';
import {
  CurrentStageType,
  setAmountOfPay,
  setAmountOfReceive,
  setCurrentBalance,
  setCurrentNetwork,
  setCurrentToken,
  setWalletAddress,
} from '@/store/slices/generalSlice';
import { CreateType } from '@/types/Referral';
import { get } from 'lodash';
import { NextRouter } from 'next/router';
import { toast } from 'react-toastify';
import copy from 'clipboard-copy';
import Web3 from 'web3';
import { RefObject } from 'react';

export const detectMetamask = async (
  walletAddress: string,
  dispatch: AppDispatch
) => {
  if (get(window, 'ethereum')) {
    if (walletAddress) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const b = await web3.eth.getBalance(walletAddress);
      dispatch(
        setCurrentBalance(Number((Number(b) / Math.pow(10, 18)).toFixed(4)))
      );
    }
  } else {
    toast.info('You have to install Metamask');
  }
};

export const changeNetwork = async (
  chainId: string,
  walletAddress: string,
  currentNetwork: string,
  dispatch: AppDispatch
) => {
  try {
    // @ts-ignore
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: chainId,
        },
      ],
    });
    await detectMetamask(walletAddress, dispatch);
    if (chainId === '0xaa36a7' || chainId === '0x1') {
      dispatch(setCurrentToken('ethereum'));
    } else if (chainId === '0x61' || chainId === '0x38') {
      dispatch(setCurrentToken('binancecoin'));
    }

    dispatch(setAmountOfPay('0'));
    dispatch(setAmountOfReceive('0'));
  } catch (err: any) {
    if (err.code === 4902) {
      if (err.message.includes('0x61') || err.message.includes('0x38')) {
        addNetwork('bsc');
      } else if (
        err.message.includes('0xaa36a7') ||
        err.message.includes('0x1')
      ) {
        addNetwork('eth');
      }
    } else {
      toast.error(err.message);
    }

    if (currentNetwork === 'eth') {
      dispatch(setCurrentNetwork('eth'));
    } else {
      dispatch(setCurrentNetwork('bsc'));
    }
  }
};

export const addNetwork = async (which: string) => {
  const isNet = process.env.NODE_ENV;
  if (isNet === 'development') {
    if (which === 'eth') {
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x6E',
            chainName: 'Sepolia',
            rpcUrls: ['https://rpc.sepolia.com'],
            iconUrls: [
              'https://sepolia.com/fake/example/url/sepolia.svg',
              'https://sepolia.com/fake/example/url/sepolia.png',
            ],
            nativeCurrency: {
              name: 'SPO',
              symbol: 'SPO',
              decimals: 18,
            },
            blockExplorerUrls: ['https://blockexplorer.sepolia.com'],
          },
        ],
      });
    } else if (which === 'bsc') {
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x61',
            chainName: 'BNB Chain Testnet',
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            iconUrls: [],
            nativeCurrency: {
              name: 'TBNB',
              symbol: 'tBNB',
              decimals: 18,
            },
            blockExplorerUrls: ['https://testnet.bscscan.com/'],
          },
        ],
      });
    }
  } else if (isNet === 'production') {
    if (which === 'bsc') {
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x38',
            chainName: 'Binance Smart Chain',
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
            iconUrls: [
              'https://example.com/bsc/icon/url/icon.svg',
              'https://example.com/bsc/icon/url/icon.png',
            ],
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18,
            },
            blockExplorerUrls: ['https://bscscan.com/'],
          },
        ],
      });
    } else if (which === 'eth') {
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x1', // Ethereum mainnet chainId
            chainName: 'Ethereum Mainnet',
            rpcUrls: [
              'https://mainnet.infura.io/v3/578e9a2935924436b468d6a62b063540',
            ],
            iconUrls: [
              'https://ethereum.org/static/214b3940ef09f0bbd40485fcf77a56c3/ether.png',
            ],
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: ['https://etherscan.io/'],
          },
        ],
      });
    }
  }
};

export const disconnectMetamask = async (router: NextRouter) => {
  // @ts-ignore
  await window.ethereum.request({
    method: 'wallet_revokePermissions',
    params: [
      {
        eth_accounts: {},
      },
    ],
  });

  router.reload();
};

export const createReferralURL = async (
  currentNetwork: string,
  walletAddress: string
) => {
  const transferTokenDForReferral: CreateType = {
    currentNetwork,
    userWallet: walletAddress,
  };

  const resOfToken = await fetch('/api/referral/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transferTokenDForReferral),
  });
  const transferTokenData = await resOfToken.json();

  if (resOfToken.ok) {
    copy(transferTokenData.referralURL);
    toast.success('URL successfully copied');
  } else {
    if (
      transferTokenData?.error?.message === 'That wallet already has a referral'
    ) {
      const res = await fetch(
        `/api/referral/getReferralByWalletAddress?userWallet=${walletAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        copy(data.referralURL);
        toast.success('URL successfully copied');
      } else {
        if (data?.message) toast.error(data.message);
        else if (data?.error) toast.error(data.error.message);
        else if (data[0]) toast.error(data[0].message);
      }
    } else if (transferTokenData?.message)
      toast.error(transferTokenData.message);
    else if (transferTokenData?.error)
      toast.error(transferTokenData.error.message);
    else if (transferTokenData[0]) toast.error(transferTokenData[0].message);
  }
};

export const connectWallet = async (
  walletAddress: string,
  currentNetwork: string,
  dispatch: AppDispatch
) => {
  try {
    // @ts-ignore
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    });

    // @ts-ignore
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    dispatch(setWalletAddress(accounts[0]));

    if (currentNetwork === 'eth') {
      changeNetwork(
        process.env.NODE_ENV === 'development' ? '0xaa36a7' : '0x1',
        walletAddress,
        currentNetwork,
        dispatch
      );
    } else {
      changeNetwork(
        process.env.NODE_ENV === 'development' ? '0x61' : '0x38',
        walletAddress,
        currentNetwork,
        dispatch
      );
    }
  } catch (error) {
    toast.error('Some error has happened while trying to connect');
  }
};

// tether
// usd-coin
// binancecoin
// ethereum
export const getAmountOfReceiveToken = async (
  payRef: RefObject<HTMLInputElement>,
  currentToken: string,
  currentStage: CurrentStageType,
  dispatch: AppDispatch
) => {
  if (payRef.current && currentToken) {
    if (payRef.current.value !== '' && payRef.current.value !== '0') {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids='.concat(
          currentToken,
          '&vs_currencies=usd'
        )
      );
      const data = await res.json();
      // let a = '';
      // if (generalValues.currentToken == 'tether') {
      //   a = '2';
      // } else if (generalValues.currentToken == 'ethereum') {
      //   a = '2570.72';
      // } else if (generalValues.currentToken == 'usd-coin') {
      //   a = '1';
      // } else if (generalValues.currentToken == 'binancecoin') {
      //   a = '302.42';
      // }
      const aOfReceive =
        (Number(payRef.current.value) * data[currentToken]?.usd) /
        Number(currentStage?.['Token Price'].replace('$', ''));

      dispatch(setAmountOfReceive(aOfReceive));
    } else {
      dispatch(setAmountOfReceive('0'));
    }
  }
};
