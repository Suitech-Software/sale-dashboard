export interface IStakingStage {
  stage: number;
  name: string;
  start_date: Date;
  end_date: Date;
  duration: number;
  reward_percentage: number;
  locking_period_type: string;
  min_stake_amount: number;
  max_stake_amount: number;
  token_price: number;
  round_supply: number;
  round_cap: number;
  used_round_supply: number;
  used_round_cap: number;
  restake_reward: number;
  additional_days: number;
  description: string;
  status: string;
}

export type CreateType = IStakingStage;

export type StakingStageReturnType = IStakingStage & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
