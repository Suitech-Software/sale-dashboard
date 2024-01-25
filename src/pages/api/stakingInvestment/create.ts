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
        })) as StakingInvestmentDocument;

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
