import React, { useEffect } from "react";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { StakingStageReturnType } from "@/types/StakingStage";
import MakeStakingPage from "./MakeStakingPage";
import { GeneralValueType } from "@/store/slices/generalSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Reveal from "./Reveal";
import Footer from "./Footer";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Image from "next/image";
import FlagIcon from "@mui/icons-material/Flag";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

interface Props {}

const StakePage: React.FC<Props> = ({}: Props) => {
  const [stages, setStages] = useState<StakingStageReturnType[]>([]);
  const [stake, setStake] = useState<string>("");

  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  useEffect(() => {
    const fetchStakingStages = async () => {
      const res = await fetch("/api/stakingStage/getAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setStages(data.stakingStages);
      } else {
        if (data?.message) toast.error(data.message);
        else if (data?.error) toast.error(data.error.message);
        else if (data[0]) toast.error(data[0].message);
      }
    };

    fetchStakingStages();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          px: { xs: "10px", sm: "100px" },
          py: "30px",
          mt: "100px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          zIndex: "10",
          minHeight: "100vh",
          height: "auto",
        }}
      >
        {stake ? (
          <KeyboardArrowLeftIcon
            sx={{
              fill: "white",
              width: "30px",
              height: "30px",
              cursor: "pointer",
            }}
            onClick={() => {
              setStake("");
            }}
          />
        ) : null}
        <Reveal>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-start" },
              width: "100%",
              mt: { xs: "30px" },
            }}
          >
            <Typography
              sx={{
                background:
                  "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                color: "transparent",
                WebkitBackgroundClip: "text",
                display: "inline-flex",
                fontSize: { xs: "30px", sm: "40px" },
                fontWeight: "600",
              }}
            >
              {stake ? "Make Staking" : "Stake List"}
            </Typography>
          </Box>
        </Reveal>
        <Reveal>
          {stages[0] ? (
            <>
              {stake ? (
                <Reveal>
                  <MakeStakingPage stage={stages[Number(stake) - 1]} />
                </Reveal>
              ) : (
                <Grid
                  container
                  sx={{
                    mt: "30px",
                  }}
                  spacing={3}
                >
                  {stages.map((stage: StakingStageReturnType) => (
                    <Grid item xs={12} md={6} lg={4} key={stage._id}>
                      <Box
                        sx={{
                          backgroundColor: "#fff",
                          boxShadow:
                            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
                          padding: "40px 25px",
                          borderRadius: "20px",
                          display: "flex",
                          flexDirection: "column",
                          alignContent: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                            background:
                              stage.duration === 30
                                ? "rgb(42,89,209)"
                                : stage.duration === 60
                                ? "rgb(87,182,113)"
                                : "rgb(213,71,90)",
                            width: "100px",
                            height: "100px",
                            borderTopRightRadius: "20px",
                            clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: "500",
                              fontSize: "14px",
                              position: "absolute",
                              right: "15px",
                              top: "5px",
                            }}
                          >
                            {stage.duration} Days
                          </Typography>
                          <Image
                            style={{
                              position: "absolute",
                              objectFit: "contain",
                              marginTop: "29px",
                              marginLeft: "35px",
                            }}
                            src="/clock.png"
                            alt="BNB Logo"
                            width={60}
                            height={60}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <Box sx={{ position: "relative" }}>
                            <Box>
                              <Image
                                style={{
                                  objectFit: "contain",
                                }}
                                src="/main.png"
                                alt="BNB Logo"
                                width={50}
                                height={50}
                              />
                            </Box>
                            <Box
                              sx={{
                                padding: "2px",
                                position: "absolute",
                                top: "32px",
                                left: "32px",
                                backgroundColor: "#fff",
                                borderRadius: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                style={{
                                  objectFit: "contain",
                                }}
                                src="/main.png"
                                alt="BNB Logo"
                                width={26}
                                height={26}
                              />
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              ml: "30px",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#333",
                                fontWeight: "600",
                                fontSize: "18px",
                              }}
                            >
                              Earn GOCO
                            </Typography>
                            <Typography
                              sx={{
                                color: "rgb(131, 151, 187)",
                                fontWeight: "600",
                                fontSize: "12px",
                              }}
                            >
                              Stake GOCO
                            </Typography>
                            <Box
                              sx={{
                                backgroundColor: "rgb(243, 246, 251)",
                                borderRadius: "10px",
                                padding: "3px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: "10px",
                              }}
                            >
                              <FlagIcon
                                sx={{
                                  color: "rgb(157, 172, 200)",
                                  width: "16px",
                                  height: "16px",
                                }}
                              />
                              <Typography
                                sx={{
                                  color: "rgb(19, 31, 51)",
                                  fontWeight: "600",
                                  fontSize: "12px",
                                  ml: "7px",
                                }}
                              >
                                Finished
                              </Typography>{" "}
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            mt: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "rgb(10,22,43)",
                                fontWeight: "600",
                                fontSize: "13px",
                              }}
                            >
                              Total Stake
                            </Typography>
                            <HelpOutlineIcon
                              sx={{
                                color: "rgb(125,154,211)",
                                ml: "5px",
                                width: "17px",
                                height: "17px",
                              }}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "rgb(10,22,43)",
                                fontWeight: "600",
                                fontSize: "13px",
                              }}
                            >
                              44.03
                            </Typography>
                            <Typography
                              sx={{
                                color: "rgb(140,163,209)",
                                fontWeight: "600",
                                fontSize: "13px",
                                ml: "6px",
                              }}
                            >
                              /
                            </Typography>
                            <Typography
                              sx={{
                                color: "rgb(116,138,176)",
                                fontWeight: "600",
                                fontSize: "13px",
                                ml: "4px",
                              }}
                            >
                              2 125
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Box
                            sx={{
                              mt: "10px",
                              height: "5px",
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              borderRadius: "20px",
                              background: "#e4e4e7",
                              py: "6px",
                              position: "relative",
                            }}
                          >
                            <Box
                              sx={{
                                height: "5px",
                                width: `${12}%`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "20px",
                                background: "rgb(94,197,122)",
                                p: "6px",
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
                              {/* <strong>{calculateRemainingTime()}</strong> */}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          sx={{
                            background: "rgb(46,97,232)",
                            paddingY: "10px",
                            mt: "40px",
                            borderRadius: "10px",
                          }}
                          onClick={() => {
                            if (generalValues.walletAddress) {
                              setStake(stage.stage.toString());
                            } else {
                              toast.info("You have to connect your wallet");
                            }
                          }}
                        >
                          <AccountBalanceWalletIcon
                            sx={{
                              color: "#fff",
                              width: "23px",
                              height: "23px",
                              mr: "10px",
                            }}
                          />
                          <Typography sx={{ textTransform: "capitalize" }}>
                            Stake Now
                          </Typography>
                        </Button>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: "40px",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                color: "rgb(122,142,182)",
                                fontWeight: "600",
                                fontSize: "13px",
                              }}
                            >
                              Earned GOCO
                            </Typography>
                            <Box
                              sx={{
                                background: "rgb(251,226,230)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "20px",
                                padding: "4px",
                                mt: "5px",
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "rgb(230,80,100)",
                                  fontWeight: "600",
                                  fontSize: "11px",
                                }}
                              >
                                Active
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              background: "rgb(203,236,212)",
                              px: "20px",
                              py: "20px",
                              borderRadius: "10px",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: "13px",
                              }}
                            >
                              Harvest
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={35} sx={{ color: "#f3f3f3" }} />
            </Box>
          )}
        </Reveal>
      </Box>
      <Reveal>
        <Footer />
      </Reveal>
    </Box>
  );
};

export default StakePage;
