import { NextApiResponse, NextApiRequest } from 'next';
import validateResource from '@/server/middlewares/validateResource';
import stakingInvestmentModel, {
  StakingInvestmentDocument,
} from '@/server/models/stakingInvestmentModel';
import { CreateType } from '@/types/StakingInvestment';
import { createStakingInvestmentSchema } from '@/server/schemas/stakingInvestmentSchema';
import stakingStageModel, {
  StakingStageDocument,
} from '@/server/models/stakingStageModel';
import CustomError from '@/server/errors/CustomError';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const stakingInvestmentData: CreateType = req.body;

      const si: StakingInvestmentDocument[] =
        (await stakingInvestmentModel.find({
          userWallet: stakingInvestmentData.userWallet,
        })) as StakingInvestmentDocument[];

      for (let i = 0; i < si.length; i++) {
        if (si[i]?.is_active) {
          throw new CustomError(
            'Bad Request',
            'You already have an active stake',
            400
          );
        } else if (si[i]?.is_cancelled && si[i]?.block_release_date) {
          if (si[i]?.block_release_date > new Date()) {
            var milli = si[i]?.block_release_date.getTime() - Date.now();

            var hour = Math.floor(milli / (1000 * 60 * 60));

            var minutes = Math.floor((milli % (1000 * 60 * 60)) / (1000 * 60));

            throw new CustomError(
              'Bad Request',
              `You had block until ${hour} hours ${minutes} minutes`,
              400
            );
          }
        }
      }

      const stakingStage: StakingStageDocument =
        (await stakingStageModel.findById(
          stakingInvestmentData.staking_stage
        )) as StakingStageDocument;

      if (!stakingStage)
        throw new CustomError(
          'Not Found',
          'There is no Staking Stage with that id',
          404
        );

      let unstaking_at = new Date(
        new Date().setDate(new Date().getDate() + stakingStage.duration)
      );

      const stakingInvestment: StakingInvestmentDocument =
        (await stakingInvestmentModel.create({
          ...stakingInvestmentData,
          is_active: true,
          staking_at: Date.now(),
          unstaking_at,
          description: 'In Staking',
        })) as StakingInvestmentDocument;

      stakingStage.used_round_supply += stakingInvestment.staked_token_amount;

      await stakingStage.save();

      return res.status(201).json({
        message: 'Staking Investment successfully saved',
        stakingInvestmentId: stakingInvestment._id,
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

export default validateResource(handler, createStakingInvestmentSchema);
