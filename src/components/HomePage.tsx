import React, { useEffect, useRef } from "react";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { sendToken } from "@/lib/sendToken";
import { toast } from "react-toastify";
import { CreateType } from "@/types/Transfer";
import defaultStages from "@/lib/defaultStages.json";
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

interface Props {}

const HomePage: React.FC<Props> = ({}: Props) => {
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

    const formattedDays = days > 0 ? `${days} DAY${days > 1 ? "S" : ""}` : "";
    const formattedHours =
      hours > 0 ? `${hours} HOUR${hours > 1 ? "S" : ""}` : "";
    const formattedMinutes =
      minutes > 0 ? `${minutes} MINUTE${minutes > 1 ? "S" : ""}` : "";
    const formattedSeconds =
      seconds > 0 ? `${seconds} SECOND${seconds > 1 ? "S" : ""}` : "";

    const formattedTime = [
      formattedDays,
      formattedHours,
      formattedMinutes,
      formattedSeconds,
    ]
      .filter(Boolean)
      .join(" ");

    return formattedTime || "EXPIRED";
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
                Everything you need a.
              </Typography>
            </Box>
          </Reveal>
          <Reveal>
            <Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "27px", sm: "50px", lg: "100px" },
                  fontWeight: "600",
                  display: { xs: "inline-flex", lg: "block" },
                }}
              >
                Buy, Sell
              </Typography>

              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "27px", sm: "50px", lg: "90px" },
                  fontWeight: "600",
                  display: "inline-flex",
                  ml: { xs: "10px", lg: "0px" },
                }}
              >
                &
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
                  ml: "10px",
                }}
              >
                Accept
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
                Now, it&apos;s time to come up with a great slogan to tie all the
                pieces together. And not just a slogan, but a catchy and
                timeless slogan that people across the world will remember you
                for.
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
                <Typography
                  sx={{
                    mt: "10px",
                    fontSize: { xs: "10px", sm: "14px" },
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {calculateRemainingTime()}
                </Typography>
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
            >
              Your trusted cryptocurrency partner it&apos;s time to come up with
              a great slogan.
            </Typography>
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
                New
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
                Decade,
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
                New
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
                Assets
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
                Now, it&apos;s time to come up with a great slogan to tie all
                the pieces together.
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
                And not just a slogan.
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
                    Cryptocurrency
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
                    Now, it&apos;s time to come up with a great slogan to tie
                    all the pieces together.
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
                    Crypto Exchange
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
                    Now, it&apos;s time to come up with a great slogan to tie
                    all the pieces together.
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
                    Earn Bitcoin
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
                    Now, it&apos;s time to come up with a great slogan to tie
                    all the pieces together.
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
                    Security System
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
                    Now, it&apos;s time to come up with a great slogan to tie
                    all the pieces together.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        </Reveal>
      </Box>
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
            THERE ONLINE TRADING.
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
                fontSize: { xs: "16px", sm: "60px" },
                fontWeight: "600",
                display: { xs: "inline-flex", sm: "block" },
              }}
            >
              Cryptocurrency
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: { xs: "16px", sm: "60px" },
                fontWeight: "600",
                mt: { xs: "0px", sm: "-20px" },
                display: { xs: "inline-flex", sm: "block" },
                ml: { xs: "10px", sm: "0px" },
              }}
            >
              For People.
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
          >
            There are a lot of online forex trading accounts and people who are
            encouraging as according to them it has a lot of benefits
          </Typography>
          <Typography
            sx={{
              color: "rgb(130,130,129)",
              fontSize: "13px",
              letterSpacing: { xs: "1px", md: "2px" },
              width: { xs: "80%", sm: "400px" },
              textAlign: { xs: "center", sm: "left" },
              mt: "5px",
            }}
          >
            In the near feature.
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" paddingX={4}>
        <Box
          color="white"
          width={["100%", "30%"]}
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
            src="http://localhost:3000/_next/image?url=%2Fmain.png&w=96&q=75"
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
          width={["100%", "30%"]}
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
            src="http://localhost:3000/_next/image?url=%2Fmain.png&w=96&q=75"
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
          width={["100%", "30%"]}
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
            src="http://localhost:3000/_next/image?url=%2Fmain.png&w=96&q=75"
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
              THERE ONLINE TRADING.
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
                Stay
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
                Cool
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
                With
              </Typography>
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
                Crypto.
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
              There are a lot of online forex trading accounts and people who
              are encouraging as according to them it has a lot of benefits In
              the near future. Bitcoin happens to be an outstanding
              cryptographic achievement.
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
              The proper incentives and balance.
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
              // display: 'flex',
              // alignItems: 'center',
              // justifyContent: 'center',
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
              Join Our
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
              Cryptocurrency
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: { xs: "20px", sm: "70px" },
                fontWeight: "600",
                mt: { xs: "10px", md: "-20px" },
              }}
            >
              To Make.
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
            There are a lot of online forex trading accounts and people who are
            encouraging as according to them it has a lot of benefits In the
            near future.
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
