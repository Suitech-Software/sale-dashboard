import { NextApiResponse, NextApiRequest } from 'next';
import validateResource from '@/server/middlewares/validateResource';
import stakingInvestmentModel, {
  StakingInvestmentDocument,
} from '@/server/models/stakingInvestmentModel';
import { CancelType } from '@/types/StakingInvestment';
import { cancelStakingInvestmentSchema } from '@/server/schemas/stakingInvestmentSchema';
import stakingStageModel from '@/server/models/stakingStageModel';
import CustomError from '@/server/errors/CustomError';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const cancelData: CancelType = req.body;

      const stakingInvestment: StakingInvestmentDocument =
        (await stakingInvestmentModel.findOne({
          userWallet: cancelData.userWallet,
          is_active: true,
        })) as StakingInvestmentDocument;

      if (!stakingInvestment)
        throw new CustomError('Not Found', 'You do not have any stake', 404);
      const currentDate = new Date();

      if (new Date(stakingInvestment.unstaking_at) <= currentDate) {
        return res.status(200).json({
          message: 'Token can be Withdrawn',
        });
      }

      if (
        stakingInvestment?.block_release_date &&
        new Date(stakingInvestment?.block_release_date) > currentDate
      ) {
        return res.status(200).json({
          message: 'You have a block on stake',
        });
      }

      const block_time_per_hours = Number(
        process.env.NEXT_PUBLIC_BLOCK_TIME_PER_HOURS
      );

      stakingInvestment.is_cancelled = true;
      stakingInvestment.is_active = false;
      stakingInvestment.blocking_at = currentDate;
      stakingInvestment.block_release_date = new Date(
        currentDate.getTime() + block_time_per_hours * 60 * 60 * 1000
      );

      await stakingInvestment.save();

      const stakingStage = await stakingStageModel.findById(
        stakingInvestment.staking_stage
      );

      stakingStage.used_round_supply -= stakingInvestment.staked_token_amount;

      await stakingStage.save();

      return res.status(200).json({
        message: 'Stake successfully canceled',
      });
    } catch (err: any) {
      if (err.status) {
        return res.status(err.status).json({
          error: {
            name: err.name,
            message: err.message,
          },
        });
      }

      return res.status(500).json({
        error: {
          name: err.name,
          message: err.message,
        },
      });
    }
  } else {
    return res.status(403).json({ message: 'You have not a permission' });
  }
}

export default validateResource(handler, cancelStakingInvestmentSchema);
