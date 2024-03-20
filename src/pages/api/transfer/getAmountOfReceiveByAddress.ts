import { NextApiResponse, NextApiRequest } from 'next';
import transferModel, { TransferDocument } from '@/server/models/transferModel';
import { get } from 'lodash';
import validateResource from '@/server/middlewares/validateResource';
import { getAmountOfReceiveByAddressSchema } from '@/server/schemas/transferSchema';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const transfers: TransferDocument[] = (await transferModel.find({
        userWallet: {
          $regex: `^${get(req.query, 'userWallet') as string}$`,
          $options: 'i',
        },
      })) as TransferDocument[];

      let balance = 0;
      if (transfers[0]) {
        for (let i = 0; i < transfers.length; i++) {
          balance += Number(transfers[0].amountOfReceive);
        }
      }

      return res.status(200).json({
        message: 'Balance successfully returned',
        balance,
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

export default validateResource(handler, getAmountOfReceiveByAddressSchema);
