import { StakingStageDocument } from '../server/models/stakingStageModel';
import { StakingStageReturnType } from './StakingStage';
export interface IStakingInvestment {
  userWallet: string;
  is_active: boolean;
  staking_stage: StakingStageDocument['_id'];
  currentNetwork: string;
  contract_stake_id: number;
  staking_at: Date;
  unstaking_at: Date;
  is_unstaked: boolean;
  is_cancelled: boolean;
  staked_token_amount: number;
  base_token_amount: number;
  total_earning: number;
  description: string;
  description2: string;
  last_scan_at: Date;
  blocking_at: Date;
  block_release_date: Date;
}

export type CreateType = IStakingInvestment;

export type ClaimType = {
  userWallet: string;
};

export type CancelType = {
  userWallet: string;
};

export type GetStakingInvestmentType = {
  userWallet: string;
};

export type StakingInvestmentReturnType = IStakingInvestment & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type StakingInvestmentWithStageReturnType = Omit<
  IStakingInvestment,
  'staking_stage'
> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  staking_stage: StakingStageReturnType;
};
