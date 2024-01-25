import { NextApiResponse, NextApiRequest } from 'next';
import validateResource from '@/server/middlewares/validateResource';
import stakingInvestmentModel, {
  StakingInvestmentDocument,
} from '@/server/models/stakingInvestmentModel';
import { GetStakingInvestmentType } from '@/types/StakingInvestment';
import { getStakingInvestmentSchema } from '@/server/schemas/stakingInvestmentSchema';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const stakingInvestmentData: GetStakingInvestmentType = req.body;

      const stakingInvestment: StakingInvestmentDocument =
        (await stakingInvestmentModel.findOne({
          userWallet: stakingInvestmentData.userWallet,
        })) as StakingInvestmentDocument;

      return res.status(200).json({
        message: 'Staking Investment successfully returned',
        stakingInvestment: stakingInvestment,
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

export default validateResource(handler, getStakingInvestmentSchema);
