import React, { useEffect } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { StakingStageReturnType } from '@/types/StakingStage';
import MakeStakingPage from './MakeStakingPage';
import { GeneralValueType } from '@/store/slices/generalSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Props {}

const StakePage: React.FC<Props> = ({}: Props) => {
  const [stages, setStages] = useState<StakingStageReturnType[]>([]);
  const [stake, setStake] = useState<string>('');

  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  useEffect(() => {
    const fetchStakingStages = async () => {
      const res = await fetch('/api/stakingStage/getAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
        px: { xs: '10px', sm: '100px' },
        py: '30px',
        mt: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        zIndex: '10',
      }}
    >
      <Typography
        sx={{
          color: 'white',
          fontWeight: '600',
          fontSize: '20px',
        }}
      >
        {stake ? 'Make Staking' : 'Stake List'}
      </Typography>
      {stages[0] ? (
        <>
          {stake ? (
            <MakeStakingPage stage={stages[Number(stake) - 1]} />
          ) : (
            <Grid
              container
              sx={{
                mt: '30px',
              }}
              spacing={3}
            >
              {stages.map((stage: StakingStageReturnType) => (
                <Grid item xs={12} md={6} lg={4} key={stage._id}>
                  <Box
                    sx={{
                      backgroundColor: '#fff',
                      boxShadow:
                        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
                      padding: '40px 20px',
                      borderRadius: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignContent: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#333',
                        fontWeight: '600',
                        fontSize: '16px',
                        textAlign: 'center',
                      }}
                    >
                      {stage.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#333',
                        fontWeight: '600',
                        fontSize: '14px',
                        textAlign: 'center',
                        mt: '15px',
                      }}
                    >
                      Stake Start Date:{' '}
                      {new Date().toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#333',
                        fontWeight: '600',
                        fontSize: '14px',
                        textAlign: 'center',
                        mt: '15px',
                      }}
                    >
                      Stake End Date:{' '}
                      {new Date(
                        new Date(Date.now()).setDate(
                          new Date(Date.now()).getDate() + stage.duration
                        )
                      ).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        my: '40px',
                      }}
                    >
                      <Button
                        sx={{
                          width: '150px',
                          padding: '10px',
                        }}
                        variant="contained"
                        onClick={() => {
                          if (generalValues.walletAddress) {
                            setStake(stage.stage.toString());
                          } else {
                            toast.info('You have to connect your wallet');
                          }
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '14px',
                            textAlign: 'center',
                          }}
                        >
                          Stake
                        </Typography>
                      </Button>
                    </Box>
                    <Typography
                      sx={{
                        color: '#666',
                        fontWeight: '600',
                        fontSize: '14px',
                        textAlign: 'center',
                      }}
                    >
                      Duration: {stage.duration}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#666',
                        fontWeight: '600',
                        fontSize: '14px',
                        mt: '15px',
                        textAlign: 'center',
                      }}
                    >
                      Used Round Supply: {stage.used_round_supply}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#666',
                        fontWeight: '600',
                        fontSize: '14px',
                        mt: '15px',
                        textAlign: 'center',
                      }}
                    >
                      Minimum Stake Amount: {stage.min_stake_amount} TXP
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={35} sx={{ color: '#f3f3f3' }} />
        </Box>
      )}
    </Box>
  );
};

export default StakePage;
