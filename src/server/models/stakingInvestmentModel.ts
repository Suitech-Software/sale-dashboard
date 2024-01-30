import mongoose from 'mongoose';
import { IStakingInvestment } from '@/types/StakingInvestment';
import './stakingStageModel';

export interface StakingInvestmentDocument
  extends mongoose.Document,
    IStakingInvestment {
  createdAt: Date;
  updatedAt: Date;
}

const stakingInvestmentSchema = new mongoose.Schema(
  {
    userWallet: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
    },
    staking_stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StakingStage',
      required: true,
    },
    currentNetwork: {
      type: String,
      required: true,
    },
    contract_stake_id: {
      type: Number,
    },
    staking_at: {
      type: Date,
      required: true,
    },
    unstaking_at: {
      type: Date,
      required: true,
    },
    is_unstaked: {
      type: Boolean,
      default: false,
    },
    is_cancelled: {
      type: Boolean,
      default: false,
    },
    staked_token_amount: {
      type: Number,
      required: false,
    },
    base_token_amount: {
      type: Number,
      required: false,
    },
    total_earning: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    description2: {
      type: String,
      required: false,
    },
    last_scan_at: {
      type: Date,
      default: Date.now,
    },
    blocking_at: {
      type: Date,
      default: null,
    },
    block_release_date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const stakingInvestmentModel =
  mongoose.models.StakingInvestment ||
  mongoose.model<StakingInvestmentDocument>(
    'StakingInvestment',
    stakingInvestmentSchema
  );

export default stakingInvestmentModel;
