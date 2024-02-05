import { RootState } from '@/store';
import { GeneralValueType } from '@/store/slices/generalSlice';
import { StakingInvestmentWithStageReturnType } from '@/types/StakingInvestment';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Footer from './Footer';
import Reveal from './Reveal';

function StakeHistoryPage() {
  const [stakes, setStakes] = useState<StakingInvestmentWithStageReturnType[]>(
    []
  );

  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  useEffect(() => {
    const getStake = async () => {
      const res = await fetch(
        `/api/stakingInvestment/getAll?userWallet=${generalValues.walletAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setStakes(data.stakingInvestments);
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

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Box
        sx={{
          px: { xs: '10px', sm: '30px', lg: '100px' },
          py: '30px',
          mt: '100px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
          height: 'auto',
          zIndex: '10',
          backgroundImage: 'url(/6.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <Reveal>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
              width: '100%',
              mt: { xs: '30px' },
            }}
          >
            <Typography
              sx={{
                background:
                  'linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
                display: 'inline-flex',
                fontSize: { xs: '30px', sm: '40px' },
                fontWeight: '600',
              }}
            >
              Stake History
            </Typography>
          </Box>
        </Reveal>
        <Reveal>
          <Box
            sx={{
              mt: '30px',
            }}
          >
            {stakes[0] ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Stake History">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr.No.</TableCell>
                      <TableCell>Stage Name</TableCell>
                      <TableCell>Staking At</TableCell>
                      <TableCell>Unstaking At</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Staked Token Amount</TableCell>
                      <TableCell>Reward</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stakes.map(
                      (myStake: StakingInvestmentWithStageReturnType, i) => (
                        <TableRow
                          key={myStake._id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {i + 1}
                          </TableCell>
                          <TableCell>{myStake.staking_stage.name}</TableCell>
                          <TableCell>
                            {new Date(myStake.staking_at).toLocaleString(
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
                          <TableCell>{myStake.description}</TableCell>
                          <TableCell>{myStake.staked_token_amount}</TableCell>
                          <TableCell>
                            {(Number(myStake.staked_token_amount) *
                              myStake.staking_stage.duration *
                              myStake.staking_stage.reward_percentage) /
                              100}
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
                    fontSize: '20px',
                    fontWeight: '600',
                  }}
                >
                  You have not any stake.
                </Typography>
              </Box>
            )}
          </Box>
        </Reveal>
      </Box>
      <Reveal>
        <Footer />
      </Reveal>
    </Box>
  );
}

export default StakeHistoryPage;
