import { StakingStageReturnType } from "@/types/StakingStage";
import { Box, Button, Grid, Typography } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LockIcon from "@mui/icons-material/Lock";
import React, { useEffect, useState } from "react";
import NineKPlusIcon from "@mui/icons-material/NineKPlus";
import WalletIcon from "@mui/icons-material/Wallet";
import { GeneralValueType } from "@/store/slices/generalSlice";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { findBalanceByAddress } from "@/lib/findBalanceByAddress";
import { useRouter } from "next/router";
import Image from "next/image";
import { UserReturnType } from "@/types/User";
import { StakingInvestmentReturnType } from "@/types/StakingInvestment";

interface Props {
  stage: StakingStageReturnType;
}

const MakeStakingPage: React.FC<Props> = ({ stage }: Props) => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [earned_award, setEarned_award] = useState(0);
  const [user, setUser] = useState<UserReturnType | null>(null);
  const [stakingInvestment, setStakingInvestment] =
    useState<StakingInvestmentReturnType | null>(null);
  const [remainingTime, setRemainingTime] = useState<any>([]);

  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  const router = useRouter();

  useEffect(() => {
    // findBalanceByAddress(
    //   generalValues.currentNetwork,
    //   generalValues.walletAddress
    // ).then((balance) => {
    //   setCurrentBalance(balance);
    //   const stake_reward_percentage = stage.reward_percentage;
    //   const stake_duration = stage.duration;
    //   const _earned_award =
    //     (Number(balance) * stake_duration * stake_reward_percentage) / 100;
    //   setEarned_award(_earned_award);
    // });

    fetch(
      `/api/transfer/getAmountOfReceiveByAddress?userWallet=${generalValues.walletAddress}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data: any) => {
        setCurrentBalance(data.balance);
        const stake_reward_percentage = stage.reward_percentage;
        const stake_duration = stage.duration;
        const _earned_award =
          (Number(data.balance) * stake_duration * stake_reward_percentage) /
          100;
        setEarned_award(_earned_award);
      });
  }, [currentBalance, earned_award]);

  useEffect(() => {
    fetch(`/api/user/getUser?userWallet=${generalValues.walletAddress}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: any) => {
        setUser(data.user);
      });
  }, []);

  useEffect(() => {
    fetch(
      `/api/stakingInvestment/getStakingInvestmentByUserWallet?userWallet=${generalValues.walletAddress}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data: any) => {
        setStakingInvestment(data.stakingInvestment);
      });
  }, []);

  useEffect(() => {
    setInterval(() => {
      if (stakingInvestment?._id) calculateRemainingTime();
    }, 1000);
  }, [calculateRemainingTime]);

  const saveStake = async () => {
    const stakingData = {
      userWallet: generalValues.walletAddress,
      staking_stage: stage._id,
      staked_token_amount: currentBalance,
      currentNetwork: generalValues.currentNetwork,
    };

    const res = await fetch("/api/stakingInvestment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stakingData),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      router.push("/my-stakes");
    } else {
      if (data?.message) toast.error(data.message);
      else if (data?.error) toast.error(data.error.message);
      else if (data[0]) toast.error(data[0].message);
    }
  };

  function calculateRemainingTime() {
    const now = new Date();
    const end = new Date(new Date(stakingInvestment?.unstaking_at as Date));

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
      text: `DAY`,
    };
    const formattedHours = {
      child: `${hours < 10 ? "0" : ""}${hours}`,
      text: `HR${hours > 1 ? "S" : ""}`,
    };
    const formattedMinutes = {
      child: `${minutes < 10 ? "0" : ""}${minutes}`,
      text: `MIN${minutes > 1 ? "S" : ""}`,
    };
    const formattedSeconds = {
      child: `${seconds < 10 ? "0" : ""}${seconds}`,
      text: `SEC`,
    };

    if (timeDifference > 0) {
      setRemainingTime((prev: any) => [
        formattedDays,
        formattedHours,
        formattedMinutes,
        formattedSeconds,
      ]);
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        mt: "30px",
        boxShadow:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
        borderRadius: "20px",
        padding: { xs: "30px", sm: "40px 60px" },
      }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <Box
            sx={{
              backgroundColor: "#151C2E",
              border: "1px solid #23293B",
              borderRadius: "20px",
              padding: "30px",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#f3f3f3",
                  fontWeight: "600",
                  fontSize: { xs: "16px", md: "20px" },
                  ml: "5px",
                  mb: "10px",
                }}
              >
                Stake Amount
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  border: "1px solid #23293B",
                  borderRadius: "20px",
                  padding: "20px",
                }}
              >
                <WalletIcon
                  sx={{
                    display: { xs: "none", sm: "inline-block" },
                    fill: "#f9f9f9",
                    mr: "10px",
                    width: "22px",
                    height: "22px",
                  }}
                />
                <Box
                  component="input"
                  value={currentBalance}
                  disabled
                  type="number"
                  sx={{
                    width: { xs: "70%" },
                    height: "47px",
                    // border: '#8F8F8F solid 0.2px',
                    // bgcolor: '#F8F9F8',
                    // borderRadius: '10px',
                    color: "#f3f3f3",
                    border: "none",
                    borderRadius: "20px",
                    backgroundColor: "#151C2E",
                    fontSize: "17px",
                    boxShadow: "0px 3px 20px 0px #0000001A",
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                />
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

            <Box
              sx={{
                mt: "20px",
              }}
            >
              <Typography
                sx={{
                  color: "#f3f3f3",
                  fontWeight: "600",
                  fontSize: { xs: "16px", md: "20px" },
                  ml: "5px",
                  mb: "10px",
                }}
              >
                Award
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  border: "1px solid #23293B",
                  borderRadius: "20px",
                  padding: "20px",
                }}
              >
                <EmojiEventsIcon
                  sx={{
                    display: { xs: "none", sm: "inline-block" },
                    fill: "#f9f9f9",
                    mr: "10px",
                    width: "22px",
                    height: "22px",
                  }}
                />
                <Box
                  component="input"
                  value={Number(earned_award)}
                  disabled
                  type="number"
                  sx={{
                    width: { xs: "70%" },
                    height: "47px",
                    color: "#f3f3f3",
                    border: "none",
                    borderRadius: "20px",
                    backgroundColor: "#151C2E",
                    fontSize: "17px",
                    boxShadow: "0px 3px 20px 0px #0000001A",
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                />
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
            <Button
              sx={{
                width: { xs: "100%" },
                padding: "10px",
                borderRadius: "15px",
                mt: "50px",
                alignSelf: "flex-end",
              }}
              variant="contained"
              onClick={saveStake}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: { xs: "12px", md: "14px" },
                  textAlign: "center",
                }}
              >
                Save
              </Typography>
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box>
            <Box
              sx={{
                backgroundColor: "#151C2E",
                border: "1px solid #23293B",
                borderRadius: "20px",
                padding: "30px",
                mb: "20px",
              }}
            >
              <Box
                sx={{
                  mb: "20px",
                }}
              >
                <Typography
                  sx={{
                    color: "#f3f3f3",
                    fontWeight: "600",
                    fontSize: { xs: "12px", md: "15px" },
                    ml: "5px",
                    mb: "10px",
                    textAlign: "center",
                  }}
                >
                  Your current stake will expire after
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
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
                    {remainingTime?.map((time: any, i: number) => (
                      <Box
                        key={i}
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
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "#f3f3f3",
                    fontWeight: "600",
                    fontSize: { xs: "14px", md: "16px" },
                  }}
                >
                  Your Balance
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: 'center',
                    mt: "10px",
                  }}
                >
                  <Box>
                    <Image
                      src="/main.png"
                      alt="BNB Logo"
                      width={20}
                      height={20}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: "#888",
                      fontSize: { xs: "12px", md: "14px" },
                      ml: "5px",
                      mt: "-5px",
                    }}
                  >
                    {user?.balance}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: "15px" }}>
                <Typography
                  sx={{
                    color: "#f3f3f3",
                    fontWeight: "600",
                    fontSize: { xs: "14px", md: "16px" },
                  }}
                >
                  Your Total Awards
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: 'center',
                    mt: "10px",
                  }}
                >
                  <Box>
                    <Image
                      src="/main.png"
                      alt="BNB Logo"
                      width={20}
                      height={20}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: "#888",
                      fontSize: { xs: "12px", md: "14px" },
                      ml: "5px",
                      mt: "-5px",
                    }}
                  >
                    {user?.awardedBalance}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                backgroundColor: "#151C2E",
                border: "1px solid #23293B",
                borderRadius: "20px",
                padding: "30px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BadgeIcon
                    sx={{
                      fill: "#f9f9f9",
                      mr: "10px",
                      width: "22px",
                      height: "22px",
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#f3f3f3",
                      fontWeight: "600",
                      fontSize: { xs: "14px", md: "16px" },
                      textAlign: "center",
                      mr: "10px",
                    }}
                  >
                    Stage Name:
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#f9f9f9",
                    fontWeight: "500",
                    fontSize: { xs: "12px", md: "14px" },
                    textAlign: "center",
                  }}
                >
                  {stage.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: "20px",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LockIcon
                    sx={{
                      fill: "#f9f9f9",
                      mr: "10px",
                      width: "22px",
                      height: "22px",
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#f3f3f3",
                      fontWeight: "600",
                      fontSize: { xs: "14px", md: "16px" },
                      textAlign: "center",
                      mr: "10px",
                    }}
                  >
                    Stage Locking Period:
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#f9f9f9",
                    fontWeight: "500",
                    fontSize: { xs: "12px", md: "14px" },
                    textAlign: "center",
                  }}
                >
                  {stage.duration} {stage.locking_period_type}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: "20px",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <EmojiEventsIcon
                    sx={{
                      fill: "#f9f9f9",
                      mr: "10px",
                      width: "22px",
                      height: "22px",
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#f3f3f3",
                      fontWeight: "600",
                      fontSize: { xs: "14px", md: "16px" },
                      textAlign: "center",
                      mr: "10px",
                    }}
                  >
                    Token Reward(%):
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#f9f9f9",
                    fontWeight: "500",
                    fontSize: { xs: "12px", md: "14px" },
                    textAlign: "center",
                  }}
                >
                  {stage.reward_percentage}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: "20px",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <NineKPlusIcon
                    sx={{
                      fill: "#f9f9f9",
                      mr: "10px",
                      width: "22px",
                      height: "22px",
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#f3f3f3",
                      fontWeight: "600",
                      fontSize: { xs: "14px", md: "16px" },
                      textAlign: "center",
                      mr: "10px",
                    }}
                  >
                    Used Supply:
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#f9f9f9",
                    fontWeight: "500",
                    fontSize: { xs: "12px", md: "14px" },
                    textAlign: "center",
                  }}
                >
                  {stage.used_round_supply}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MakeStakingPage;
