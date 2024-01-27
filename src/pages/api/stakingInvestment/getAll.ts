import { NextApiResponse, NextApiRequest } from 'next';
import validateResource from '@/server/middlewares/validateResource';
import stakingInvestmentModel from '@/server/models/stakingInvestmentModel';
import { getStakingInvestmentSchema } from '@/server/schemas/stakingInvestmentSchema';
import { get } from 'lodash';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const stakingInvestments = await stakingInvestmentModel
        .find({
          userWallet: get(req.query, 'userWallet') as string,
        })
        .populate({
          path: 'staking_stage',
          select: 'name reward_percentage duration',
        });

      return res.status(200).json({
        message: 'Staking Investments successfully returned',
        stakingInvestments: stakingInvestments,
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
