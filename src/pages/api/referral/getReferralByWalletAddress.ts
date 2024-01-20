import { NextApiResponse, NextApiRequest } from 'next';
import validateResource from '@/server/middlewares/validateResource';
import referralModel, { ReferralDocument } from '@/server/models/referralModel';
import { ReferralGetType } from '@/types/Referral';
import { getReferralSchema } from '@/server/schemas/referralSchema';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const referralData: ReferralGetType = req.body;

      const referral: ReferralDocument = (await referralModel.findOne({
        userWallet: referralData.userWallet,
      })) as ReferralDocument;

      const referralURL = `${process.env.NEXT_PUBLIC_UI_URL}/referral?hash=${referral.hash}`;

      return res.status(200).json({
        message: 'Referral successfully returned',
        referralURL: referralURL,
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

export default validateResource(handler, getReferralSchema);
