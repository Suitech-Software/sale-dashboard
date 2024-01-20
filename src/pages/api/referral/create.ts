import { NextApiResponse, NextApiRequest } from 'next';
import validateResource from '@/server/middlewares/validateResource';
import referralModel, { ReferralDocument } from '@/server/models/referralModel';
import { CreateType } from '@/types/Referral';
import { createReferralSchema } from '@/server/schemas/referralSchema';
import { v4 as uuidv4 } from 'uuid';
import CustomError from '@/server/errors/CustomError';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const referralData: CreateType = req.body;

      const oldReferral: ReferralDocument = (await referralModel.findOne({
        userWallet: referralData.userWallet,
      })) as ReferralDocument;

      if (oldReferral)
        throw new CustomError(
          'Bad Request',
          'That wallet already has a referral',
          400
        );

      const referral: ReferralDocument = (await referralModel.create({
        ...referralData,
        hash: uuidv4(),
      })) as ReferralDocument;

      const referralURL = `${process.env.NEXT_PUBLIC_UI_URL}/referral?hash=${referral.hash}`;

      return res.status(200).json({
        message: 'Referral successfully created',
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

export default validateResource(handler, createReferralSchema);
