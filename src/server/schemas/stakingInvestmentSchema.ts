import { boolean, number, object, string } from 'zod';

export const createStakingInvestmentSchema = object({
  body: object({
    userWallet: string({ required_error: 'User Wallet is required' }),
    staking_stage: string({ required_error: 'Staking Stake is required' }),
    contract_stake_id: number().optional(),
    staked_token_amount: number({
      required_error: 'Staked Token Amount is required',
    }),
    base_token_amount: number().optional(),
    total_earning: number().optional(),
    description: string().optional(),
    description2: string().optional(),
  }),
});

export const claimStakingInvestmentSchema = object({
  body: object({
    userWallet: string({ required_error: 'User Wallet is required' }),
  }),
});

export const cancelStakingInvestmentSchema = object({
  body: object({
    userWallet: string({ required_error: 'User Wallet is required' }),
  }),
});

export const getStakingInvestmentSchema = object({
  body: object({
    userWallet: string({ required_error: 'User Wallet is required' }),
  }),
});
