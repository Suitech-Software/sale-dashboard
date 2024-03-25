import { NextApiResponse, NextApiRequest } from 'next';
import validateResource from '@/server/middlewares/validateResource';
import transferModel, { TransferDocument } from '@/server/models/transferModel';
import { CreateType } from '@/types/Transfer';
import { createTransferSchema } from '@/server/schemas/transferSchema';
import userModel, { UserDocument } from '@/server/models/userModel';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const transferData: CreateType = req.body;

      let user: UserDocument;

      user = (await userModel.findOne({
        userWallet: transferData.userWallet,
      })) as UserDocument;

      if (!user)
        user = await userModel.create({ userWallet: transferData.userWallet });

      const transfer: TransferDocument = (await transferModel.create({
        ...transferData,
      })) as TransferDocument;

      user.balance += Number(transferData.amountOfReceive);

      await user.save();

      return res.status(201).json({
        message: 'Transfer successfully saved',
        transferId: transfer._id,
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

export default validateResource(handler, createTransferSchema);
