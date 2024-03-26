import { AppDispatch } from "@/store";
import {
  CurrentStageType,
  setAmountOfReceive,
  setCurrentBalance,
} from "@/store/slices/generalSlice";
import { CreateType } from "@/types/Referral";
import { get } from "lodash";
import { toast } from "react-toastify";
import copy from "clipboard-copy";
import Web3 from "web3";
import { RefObject } from "react";
import cors from "cors";

const corsHandler = cors();

export const detectMetamask = async (
  walletAddress: string,
  dispatch: AppDispatch
) => {
  if (get(window, "ethereum")) {
    if (walletAddress) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const b = await web3.eth.getBalance(walletAddress);

      dispatch(
        setCurrentBalance(Number((Number(b) / Math.pow(10, 18)).toFixed(4)))
      );
    }
  } else {
    // toast.info("You have to install Metamask");
  }
};

export const createReferralURL = async (
  currentNetwork: string,
  walletAddress: string
) => {
  const transferTokenDForReferral: CreateType = {
    currentNetwork,
    userWallet: walletAddress,
  };

  const resOfToken = await fetch("/api/referral/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transferTokenDForReferral),
  });
  const transferTokenData = await resOfToken.json();

  if (resOfToken.ok) {
    copy(transferTokenData.referralURL);
    toast.success("URL successfully copied");
  } else {
    if (
      transferTokenData?.error?.message === "That wallet already has a referral"
    ) {
      const res = await fetch(
        `/api/referral/getReferralByWalletAddress?userWallet=${walletAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        copy(data.referralURL);
        toast.success("URL successfully copied");
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
    if (payRef.current.value !== "" && payRef.current.value !== "0") {
      const options = {
        method: "GET",
        headers: { "x-cg-pro-api-key": "CG-au4ZdszbvHEwfdc8e4vSdWzZ" },
      };
      const res = await fetch(
        "https://pro-api.coingecko.com/api/v3/simple/price?ids=".concat(
          currentToken,
          "&vs_currencies=usd"
        ),
        options
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
        Number(currentStage?.["Token Price"].replace("$", ""));

      dispatch(setAmountOfReceive(aOfReceive));
    } else {
      dispatch(setAmountOfReceive("0"));
    }
  }
};
