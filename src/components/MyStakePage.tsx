import { RootState } from '@/store';
import { GeneralValueType } from '@/store/slices/generalSlice';
import {
  CancelType,
  StakingInvestmentWithStageReturnType,
} from '@/types/StakingInvestment';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function MyStakePage() {
  const [myStakes, setMyStakes] = useState<
    StakingInvestmentWithStageReturnType[]
  >([]);

  const router = useRouter();

  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  useEffect(() => {
    const getStake = async () => {
      const res = await fetch(
        `/api/stakingInvestment/getStakingInvestmentByUserWallet?userWallet=${generalValues.walletAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setMyStakes([data.stakingInvestment]);
      } else {
        if (data?.message) toast.error(data.message);
        else if (data?.error) toast.error(data.error.message);
        else if (data[0]) toast.error(data[0].message);
      }
    };

    if (generalValues.walletAddress) {
      getStake();
    } else {
      toast.info('You have to connect your wallet');
    }
  }, []);

  const cancelStake = async () => {
    const cancelData: CancelType = {
      userWallet: generalValues.walletAddress,
    };

    const res = await fetch('/api/stakingInvestment/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cancelData),
    });
    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      toast.info('You has been blocked for 72 hours');

      router.push('/stake-history');
    } else {
      if (data?.message) toast.error(data.message);
      else if (data?.error) toast.error(data.error.message);
      else if (data[0]) toast.error(data[0].message);
    }
  };

  const claimStake = async () => {
    const claimData: CancelType = {
      userWallet: generalValues.walletAddress,
    };

    const res = await fetch('/api/stakingInvestment/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(claimData),
    });
    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      router.push('/stake-history');
    } else {
      if (data?.message) toast.error(data.message);
      else if (data?.error) toast.error(data.error.message);
      else if (data[0]) toast.error(data[0].message);
    }
  };

  return (
    <Box
      sx={{
        px: { xs: '10px', sm: '30px', lg: '100px' },
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
        My Stakes
      </Typography>

      <Box
        sx={{
          mt: '30px',
        }}
      >
        {myStakes[0] ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="My Stake">
              <TableHead>
                <TableRow>
                  <TableCell>Sr.No.</TableCell>
                  <TableCell>Stage Name</TableCell>
                  <TableCell>Staking At</TableCell>
                  <TableCell>Unstaking At</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Reward</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myStakes.map(
                  (myStake: StakingInvestmentWithStageReturnType, i) => (
                    <TableRow
                      key={myStake._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {i + 1}
                      </TableCell>
                      <TableCell>{myStake.staking_stage.name}</TableCell>
                      <TableCell>
                        {new Date(myStake.staking_at).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric',
                          timeZoneName: 'short',
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(myStake.unstaking_at).toLocaleString(
                          'en-US',
                          {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            timeZoneName: 'short',
                          }
                        )}
                      </TableCell>
                      <TableCell>{myStake.staked_token_amount}</TableCell>
                      <TableCell>
                        {(Number(myStake.staked_token_amount) *
                          myStake.staking_stage.duration *
                          myStake.staking_stage.reward_percentage) /
                          100}
                      </TableCell>
                      <TableCell>{myStake.description}</TableCell>
                      <TableCell>
                        {new Date(myStake.unstaking_at) > new Date() ? (
                          <Button
                            variant="contained"
                            sx={{
                              ml: '20px',
                              width: 'max-content',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '40px',
                              boxShadow: 'none',
                              px: '20px',
                              borderRadius: '15px',
                              background: '#fbbf24',
                              '&:hover': {
                                background: '#f59e0b',
                                boxShadow: 'none',
                              },
                            }}
                            onClick={cancelStake}
                          >
                            <Typography
                              sx={{
                                color: 'black',
                                fontSize: '14px',
                                width: '100%',
                              }}
                            >
                              Cancel Stake
                            </Typography>
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            sx={{
                              ml: '20px',
                              width: 'max-content',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '40px',
                              boxShadow: 'none',
                              px: '20px',
                              borderRadius: '15px',
                              background: '#fbbf24',
                              '&:hover': {
                                background: '#f59e0b',
                                boxShadow: 'none',
                              },
                            }}
                            onClick={claimStake}
                          >
                            <Typography
                              sx={{
                                color: 'black',
                                fontSize: '14px',
                                width: '100%',
                              }}
                            >
                              Get Rewards
                            </Typography>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              height: '50vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: '10',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              You have not any stake.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MyStakePage;
