import { NextApiResponse, NextApiRequest } from 'next';
import stakingStageModel, {
  StakingStageDocument,
} from '@/server/models/stakingStageModel';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const stakingStages: StakingStageDocument[] =
        (await stakingStageModel.find()) as StakingStageDocument[];

      return res.status(200).json({
        message: 'Staking Stages successfully returned',
        stakingStages: stakingStages,
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

export default handler;
