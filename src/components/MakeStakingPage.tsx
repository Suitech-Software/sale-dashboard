import { StakingStageReturnType } from '@/types/StakingStage';
import { Box, Button, Grid, Typography } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import React, { useState } from 'react';
import NineKPlusIcon from '@mui/icons-material/NineKPlus';
import WalletIcon from '@mui/icons-material/Wallet';

interface Props {
  stage: StakingStageReturnType;
}

const MakeStakingPage: React.FC<Props> = ({ stage }: Props) => {
  const [walletBalance, setWalletBalance] = useState('527109300000000050000');

  const stake_reward_percentage = stage.reward_percentage;
  const stake_duration = stage.duration;
  const _earned_award =
    (Number(walletBalance) * stake_duration * stake_reward_percentage) / 100;
  const earned_award = _earned_award;

  const saveStake = async () => {};

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
                {walletBalance}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} lg={7}>
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
                defaultValue={walletBalance}
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
                defaultValue={Number(walletBalance) + Number(earned_award)}
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default MakeStakingPage;
