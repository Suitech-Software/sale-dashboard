import { StakingStageReturnType } from '@/types/StakingStage';
import { Box, Button, Grid, Typography } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import React, { useEffect, useState } from 'react';
import NineKPlusIcon from '@mui/icons-material/NineKPlus';
import WalletIcon from '@mui/icons-material/Wallet';
import { GeneralValueType } from '@/store/slices/generalSlice';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { findBalanceByAddress } from '@/lib/findBalanceByAddress';
import { useRouter } from 'next/router';

interface Props {
  stage: StakingStageReturnType;
}

const MakeStakingPage: React.FC<Props> = ({ stage }: Props) => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [earned_award, setEarned_award] = useState(0);

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
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data:any) => {
        setCurrentBalance(data.balance);
        const stake_reward_percentage = stage.reward_percentage;
        const stake_duration = stage.duration;
        const _earned_award =
          (Number(data.balance) * stake_duration * stake_reward_percentage) /
          100;
        setEarned_award(_earned_award);
      });
  }, [currentBalance, earned_award]);

  const saveStake = async () => {
    const stakingData = {
      userWallet: generalValues.walletAddress,
      staking_stage: stage._id,
      staked_token_amount: currentBalance,
      currentNetwork: generalValues.currentNetwork,
    };

    const res = await fetch('/api/stakingInvestment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stakingData),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      router.push('/my-stakes');
    } else {
      if (data?.message) toast.error(data.message);
      else if (data?.error) toast.error(data.error.message);
      else if (data[0]) toast.error(data[0].message);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fff',
        mt: '30px',
        boxShadow:
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
        borderRadius: '20px',
        padding: { xs: '30px', sm: '40px 60px' },
      }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} lg={5}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <BadgeIcon
                  sx={{
                    fill: '#666',
                    mr: '10px',
                    width: '22px',
                    height: '22px',
                  }}
                />
                <Typography
                  sx={{
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '16px',
                    textAlign: 'center',
                    mr: '10px',
                  }}
                >
                  Stage Name:
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: '#666',
                  fontWeight: '500',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {stage.name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: '20px',
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LockIcon
                  sx={{
                    fill: '#666',
                    mr: '10px',
                    width: '22px',
                    height: '22px',
                  }}
                />
                <Typography
                  sx={{
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '16px',
                    textAlign: 'center',
                    mr: '10px',
                  }}
                >
                  Stage Locking Period:
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: '#666',
                  fontWeight: '500',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {stage.duration} {stage.locking_period_type}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: '20px',
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <EmojiEventsIcon
                  sx={{
                    fill: '#666',
                    mr: '10px',
                    width: '22px',
                    height: '22px',
                  }}
                />
                <Typography
                  sx={{
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '16px',
                    textAlign: 'center',
                    mr: '10px',
                  }}
                >
                  Token Reward(%):
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: '#666',
                  fontWeight: '500',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {stage.reward_percentage}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: '20px',
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <NineKPlusIcon
                  sx={{
                    fill: '#666',
                    mr: '10px',
                    width: '22px',
                    height: '22px',
                  }}
                />
                <Typography
                  sx={{
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '16px',
                    textAlign: 'center',
                    mr: '10px',
                  }}
                >
                  Used Supply:
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: '#666',
                  fontWeight: '500',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {stage.used_round_supply}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: '20px',
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <WalletIcon
                  sx={{
                    fill: '#666',
                    mr: '10px',
                    width: '22px',
                    height: '22px',
                  }}
                />
                <Typography
                  sx={{
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '16px',
                    textAlign: 'center',
                    mr: '10px',
                  }}
                >
                  Your available GOCO Token:
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: '#666',
                  fontWeight: '500',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {currentBalance}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} lg={7}>
          {currentBalance >= stage.min_stake_amount ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography
                  sx={{
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '15px',
                    textAlign: 'center',
                  }}
                >
                  GOCO Token*
                </Typography>
                <Box
                  component="input"
                  value={currentBalance}
                  disabled
                  type="number"
                  sx={{
                    mt: { xs: '10px', md: '0px' },
                    width: { xs: '100%', md: '80%' },
                    height: '47px',
                    border: '#8F8F8F solid 0.2px',
                    bgcolor: '#F8F9F8',
                    borderRadius: '10px',
                    color: '#666666',
                    px: '13px',
                    boxShadow: '0px 3px 20px 0px #0000001A',
                    '&:focus': {
                      outline: 'none',
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  mt: '30px',
                  width: '100%',
                }}
              >
                <Typography
                  sx={{
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '15px',
                    textAlign: 'center',
                  }}
                >
                  GOCO Token Earned
                </Typography>
                <Box
                  component="input"
                  disabled
                  type="number"
                  value={Number(currentBalance) + Number(earned_award)}
                  sx={{
                    mt: { xs: '10px', md: '0px' },
                    width: { xs: '100%', md: '70%' },
                    height: '47px',
                    border: '#8F8F8F solid 0.2px',
                    bgcolor: '#F8F9F8',
                    borderRadius: '10px',
                    color: '#666666',
                    px: '13px',
                    boxShadow: '0px 3px 20px 0px #0000001A',
                    '&:focus': {
                      outline: 'none',
                    },
                  }}
                />
              </Box>

              <Button
                sx={{
                  width: { xs: '100%', md: '150px' },
                  padding: '10px',
                  borderRadius: '20px',
                  mt: '50px',
                  alignSelf: 'flex-end',
                }}
                variant="contained"
                onClick={saveStake}
              >
                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                >
                  Save
                </Typography>
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Typography
                sx={{
                  color: '#777',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                Insufficient Token Balance
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MakeStakingPage;
