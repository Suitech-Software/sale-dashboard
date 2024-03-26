import React, { useEffect, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { sendToken } from "@/lib/sendToken";
import { toast } from "react-toastify";
import { CreateType } from "@/types/Transfer";
import defaultStages from "@/lib/defaultStages.json";
import Link from "next/link";

import {
  TransferTokenType,
  TransferTokenWithReferralType,
} from "@/types/Token";
import { useRouter } from "next/router";
import { detectMetamask, getAmountOfReceiveToken } from "../lib/general";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/index";
import {
  GeneralValueType,
  setAmountOfPay,
  setAmountOfReceive,
  setCurrentNetwork,
  setCurrentToken,
} from "../store/slices/generalSlice";
import {
  useWeb3Modal,
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import styles from "@/styles/Home.module.css";
import Reveal from "./Reveal";
import Tokenomics from "./Tokenomics";
import styles1 from "./MyComponent.module.css";
import Footer from "./Footer";
import WaterDropIon from "@mui/icons-material/WaterDrop";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";

interface Props {}

const HomePage: React.FC<Props> = ({}: Props) => {
  const tableData: any = [
    {
      first: "GOCO",
      second: "tick",
      third: "tick",
      fourth: "tick",
      fifth: "tick",
    },
    {
      first: "SHIBA",
      second: "close",
      third: "tick",
      fourth: "close",
      fifth: "close",
    },
    {
      first: "PEPE",
      second: "close",
      third: "tick",
      fourth: "close",
      fifth: "close",
    },
    {
      first: "FLOKI",
      second: "close",
      third: "tick",
      fourth: "close",
      fifth: "tick",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [nextStage, setNextStage] = useState<any>({});

  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const payRef = useRef<HTMLInputElement>(null);

  const { open } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    if (chainId === 1 || chainId === 11155111 || chainId === 5) {
      dispatch(setCurrentNetwork("eth"));
      dispatch(setCurrentToken("ethereum"));
      detectMetamask(generalValues.walletAddress, dispatch);
      dispatch(setAmountOfPay("0"));
      dispatch(setAmountOfReceive("0"));
    } else if (chainId === 56 || chainId === 97) {
      dispatch(setCurrentNetwork("bsc"));
      dispatch(setCurrentToken("binancecoin"));
      detectMetamask(generalValues.walletAddress, dispatch);
      dispatch(setAmountOfPay("0"));
      dispatch(setAmountOfReceive("0"));
    }
  }, [chainId, generalValues.walletAddress]);

  useEffect(() => {
    returnNextStagePrice();
  }, []);

  useEffect(() => {
    if (generalValues.amountOfPay !== "0")
      getAmountOfReceiveToken(
        payRef,
        generalValues.currentToken,
        generalValues.currentStage,
        dispatch
      );
  }, [generalValues.currentToken, generalValues.amountOfPay]);

  const saveTransfer = async () => {
    const transferData: CreateType = {
      amountOfPay: generalValues.amountOfPay,
      amountOfReceive: generalValues.amountOfReceive.toString(),
      currentNetwork: generalValues.currentNetwork,
      currentToken: generalValues.currentToken,
      stage: generalValues.currentStage?.Stage,
      tokenPrice: generalValues.currentStage?.["Token Price"],
      userWallet: generalValues.walletAddress,
    };
    const res = await fetch("/api/transfer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transferData),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      dispatch(setAmountOfPay("0"));
      dispatch(setAmountOfReceive("0"));

      // const transferTokenD: TransferTokenType = {
      //   transferId: data.transferId,
      //   userWallet: generalValues.walletAddress,
      // };

      // const isBonusActive = process.env.NEXT_PUBLIC_IS_BONUS_ACTIVE;

      // if (router.query.hash) {
      //   const transferTokenDForReferral: TransferTokenWithReferralType = {
      //     transferId: data.transferId,
      //     hash: (router.query.hash as string) ?? "",
      //     userWallet: generalValues.walletAddress,
      //   };

      //   const resOfToken = await fetch(
      //     "/api/web3/token/transfer-token-with-referral",
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(transferTokenDForReferral),
      //     }
      //   );
      //   const transferTokenData = await resOfToken.json();

      //   if (resOfToken.ok) {
      //     toast.success(transferTokenData.message);
      //   } else {
      //     if (transferTokenData?.message)
      //       toast.error(transferTokenData.message);
      //     else if (transferTokenData?.error)
      //       toast.error(transferTokenData.error.message);
      //     else if (transferTokenData[0])
      //       toast.error(transferTokenData[0].message);
      //   }
      // } else {
      //   if (isBonusActive?.toLowerCase() === "true") {
      //     const resOfToken = await fetch(
      //       "/api/web3/token/transfer-token-with-bonus",
      //       {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json",
      //         },
      //         body: JSON.stringify(transferTokenD),
      //       }
      //     );
      //     const transferTokenData = await resOfToken.json();

      //     if (resOfToken.ok) {
      //       toast.success(transferTokenData.message);
      //     } else {
      //       if (transferTokenData?.message)
      //         toast.error(transferTokenData.message);
      //       else if (transferTokenData?.error)
      //         toast.error(transferTokenData.error.message);
      //       else if (transferTokenData[0])
      //         toast.error(transferTokenData[0].message);
      //     }
      //   } else {
      //     const resOfToken = await fetch("/api/web3/token/transfer-token", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(transferTokenD),
      //     });
      //     const transferTokenData = await resOfToken.json();

      //     if (resOfToken.ok) {
      //       toast.success(transferTokenData.message);
      //     } else {
      //       if (transferTokenData?.message)
      //         toast.error(transferTokenData.message);
      //       else if (transferTokenData?.error)
      //         toast.error(transferTokenData.error.message);
      //       else if (transferTokenData[0])
      //         toast.error(transferTokenData[0].message);
      //     }
      //   }
      // }
    } else {
      if (data?.message) toast.error(data.message);
      else if (data?.error) toast.error(data.error.message);
      else if (data[0]) toast.error(data[0].message);
    }
  };

  const returnNextStagePrice = async () => {
    const cur_stage = generalValues.currentStage["Stage"].match(/\d+/);

    const ns = defaultStages.filter((defaultStage) =>
      defaultStage.Stage.includes((Number(cur_stage) + 1).toString())
    );

    setNextStage(ns[0]);
  };

  function calculateRemainingTime() {
    const now = new Date();
    const end = new Date(
      new Date(generalValues.currentStage?.Date?.split(" - ")[1] + ", 2024")
    );

    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);

    // @ts-ignore
    const timeDifference = end - now;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    const formattedDays = {
      child: `${days < 10 ? "0" : ""}${days}`,
      text: days > 0 ? `DAY` : "",
    };
    const formattedHours = {
      child: `${hours < 10 ? "0" : ""}${hours}`,
      text: hours > 0 ? `HR${hours > 1 ? "S" : ""}` : "",
    };
    const formattedMinutes = {
      child: `${minutes < 10 ? "0" : ""}${minutes}`,
      text: minutes > 0 ? `MIN${minutes > 1 ? "S" : ""}` : "",
    };
    const formattedSeconds = {
      child: `${seconds < 10 ? "0" : ""}${seconds}`,
      text: seconds > 0 ? `SEC` : "",
    };

    const formattedTime = [
      formattedDays,
      formattedHours,
      formattedMinutes,
      formattedSeconds,
    ];

    return formattedTime || [{ child: "EXPIRED", text: "" }];
  }

  function calculateTotalTimeInSeconds() {
    const start = new Date(
      new Date(generalValues.currentStage?.Date?.split(" - ")[0] + ", 2024")
    );

    const now = new Date();
    const end = new Date(
      new Date(generalValues.currentStage?.Date?.split(" - ")[1] + ", 2024")
    );

    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);

    //@ts-ignore
    const totalTimeInSeconds = end - now;

    //@ts-ignore
    const resBetweenDate = end - start;

    const res = resBetweenDate - totalTimeInSeconds;
    var rate = (res / resBetweenDate) * 100;

    return rate;
  }

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          px: { xs: "20px", sm: "50px", md: "100px" },
          py: "30px",
          mt: { xs: "50px", lg: "100px" },
          display: "flex",
          justifyContent: { xs: "center", lg: "space-between" },
          alignItems: { xs: "center", lg: "flex-start" },
          flexDirection: { xs: "column", lg: "row" },
          width: "100%",
          height: "auto",
          backgroundImage: "url(/6.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            mt: "50px",
            display: "flex",
            justifyContent: { xs: "center", lg: "flex-start" },
            alignItems: { xs: "center", lg: "flex-start" },
            flexDirection: { xs: "column" },
          }}
        >
          <Reveal>
            <Box
              sx={{
                width: "fit-content",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                  letterSpacing: "5px",
                  fontSize: { xs: "14px", sm: "17px" },
                  width: "fit-content",
                }}
              >
                Introducing GOCO:
              </Typography>
            </Box>
          </Reveal>
          <Reveal>
            <Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "27px", sm: "50px", lg: "75px" },
                  maxWidth: "700px",
                  fontWeight: "600",
                  display: { xs: "inline-flex", lg: "block" },
                }}
              >
                The Golden Cobra
              </Typography>

              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "27px", sm: "50px", lg: "75px" },
                  fontWeight: "600",
                  display: "inline-flex",
                  ml: { xs: "10px", lg: "0px" },
                }}
              >
                Meme Token
              </Typography>
              <Typography
                sx={{
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                  display: "inline-flex",
                  fontSize: { xs: "27px", sm: "50px", lg: "90px" },
                  fontWeight: "600",
                }}
              >
                Token
              </Typography>
            </Box>
          </Reveal>
          <Box
            sx={{
              width: { xs: "80%", sm: "60%", lg: "450px" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: { xs: "20px", md: "0px" },
            }}
          >
            <Reveal>
              <Typography
                sx={{
                  color: "rgb(130,130,129)",
                  fontSize: "13px",
                  letterSpacing: "1px",
                }}
              >
                Where art, fun, and fame collide to create the ultimate meme
                crypto experience! 👑🐍 Forget dogs and frogs - the era of the
                Royal Snake has arrived! Golden Cobra is here to take over and
                redefine the meme coin game! $GOCO
              </Typography>
            </Reveal>
          </Box>
        </Box>
        <Reveal>
          <Box
            sx={{
              backgroundColor: "rgba(80,80,80,.4)",
              backdropFilter: "blur(32px)",
              width: { xs: "100%", md: "500px", lg: "500px" },
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", lg: "flex-start" },
              flexDirection: "column",
              height: "auto",
              borderRadius: "20px",
              boxShadow: "0px 3px 20px 0px #0000001A",
              p: "20px",
              mt: { xs: "40px", lg: "0px" },
            }}
          >
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  $GOCO Pre-Sale
                </Typography>
                <Box
                  sx={{
                    mt: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    "& div": {
                      marginLeft: "10px",
                    },

                    "&:first-of-type": {
                      marginLeft: "0px",
                    },
                  }}
                >
                  {calculateRemainingTime()?.map((time: any) => (
                    <Box
                      key={time.id}
                      sx={{
                        background: "rgb(248, 214, 72)",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        padding: "5px",
                        paddingX: "15px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "10px", sm: "15px" },
                          fontWeight: "700",
                          color: "rgb(21,27,27)",
                        }}
                      >
                        {time.child}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "10px", sm: "11px" },
                          fontWeight: "500",
                          color: "rgb(21,27,27)",
                        }}
                      >
                        {time.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    mt: "10px",
                    height: "30px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    borderRadius: "20px",
                    background: "#e4e4e7",
                    py: "20px",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      height: "30px",
                      width: `${calculateTotalTimeInSeconds()}%`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "20px",
                      background: "#0ea5e9",
                      p: "20px",
                    }}
                  ></Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "9px", sm: "14px" },
                      fontWeight: "600",
                      color: "#333",
                      position: "absolute",
                      left: "20%",
                    }}
                  >
                    Until end of Pre-Sale. Next phase = $
                    {nextStage["Stage"]
                      ? nextStage["Token Price"].replace("$", "")
                      : "0"}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "15px",
                    mt: "10px",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {generalValues.currentStage["Stage"]}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    mt: "10px",
                    color: "#d4d4d8",
                    fontWeight: "600",
                  }}
                >
                  {generalValues.currentStage["Token Amount"]}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "600",
                    mt: "10px",
                    color: "white",
                  }}
                >
                  1 GOCO = $
                  {generalValues.currentStage["Token Price"]?.replace("$", "")}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  mt: "10px",
                  height: "40px",
                  borderRadius: "10px",
                  py: "10px",
                  border: "#f3f3f3 1px solid",
                  "&:hover": {
                    border: "white 2px solid",
                  },
                }}
                onClick={() => {
                  if (generalValues.walletAddress) {
                    open({ view: "Networks" });
                  }
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {generalValues.currentNetwork === "bsc"
                    ? "Switch to ETH"
                    : "Switch to BSC"}
                </Typography>
                {generalValues.currentNetwork === "eth" ? (
                  <Image
                    style={{
                      marginLeft: "10px",
                      objectFit: "contain",
                    }}
                    src="/bnb-logo.png"
                    alt="BNB Logo"
                    width={27}
                    height={27}
                  />
                ) : (
                  <Image
                    style={{
                      marginLeft: "10px",
                      objectFit: "contain",
                    }}
                    src="/ethereum.png"
                    alt="ETH Logo"
                    width={27}
                    height={27}
                  />
                )}
              </Button>

              <Grid
                container
                spacing={2}
                sx={{
                  mt: "10px",
                }}
              >
                {generalValues.currentNetwork === "bsc" ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant={
                          generalValues.currentToken === "binancecoin"
                            ? "contained"
                            : "outlined"
                        }
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          boxShadow: "none",
                          width: "100%",
                          height: "40px",
                          borderRadius: "10px",
                          border:
                            generalValues.currentToken === "binancecoin"
                              ? "#7c3aed 1px solid"
                              : "#f3f3f3 1px solid",
                          backgroundColor:
                            generalValues.currentToken === "binancecoin"
                              ? "#7c3aed"
                              : "",
                          "&:hover": {
                            border:
                              generalValues.currentToken === "binancecoin"
                                ? "#7c3aed 1px solid"
                                : "white 2px solid",
                            backgroundColor:
                              generalValues.currentToken === "binancecoin"
                                ? "#7c3aed"
                                : "",
                            "*": {
                              color:
                                generalValues.currentToken === "binancecoin"
                                  ? "white"
                                  : "white",
                            },
                          },
                        }}
                        onClick={() => {
                          dispatch(setCurrentToken("binancecoin"));
                        }}
                      >
                        <Image
                          style={{
                            marginRight: "10px",
                            objectFit: "contain",
                          }}
                          src="/bnb-logo.png"
                          alt="BNB Logo"
                          width={22}
                          height={22}
                        />
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color:
                              generalValues.currentToken === "binancecoin"
                                ? "white"
                                : "white",
                          }}
                        >
                          BNB
                        </Typography>
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant={
                          generalValues.currentToken === "ethereum"
                            ? "contained"
                            : "outlined"
                        }
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          boxShadow: "none",
                          width: "100%",
                          height: "40px",
                          borderRadius: "10px",
                          border:
                            generalValues.currentToken === "ethereum"
                              ? "#7c3aed 1px solid"
                              : "#f3f3f3 1px solid",
                          backgroundColor:
                            generalValues.currentToken === "ethereum"
                              ? "#7c3aed"
                              : "",
                          "&:hover": {
                            border:
                              generalValues.currentToken === "ethereum"
                                ? "#7c3aed 1px solid"
                                : "white 2px solid",
                            backgroundColor:
                              generalValues.currentToken === "ethereum"
                                ? "#7c3aed"
                                : "",
                            "*": {
                              color:
                                generalValues.currentToken === "ethereum"
                                  ? "white"
                                  : "white",
                            },
                          },
                        }}
                        onClick={() => {
                          dispatch(setCurrentToken("ethereum"));
                        }}
                      >
                        <Image
                          style={{
                            marginRight: "10px",
                            objectFit: "contain",
                          }}
                          src="/ethereum.png"
                          alt="Ethereum Logo"
                          width={22}
                          height={22}
                        />
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color:
                              generalValues.currentToken === "ethereum"
                                ? "white"
                                : "white",
                          }}
                        >
                          ETH
                        </Typography>
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12}>
                    <Button
                      variant={
                        generalValues.currentToken === "ethereum" ||
                        generalValues.currentToken === "binancecoin"
                          ? "contained"
                          : "outlined"
                      }
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "none",
                        width: "100%",
                        height: "40px",
                        borderRadius: "10px",
                        border:
                          generalValues.currentToken === "ethereum" ||
                          generalValues.currentToken === "binancecoin"
                            ? "#7c3aed 1px solid"
                            : "#f3f3f3 1px solid",
                        backgroundColor:
                          generalValues.currentToken === "ethereum" ||
                          generalValues.currentToken === "binancecoin"
                            ? "#7c3aed"
                            : "",
                        "&:hover": {
                          border:
                            generalValues.currentToken === "ethereum" ||
                            generalValues.currentToken === "binancecoin"
                              ? "#7c3aed 1px solid"
                              : "white 2px solid",
                          backgroundColor:
                            generalValues.currentToken === "ethereum" ||
                            generalValues.currentToken === "binancecoin"
                              ? "#7c3aed"
                              : "",
                          "*": {
                            color:
                              generalValues.currentToken === "ethereum" ||
                              generalValues.currentToken === "binancecoin"
                                ? "white"
                                : "white",
                          },
                        },
                      }}
                      onClick={() => {
                        if (generalValues.currentNetwork === "bsc") {
                          dispatch(setCurrentToken("binancecoin"));
                        } else if (generalValues.currentNetwork === "eth") {
                          dispatch(setCurrentToken("ethereum"));
                        }
                      }}
                    >
                      {generalValues.currentNetwork === "bsc" ? (
                        <>
                          <Image
                            style={{
                              marginRight: "10px",
                              objectFit: "contain",
                            }}
                            src="/bnb-logo.png"
                            alt="BNB Logo"
                            width={22}
                            height={22}
                          />
                          <Typography
                            sx={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color:
                                generalValues.currentToken === "ethereum" ||
                                generalValues.currentToken === "binancecoin"
                                  ? "white"
                                  : "white",
                            }}
                          >
                            BNB
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Image
                            style={{
                              marginRight: "10px",
                              objectFit: "contain",
                            }}
                            src="/ethereum.png"
                            alt="Ethereum Logo"
                            width={22}
                            height={22}
                          />
                          <Typography
                            sx={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color:
                                generalValues.currentToken === "ethereum" ||
                                generalValues.currentToken === "binancecoin"
                                  ? "white"
                                  : "white",
                            }}
                          >
                            ETH
                          </Typography>
                        </>
                      )}
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Button
                    variant={
                      generalValues.currentToken === "tether"
                        ? "contained"
                        : "outlined"
                    }
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "none",
                      width: "100%",
                      height: "40px",
                      borderRadius: "10px",
                      border:
                        generalValues.currentToken === "tether"
                          ? "#7c3aed 1px solid"
                          : "#f3f3f3 1px solid",
                      backgroundColor:
                        generalValues.currentToken === "tether"
                          ? "#7c3aed"
                          : "",
                      "&:hover": {
                        border:
                          generalValues.currentToken === "tether"
                            ? "#7c3aed 1px solid"
                            : "white 2px solid",
                        backgroundColor:
                          generalValues.currentToken === "tether"
                            ? "#7c3aed"
                            : "",
                        "*": {
                          color:
                            generalValues.currentToken === "tether"
                              ? "white"
                              : "white",
                        },
                      },
                    }}
                    onClick={() => {
                      dispatch(setCurrentToken("tether"));
                    }}
                  >
                    <Image
                      style={{
                        marginRight: "10px",
                        objectFit: "contain",
                      }}
                      src="/usdt-logo.png"
                      alt="USDT Logo"
                      width={30}
                      height={22}
                    />
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color:
                          generalValues.currentToken === "tether"
                            ? "white"
                            : "white",
                      }}
                    >
                      USDT
                    </Typography>
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant={
                      generalValues.currentToken === "usd-coin"
                        ? "contained"
                        : "outlined"
                    }
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "none",
                      width: "100%",
                      height: "40px",
                      borderRadius: "10px",
                      border:
                        generalValues.currentToken === "usd-coin"
                          ? "#7c3aed 1px solid"
                          : "#f3f3f3 1px solid",
                      backgroundColor:
                        generalValues.currentToken === "usd-coin"
                          ? "#7c3aed"
                          : "",
                      "&:hover": {
                        border:
                          generalValues.currentToken === "usd-coin"
                            ? "#7c3aed 1px solid"
                            : "white 2px solid",
                        backgroundColor:
                          generalValues.currentToken === "usd-coin"
                            ? "#7c3aed"
                            : "",
                        "*": {
                          color:
                            generalValues.currentToken === "usd-coin"
                              ? "white"
                              : "white",
                        },
                      },
                    }}
                    onClick={() => {
                      dispatch(setCurrentToken("usd-coin"));
                    }}
                  >
                    <Image
                      style={{
                        marginRight: "10px",
                        objectFit: "contain",
                      }}
                      src="/usdc-logo.png"
                      alt="USDC Logo"
                      width={42}
                      height={42}
                    />
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color:
                          generalValues.currentToken === "usd-coin"
                            ? "white"
                            : "white",
                      }}
                    >
                      USDC
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "20px",
                    border: "none",
                    mt: "20px",
                    width: "100%",
                    height: "50px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="input"
                    ref={payRef}
                    type="number"
                    value={generalValues.amountOfPay}
                    onChange={(e) => {
                      dispatch(setAmountOfPay(e.target.value));
                    }}
                    sx={{
                      width: "85%",
                      height: "47px",
                      border: "none",
                      bgcolor: "#F8F9F8",
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                      color: "#666666",
                      px: "13px",
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                      borderLeft: "1px solid #d4d4d8",
                      background: "#f3f3f3",
                      width: "15%",
                      height: "47px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {generalValues.currentToken === "binancecoin" ? (
                      <Box>
                        <Image
                          src="/bnb-logo.png"
                          alt="BNB Logo"
                          width={22}
                          height={22}
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    ) : generalValues.currentToken === "tether" ? (
                      <Box>
                        <Image
                          style={{
                            objectFit: "contain",
                          }}
                          src="/usdt-logo.png"
                          alt="USDT Logo"
                          width={40}
                          height={40}
                        />
                      </Box>
                    ) : generalValues.currentToken === "usd-coin" ? (
                      <Box>
                        <Image
                          style={{
                            objectFit: "contain",
                          }}
                          src="/usdc-logo.png"
                          alt="USDC Logo"
                          width={50}
                          height={50}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <Image
                          src="/ethereum.png"
                          alt="Ethereum Logo"
                          width={22}
                          height={22}
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: "20px",
                    mt: "20px",
                    width: "100%",
                    border: "none",
                    height: "50px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="input"
                    type="number"
                    value={generalValues.amountOfReceive}
                    onChange={(e) => {
                      dispatch(setAmountOfReceive(e.target.value));
                    }}
                    disabled
                    sx={{
                      width: "85%",
                      height: "47px",
                      border: "none",
                      bgcolor: "#F8F9F8",
                      borderBottomLeftRadius: "20px",
                      borderTopLeftRadius: "20px",
                      color: "#666666",
                      px: "13px",
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                      borderLeft: "1px solid #d4d4d8",
                      background: "#f3f3f3",
                      width: "15%",
                      height: "47px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Image
                        src="/main.png"
                        alt="BNB Logo"
                        width={25}
                        height={25}
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Button
                variant="contained"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "50px",
                  mt: "20px",
                  boxShadow: "none",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                  color: "black",
                }}
                onClick={async () => {
                  setIsLoading(true);
                  if (isConnected) {
                    if (generalValues.walletAddress) {
                      if (generalValues.amountOfPay !== "0") {
                        const result = await sendToken(
                          address,
                          Number(generalValues.amountOfPay),
                          generalValues.currentNetwork,
                          generalValues.currentToken,
                          walletProvider
                        );
                        if (result) await saveTransfer();
                      } else {
                        toast.info("You have to enter amount of pay");
                      }
                    } else {
                      toast.info("Please connect your wallet");
                    }
                  } else {
                    toast.info("Please connect your wallet");
                  }
                  setIsLoading(false);
                }}
              >
                {isLoading ? (
                  <CircularProgress size={25} sx={{ color: "#f3f3f3" }} />
                ) : (
                  <>Buy now</>
                )}
              </Button>
            </>
          </Box>
        </Reveal>
      </Box>
      <Box
        sx={{
          py: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          height: "auto",
          background: "rgb(1,1,1)",
        }}
      >
        <Reveal>
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "27px", sm: "50px" },
                  fontWeight: "600",
                  display: "inline-flex",
                }}
              >
                Our
              </Typography>
              <Typography
                sx={{
                  background:
                    "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                  display: "inline-flex",
                  fontSize: { xs: "27px", sm: "50px" },
                  fontWeight: "600",
                  ml: "10px",
                }}
              >
                Trusted
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "27px", sm: "50px" },
                  fontWeight: "600",
                  display: "inline-flex",
                  ml: "10px",
                }}
              >
                Partners
              </Typography>
            </Box>
            <Typography
              sx={{
                color: "rgb(130,130,129)",
                fontSize: { xs: "11px", sm: "13px" },
                letterSpacing: { xs: "1px", sm: "3px" },
                mt: "10px",
                textAlign: "center",
              }}
            ></Typography>
          </>
        </Reveal>
        <Reveal>
          <Box
            sx={{
              mt: "30px",
              px: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={styles.scroller}
            data-animated="true"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className={styles.scroller__inner}
            >
              {new Array(6).fill(null).map((_, i) => (
                <Box
                  sx={{
                    backgroundColor: "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: "20px",
                    borderRadius: "20px",
                    width: "200px",
                    color: "#f3f3f3",
                  }}
                  key={i}
                >
                  Sponsor
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className={styles.scroller__inner}
            >
              {new Array(6).fill(null).map((_, i) => (
                <Box
                  sx={{
                    backgroundColor: "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: "20px",
                    borderRadius: "20px",
                    width: "200px",
                    color: "#f3f3f3",
                  }}
                  key={i}
                >
                  Sponsor
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className={styles.scroller__inner}
            >
              {new Array(6).fill(null).map((_, i) => (
                <Box
                  sx={{
                    backgroundColor: "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: "20px",
                    borderRadius: "20px",
                    width: "200px",
                    color: "#f3f3f3",
                  }}
                  key={i}
                >
                  Sponsor
                </Box>
              ))}
            </Box>
          </Box>
        </Reveal>
      </Box>
      <Box
        sx={{
          py: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          height: "auto",
          background: "rgb(9,8,8)",
        }}
      >
        <Reveal>
          <>
            <Box
              sx={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                display: { xs: "inline-flex", sm: "inline-flex" },
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "23px", sm: "50px" },
                  fontWeight: "600",
                  display: "inline-flex",
                }}
              >
                Taller
              </Typography>
              <Typography
                sx={{
                  background:
                    "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                  display: "inline-flex",
                  fontSize: { xs: "23px", sm: "50px" },
                  fontWeight: "600",
                  ml: "10px",
                }}
              >
                The Snake,
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "23px", sm: "50px" },
                  fontWeight: "600",
                  display: "inline-flex",
                  ml: "10px",
                }}
              >
                Higher
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "23px", sm: "50px" },
                  fontWeight: "600",
                  ml: "10px",
                  display: "inline-flex",
                }}
              >
                Its Reach
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                mt: "10px",
              }}
            >
              <Typography
                sx={{
                  color: "rgb(130,130,129)",
                  fontSize: { xs: "11px", sm: "13px" },
                  letterSpacing: { xs: "1px", sm: "3px" },
                  width: { xs: "50%", sm: "100%" },
                  textAlign: "center",
                }}
              >
                Our goal is to reach 12,756* fans to make the GOLDEN COBRA hug
                the world and turn every piece of sand on the beaches to gold.
              </Typography>
              <Typography
                sx={{
                  color: "rgb(130,130,129)",
                  fontSize: { xs: "11px", sm: "13px" },
                  letterSpacing: { xs: "1px", sm: "3px" },
                  mt: "10px",
                  textAlign: "center",
                }}
              >
                (*Diameter of the Earth. Each fan adds an additional 1 meter to
                the GOCO&apos;ssssss tailssss).
              </Typography>
            </Box>
            <Grid
              container
              sx={{
                mt: "30px",
                px: { xs: "20px", md: "200px" },
              }}
              spacing={5}
            >
              <Grid item xs={12} sm={6} lg={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Image
                    style={{
                      objectFit: "contain",
                    }}
                    src="/1.png"
                    alt="Cryptocurrency"
                    width={100}
                    height={120}
                  />
                  <Typography
                    sx={{
                      background:
                        "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                      color: "transparent",
                      WebkitBackgroundClip: "text",
                      fontSize: "20px",
                      letterSpacing: "2px",
                    }}
                  >
                    Play to Earn
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgb(130,130,129)",
                      fontSize: "13px",
                      letterSpacing: "2px",
                      mt: "10px",
                      textAlign: "justify",
                      width: { xs: "60%", sm: "80%", md: "100%" },
                    }}
                  >
                    SUSTAINABILITY GUARANTEED: $GOCO isn&apos;t just about
                    memes; it&apos;s about huge utility. The Golden Cobra Snake,
                    our next-level Play to Earn Game. It&apos;s not just a
                    token; it&apos;s a journey!
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Image
                    style={{
                      objectFit: "contain",
                    }}
                    src="/3.png"
                    alt="Crypto Exchange"
                    width={100}
                    height={120}
                  />
                  <Typography
                    sx={{
                      background:
                        "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                      color: "transparent",
                      WebkitBackgroundClip: "text",
                      fontSize: "20px",
                      letterSpacing: "2px",
                    }}
                  >
                    Fun + Growth
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgb(130,130,129)",
                      fontSize: "13px",
                      letterSpacing: "2px",
                      mt: "10px",
                      textAlign: "justify",
                      width: { xs: "60%", sm: "80%", md: "100%" },
                    }}
                  >
                    SMART INVESTMENT: Why settle for boring investments when you
                    can have fun AND earn more with GOCO? MEME, P2E, Lucky
                    Wheel, Raffles, and tons of rewards – all here.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Image
                    style={{
                      objectFit: "contain",
                    }}
                    src="/8.png"
                    alt="Earn Bitcoin"
                    width={100}
                    height={120}
                  />
                  <Typography
                    sx={{
                      background:
                        "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                      color: "transparent",
                      WebkitBackgroundClip: "text",
                      fontSize: "20px",
                      letterSpacing: "2px",
                    }}
                  >
                    Community is The True King
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgb(130,130,129)",
                      fontSize: "13px",
                      letterSpacing: "2px",
                      mt: "10px",
                      textAlign: "justify",
                      width: { xs: "60%", sm: "80%", md: "100%" },
                    }}
                  >
                    EACH FAN IS A GREEN CANDLE, lighting up our charts and
                    spreading the word about the Golden Cobra phenomenon.
                    Together, we&apos;ll reach new heights!
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Image
                    style={{
                      objectFit: "contain",
                    }}
                    src="/4.png"
                    alt="Security System"
                    width={100}
                    height={120}
                  />
                  <Typography
                    sx={{
                      background:
                        "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                      color: "transparent",
                      WebkitBackgroundClip: "text",
                      fontSize: "20px",
                      letterSpacing: "2px",
                    }}
                  >
                    Stake. Earn. Claim Rewards.
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgb(130,130,129)",
                      fontSize: "13px",
                      letterSpacing: "2px",
                      mt: "10px",
                      textAlign: "justify",
                      width: { xs: "60%", sm: "80%", md: "100%" },
                    }}
                  >
                    EARN APY DURING PRESALE! Do not wait for a second, begin
                    earning APY on $GOCO tokens today by buying the presale.
                    Click here to learn more!
                    https://docs.goldencobra.io/staking
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        </Reveal>
      </Box>
      <Reveal>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mt: "70px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              px: "30px",
            }}
          >
            <Typography
              sx={{
                color: "rgb(221,221,223)",
                fontSize: "26px",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              Pre-sale Staking Advantage: Stake. Earn. Grow.
            </Typography>
            <Typography
              sx={{
                mt: "10px",
                color: "rgb(184 184 184)",
                fontSize: "14px",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              Supercharge your $GOCO holdings by staking during our Pre-sale!
              Stake your tokens for a set time and enjoy impressive returns.
            </Typography>
            <Typography
              sx={{
                mt: "10px",
                color: "rgb(184 184 184)",
                fontSize: "12px",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            ></Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", md: "row" },
              mt: { xs: "30px", sm: "50px" },
              width: "100%",
              height: { xs: "auto", md: "600px" },
              backgroundImage: { xs: "", md: "url(/goco-curtain.png)" },
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              paddingX: { xs: "30px", lg: "50px" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "column",
                background: "rgb(2,0,19)",
                height: "100%",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                width: { xs: "400px", sm: "70%", md: "400px" },
              }}
            >
              <Box
                sx={{
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                  padding: "30px",
                }}
              >
                <Box
                  sx={{
                    background: "rgb(13,10,28)",
                    border: "1px solid rgb(23, 19, 44)",
                    borderRadius: "10px",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                    width: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5px",
                  }}
                >
                  <WaterDropIon
                    sx={{
                      width: "18px",
                      height: "18px",
                      color: "#fff",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "18px",
                    letterSpacing: "2px",
                    color: "rgb(224,224,226)",
                    mt: "10px",
                  }}
                >
                  Massive Staking Pool
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    letterSpacing: "1px",
                    color: "rgb(185 185 188)",
                    mt: "10px",
                  }}
                >
                  We&apos;ve dedicated a significant portion (8%, totaling 80
                  billion tokens) to staking rewards.
                </Typography>
              </Box>
              <Box
                sx={{
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                  padding: "30px",
                  mt: { xs: "20px", md: "0px" },
                }}
              >
                <Box
                  sx={{
                    background: "rgb(13,10,28)",
                    border: "1px solid rgb(23, 19, 44)",
                    borderRadius: "10px",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                    width: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5px",
                  }}
                >
                  <LightbulbIcon
                    sx={{
                      width: "18px",
                      height: "18px",
                      color: "#fff",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "18px",
                    letterSpacing: "2px",
                    color: "rgb(224,224,226)",
                    mt: "10px",
                  }}
                >
                  Limited Spots Available!
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    letterSpacing: "1px",
                    color: "rgb(185 185 188)",
                    mt: "10px",
                  }}
                >
                  Don&apos;t miss out on this exclusive opportunity to maximize
                  your $GOCO gains.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "column",
                background: "rgb(2,0,19)",
                height: "100%",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                width: { xs: "300px", sm: "70%", md: "300px" },
              }}
            >
              <Box
                sx={{
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                  padding: "30px",
                  mt: { xs: "20px", md: "0px" },
                }}
              >
                <Box
                  sx={{
                    background: "rgb(13,10,28)",
                    border: "1px solid rgb(23, 19, 44)",
                    borderRadius: "10px",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                    width: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5px",
                  }}
                >
                  <LocalMallRoundedIcon
                    sx={{
                      width: "18px",
                      height: "18px",
                      color: "#fff",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "18px",
                    letterSpacing: "2px",
                    color: "rgb(224,224,226)",
                    mt: "10px",
                  }}
                >
                  High APY Tiers
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    letterSpacing: "1px",
                    color: "rgb(185 185 188)",
                    mt: "10px",
                  }}
                >
                  GOCO Staking APY Tiers: 2 months: 36% APY / 6 months: 45% APY
                  / 12 months: 54% APY.
                </Typography>
              </Box>
              <Box
                sx={{
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                  padding: "30px",
                  mt: { xs: "20px", md: "0px" },
                }}
              >
                <Box
                  sx={{
                    background: "rgb(13,10,28)",
                    border: "1px solid rgb(23, 19, 44)",
                    borderRadius: "10px",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                    width: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5px",
                  }}
                >
                  <StarRoundedIcon
                    sx={{
                      width: "18px",
                      height: "18px",
                      color: "#fff",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "18px",
                    letterSpacing: "2px",
                    color: "rgb(224,224,226)",
                    mt: "10px",
                  }}
                >
                  Stake Now & Earn More
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    letterSpacing: "1px",
                    color: "rgb(185 185 188)",
                    mt: "10px",
                  }}
                >
                  Don&apos;t miss out! Start earning APY on your $GOCO tokens
                  today by participating in our presale. Click here to learn
                  more about staking! https://docs.goldencobra.io/staking
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Reveal>
      <Reveal>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            my: "40px",
            mx: { xs: "30px", md: "100px" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              px: "30px",
            }}
          >
            <Typography
              sx={{
                color: "rgb(254,254,254)",
                fontSize: { xs: "16px", sm: "27px", md: "36px" },
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              Comparison With Competitors and
            </Typography>
            <Typography
              sx={{
                color: "rgb(254,254,254)",
                fontSize: { xs: "16px", sm: "27px", md: "36px" },
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              Our Advantages
            </Typography>
            <Typography
              sx={{
                mt: "10px",
                color: "rgb(176,176,188)",
                fontSize: "12px",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              Golden Cobra isn&apos;t just another meme project; it&apos;s a
              game-changer. To truly understand how it stands out, let&apos;s
              compare it with the usual players in the game.
            </Typography>
          </Box>
          <TableContainer component={Paper} sx={{ mt: "50px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="My Stake">
              <TableHead
                sx={{
                  background: "rgb(3,5,13)",
                  "*": {
                    color: "#fff",
                    border: "none",
                  },
                }}
              >
                <TableRow>
                  <TableCell
                    sx={{
                      border: "none",
                      color: "#fff",
                    }}
                  >
                    Feature
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "none",
                      color: "#fff",
                    }}
                    align="center"
                  >
                    Comprehensive Rewards
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "none",
                      color: "#fff",
                    }}
                    align="center"
                  >
                    Community Focus
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "none",
                      color: "#fff",
                    }}
                    align="center"
                  >
                    Utility (Play-to-Earn)
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "none",
                      color: "#fff",
                    }}
                    align="center"
                  >
                    Long-Term Focus
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  background: "rgb(3,5,13)",
                  "*": {
                    border: "none",
                    color: "#fff",
                  },
                }}
              >
                {tableData.map((tableD: any, i: number) => (
                  <TableRow
                    key={i}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },

                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgb(12,14,19)",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        border: "none",
                        color: "#fff",
                      }}
                    >
                      {tableD.first}
                    </TableCell>
                    <TableCell
                      scope="row"
                      component="th"
                      sx={{
                        border: "none",
                        color: "#fff",
                      }}
                      align="center"
                    >
                      <Image
                        src={`/${tableD.second}.png`}
                        alt="Tick"
                        width={20}
                        height={20}
                        priority={true}
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "none",
                        color: "#fff",
                      }}
                      align="center"
                      component="th"
                      scope="row"
                    >
                      <Image
                        src={`/${tableD.third}.png`}
                        alt="Tick"
                        width={20}
                        height={20}
                        priority={true}
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "none",
                        color: "#fff",
                      }}
                      align="center"
                      component="th"
                      scope="row"
                    >
                      <Image
                        src={`/${tableD.fourth}.png`}
                        alt="Tick"
                        width={20}
                        height={20}
                        priority={true}
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "none",
                        color: "#fff",
                      }}
                      align="center"
                      component="th"
                      scope="row"
                    >
                      <Image
                        src={`/${tableD.fifth}.png`}
                        alt="Tick"
                        width={20}
                        height={20}
                        priority={true}
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Reveal>
      <Reveal>
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              mt: { xs: "30px", sm: "50px" },
            }}
          >
            <Typography
              sx={{
                background:
                  "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                color: "transparent",
                WebkitBackgroundClip: "text",
                display: "inline-flex",
                fontSize: { xs: "27px", sm: "50px" },
                fontWeight: "600",
              }}
            >
              Tokenomics
            </Typography>
          </Box>
          <Tokenomics />
        </>
      </Reveal>
      <Box
        sx={{
          py: "30px",
          display: "flex",
          justifyContent: { xs: "center", sm: "space-evenly" },
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "center",
          width: "100%",
          height: "auto",
          background: "rgb(9,8,8)",
          px: "30px",
        }}
      >
        <Box
          component="img"
          style={{
            objectFit: "contain",
          }}
          src="/world.png"
          alt="World"
          sx={{
            width: {
              xs: "100%",
              md: 600,
            },
            height: {
              xs: "300px",
              sm: "400px",
              md: 500,
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
            alignItems: { xs: "center", sm: "flex-start" },
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontSize: { xs: "13px", sm: "16px" },
              letterSpacing: { xs: "1px", sm: "3px" },
            }}
          >
            Golden Cobra community!
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-start" },
              alignItems: { xs: "center", sm: "flex-start" },
              flexDirection: { xs: "row", sm: "column" },
            }}
          >
            <Typography
              sx={{
                background:
                  "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                color: "transparent",
                WebkitBackgroundClip: "text",
                fontSize: { xs: "16px", sm: "40px" },
                fontWeight: "600",
                display: { xs: "inline-flex", sm: "block" },
              }}
            >
              Unlock a treasure chest of
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: { xs: "16px", sm: "40px" },
                fontWeight: "600",
                mt: { xs: "0px", sm: "-20px" },
                display: { xs: "inline-flex", sm: "block" },
                ml: { xs: "10px", sm: "0px" },
              }}
            >
              Rewards.
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "rgb(130,130,129)",
              fontSize: "13px",
              letterSpacing: { xs: "1px", md: "2px" },
              mt: "10px",
              width: { xs: "80%", sm: "400px" },
              textAlign: "justify",
            }}
          ></Typography>
          <Typography
            sx={{
              color: "rgb(130,130,129)",
              fontSize: "13px",
              letterSpacing: { xs: "1px", md: "2px" },
              width: { xs: "80%", sm: "600px" },
              textAlign: { xs: "center", sm: "left" },
              mt: "5px",
            }}
          >
            Whether you&apos;re purchasing, referring friends, or engaging with
            our ecosystem, we offer real rewards like purchase and referral
            bonuses, token rewards, exclusive NFT tickets, Play-to-Earn
            features, staking multiplier tickets, and raffle tickets. Worth
            hundreds of thousands of dollars, these rewards are available in
            instant, hourly, daily, weekly, and monthly periods, ensuring that
            the GOCO token and the &apos;Golden Cobra&apos; snake game reach our
            community of millions in no time. Join us now and reap the benefits
            of being part of the Golden Cobra family!
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          height: { xs: "auto", md: "350px" },
          paddingX: 4,
        }}
      >
        <Box
          color="white"
          sx={{
            width: { xs: "90%", sm: "70%", md: "30%" },
            mt: { xs: "40px", md: "0px" },
          }}
          height="100%"
          padding={4}
          border="1px solid #ccc"
          borderRadius={8}
          marginX={3}
          textAlign="center"
          className={styles1["background"]}
        >
          <Image
            src="/silver.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className={styles1["background-image"]}
          />
          <img
            src="/main.png"
            alt="Goco Token"
            style={{
              width: "30%", // Görselin genişliğini kartın genişliğine uyumlu hale getirir
              height: "auto", // Otomatik yükseklik, oranın korunmasını sağlar
              borderRadius: "8px 8px 0 0", // İstediğiniz köşe yuvarlaklığı
            }}
          />
          <h2>Silver Package</h2>
          <p style={{ padding: 5 }}>You get many features with this package.</p>
          <ul style={{ listStyleType: "none", padding: 5 }}>
            <li>Add Feature 1</li>
            <li>Add Feature 2</li>
            <li>Add Feature 3</li>
          </ul>
          <button
            style={{
              background:
                "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
              color: "#000000",
              border: "none",
              marginTop: "10px",
              padding: "15px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Join Premium
          </button>
        </Box>
        <Box
          color="white"
          sx={{
            width: { xs: "90%", sm: "70%", md: "30%" },
            mt: { xs: "40px", md: "0px" },
          }}
          height="100%"
          padding={4}
          border="1px solid #ccc"
          borderRadius={8}
          textAlign="center"
          className={styles1["background"]}
        >
          <Image
            src="/premium.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className={styles1["background-image"]}
          />
          <img
            src="/main.png"
            alt="Goco Token"
            style={{
              width: "30%", // Görselin genişliğini kartın genişliğine uyumlu hale getirir
              height: "auto", // Otomatik yükseklik, oranın korunmasını sağlar
              borderRadius: "8px 8px 0 0", // İstediğiniz köşe yuvarlaklığı
            }}
          />
          <h2>Gold Package</h2>
          <p style={{ padding: 5 }}>
            This package includes all the features of the silver package plus:
            presents:
          </p>
          <ul style={{ listStyleType: "none", padding: 5 }}>
            <li>Add Feature 1</li>
            <li>Add Feature 2</li>
            <li>Add Feature3</li>
          </ul>
          <button
            style={{
              background:
                "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
              color: "#000000",
              border: "none",
              marginTop: "10px",
              padding: "15px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Join Premium
          </button>
        </Box>
        <Box
          color="white"
          height="100%"
          sx={{
            width: { xs: "90%", sm: "70%", md: "30%" },
            mt: { xs: "40px", md: "0px" },
          }}
          padding={4}
          border="1px solid #ccc"
          borderRadius={8}
          marginX={3}
          textAlign="center"
          className={styles1["background"]}
        >
          <Image
            src="/gold.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className={styles1["background-image"]}
          />
          <img
            src="/main.png"
            alt="Goco Token"
            style={{
              width: "30%", // Görselin genişliğini kartın genişliğine uyumlu hale getirir
              height: "auto", // Otomatik yükseklik, oranın korunmasını sağlar
              borderRadius: "8px 8px 0 0", // İstediğiniz köşe yuvarlaklığı
            }}
          />
          <h2>Premium Package</h2>
          <p style={{ padding: 5 }}>
            This package offers all the features of the gold package plus:
          </p>
          <ul style={{ listStyleType: "none", padding: 5 }}>
            <li>Add Feature 1</li>
            <li>Add Feature 2</li>
            <li>Add Feature 3</li>
          </ul>
          <button
            style={{
              background:
                "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
              color: "#000000",
              border: "none",
              marginTop: "10px",
              padding: "15px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Join Premium
          </button>
        </Box>
      </Box>
      <Reveal>
        <Box
          sx={{
            py: "30px",
            display: "flex",
            justifyContent: { xs: "center", sm: "space-evenly" },
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "center",
            width: "100%",
            height: "auto",
            background: "rgb(9,8,8)",
            px: "30px",
            my: { xs: "20px", lg: "-100px" },
          }}
        >
          <Box
            sx={{
              ml: { xs: "0px", lg: "100px" },
              display: "flex",
              alignItems: { xs: "center", sm: "flex-start" },
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: { xs: "13px", sm: "16px" },
                letterSpacing: { xs: "1px", sm: "3px" },
              }}
            >
              Lotsss Lotssss Lots of rewards by Purchasing
            </Typography>

            <Box
              sx={{
                width: { xs: "80%", sm: "100%" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Typography
                sx={{
                  background:
                    "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                  display: "inline-flex",
                  fontSize: { xs: "20px", sm: "70px" },
                  fontWeight: "600",
                }}
              >
                Buying
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "20px", sm: "70px" },
                  fontWeight: "600",
                  display: "inline-flex",
                  ml: "10px",
                }}
              >
                Made
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "20px", sm: "70px" },
                  fontWeight: "600",
                  display: "inline-flex",
                  ml: "10px",
                }}
              ></Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "20px", sm: "70px" },
                  fontWeight: "600",
                  mt: { xs: "0px", lg: "-20px" },
                  display: { xs: "inline-flex", sm: "block" },
                  ml: { xs: "10px", sm: "0px" },
                }}
              >
                Easy.
              </Typography>
            </Box>
            <Typography
              sx={{
                color: "rgb(130,130,129)",
                fontSize: "13px",
                letterSpacing: "2px",
                mt: "10px",
                width: { xs: "80%", sm: "400px" },
              }}
            >
              Buying GOCO is as easy as slithering down a sunbeam. We have
              clear, concise instructions for even the most crypto-phobic among
              us.Buying GOCO is as easy as slithering down a sunbeam. We have
              clear, concise instructions for even the most crypto-phobic among
              us.
            </Typography>
            <Typography
              sx={{
                color: "rgb(130,130,129)",
                fontSize: "13px",
                letterSpacing: "2px",
                width: { xs: "80%", sm: "400px" },
                mt: "5px",
              }}
            >
              <button
                style={{
                  background:
                    "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                  color: "#000000",
                  border: "none",
                  marginTop: "10px",
                  padding: "15px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                <Link
                  href="https://docs.goldencobra.io/how-to-buy-goco-token"
                  target="_blank"
                >
                  How to buy?
                </Link>
              </button>
            </Typography>
          </Box>
          <Box
            component="img"
            style={{
              objectFit: "contain",
            }}
            src="/5.png"
            alt="BNB Logo"
            sx={{
              width: {
                xs: "300px",
                sm: "400px",
                md: 700,
              },
              height: {
                xs: "300px",
                sm: "400px",
                md: 700,
              },
            }}
          />
        </Box>
      </Reveal>
      <Reveal>
        <Box
          sx={{
            py: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "auto",
            px: "30px",
            background: "linear-gradient(to right, #000, rgb(38,37,37), #000)",
          }}
          className={styles.scroller}
          data-animated="true"
        >
          <Box
            className={styles.scroller__inner}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {new Array(6).fill(null).map((_, i) => (
              <Box
                sx={{
                  backgroundColor: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: "20px",
                  borderRadius: "100px",
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  borderLeft: "2px solid rgb(113,118,45)",
                  borderRight: "2px solid rgb(83,99,36)",
                  width: "200px",
                }}
                key={i}
              >
                <Image
                  style={{
                    objectFit: "contain",
                  }}
                  src="/bnb-logo.png"
                  alt="BNB Logo"
                  width={30}
                  height={30}
                />

                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    ml: "10px",
                  }}
                >
                  Binance
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            className={styles.scroller__inner}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {new Array(6).fill(null).map((_, i) => (
              <Box
                sx={{
                  backgroundColor: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: "20px",
                  borderRadius: "100px",
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  borderLeft: "2px solid rgb(113,118,45)",
                  borderRight: "2px solid rgb(83,99,36)",
                  width: "200px",
                }}
                key={i}
              >
                <Image
                  style={{
                    objectFit: "contain",
                  }}
                  src="/ethereum.png"
                  alt="Ethereum Logo"
                  width={30}
                  height={30}
                />

                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    ml: "10px",
                  }}
                >
                  Ethereum
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            className={styles.scroller__inner}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {new Array(6).fill(null).map((_, i) => (
              <Box
                sx={{
                  backgroundColor: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: "20px",
                  borderRadius: "100px",
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  borderLeft: "2px solid rgb(113,118,45)",
                  borderRight: "2px solid rgb(83,99,36)",
                  width: "200px",
                }}
                key={i}
              >
                <Image
                  style={{
                    objectFit: "contain",
                  }}
                  src="/bnb-logo.png"
                  alt="BNB Logo"
                  width={30}
                  height={30}
                />

                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    ml: "10px",
                  }}
                >
                  Binance
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Reveal>

      <Reveal>
        <Box
          sx={{
            py: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            height: "auto",
            background: "rgb(9,8,8)",
            px: "30px",
            mt: "70px",
          }}
        >
          <Box
            sx={{
              // display: &apos;flex&apos;,
              // alignItems: &apos;center&apos;,
              // justifyContent: &apos;center&apos;,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: { xs: "20px", sm: "70px" },
                fontWeight: "600",
                display: "inline-flex",
              }}
            >
              Join
            </Typography>
            <Typography
              sx={{
                background:
                  "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                color: "transparent",
                WebkitBackgroundClip: "text",
                display: "inline-flex",
                fontSize: { xs: "20px", sm: "70px" },
                fontWeight: "600",
                ml: { xs: "10px", sm: "0px", md: "10px" },
              }}
            >
              Golden Cobra
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: { xs: "20px", sm: "70px" },
                fontWeight: "600",
                mt: { xs: "10px", md: "-20px" },
              }}
            >
              Community
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "rgb(130,130,129)",
              fontSize: "13px",
              letterSpacing: { xs: "1px", sm: "2px" },
              mt: "10px",
              maxWidth: "800px",
              textAlign: "center",
            }}
          >
            Join us, and let&apos;s make GOCO the most loved, most popular, and
            most traded meme token of all time!
          </Typography>
          <Typography
            sx={{
              color: "rgb(130,130,129)",
              fontSize: { xs: "11px", sm: "13px" },
              letterSpacing: { xs: "1px", sm: "3px" },
              mt: "10px",
              textAlign: "center",
            }}
          >
            Get ready to embrace the meme revolution with GOCO - Because
            life&apos;s too short for boring investments. Let&apos;s have fun
            and earn big with GOCO!
          </Typography>
          <Typography
            sx={{
              color: "rgb(130,130,129)",
              fontSize: { xs: "11px", sm: "13px" },
              letterSpacing: { xs: "1px", sm: "3px" },
              mt: "10px",
              textAlign: "center",
            }}
          >
            This is just the beginning! Stay tuned for updates, contests, and
            more hilariously awesome content.
          </Typography>
        </Box>
      </Reveal>

      <Reveal>
        <Footer />
      </Reveal>
    </Box>
  );
};

export default HomePage;
