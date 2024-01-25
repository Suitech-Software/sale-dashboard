import { StakingInvestmentWithStageReturnType } from '@/types/StakingInvestment';
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
import React, { useState } from 'react';

function MyStakePage() {
  const [myStakes, setMyStakes] = useState<
    StakingInvestmentWithStageReturnType[]
  >([]);

  const cancelStake = async () => {};

  const claimStake = async () => {};

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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                      {new Date(myStake.unstaking_at).toLocaleString('en-US', {
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
                        <Button onClick={cancelStake}>Cancel Stake</Button>
                      ) : (
                        <Button onClick={claimStake}>Get Rewards</Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default MyStakePage;
