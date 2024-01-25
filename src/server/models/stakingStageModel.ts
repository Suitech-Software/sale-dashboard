import mongoose from 'mongoose';
import { IStakingStage } from '@/types/StakingStage';

export interface StakingStageDocument extends mongoose.Document, IStakingStage {
  createdAt: Date;
  updatedAt: Date;
}

const stakingStageSchema = new mongoose.Schema(
  {
    stage: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    reward_percentage: {
      type: Number,
      required: true,
    },
    locking_period_type: {
      type: String,
      enum: ['Week(s)', 'Month(s)', 'Minutes(s)', 'Day(s)'],
      required: true,
    },
    min_stake_amount: {
      type: Number,
      required: true,
    },
    max_stake_amount: {
      type: Number,
      required: false,
    },
    token_price: {
      type: Number,
      // required: true,
    },
    round_supply: {
      type: Number,
      required: false,
    },
    round_cap: {
      type: Number,
      required: false,
    },
    used_round_supply: {
      type: Number,
      required: false,
      default: 0,
    },
    used_round_cap: {
      type: Number,
      required: false,
      default: 0,
    },
    restake_reward: {
      type: Number,
      required: true,
    },
    additional_days: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const stakingStageModel =
  mongoose.models.StakingStage ||
  mongoose.model<StakingStageDocument>('StakingStage', stakingStageSchema);

export default stakingStageModel;
