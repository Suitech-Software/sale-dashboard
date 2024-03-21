import { NextApiResponse, NextApiRequest } from 'next';
import { get } from 'lodash';
import validateResource from '@/server/middlewares/validateResource';
import userModel, { UserDocument } from '@/server/models/userModel';
import { getUserSchema } from '@/server/schemas/userSchema';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const user: UserDocument = (await userModel.findOne({
        userWallet: {
          $regex: `^${get(req.query, 'userWallet') as string}$`,
          $options: 'i',
        },
      })) as UserDocument;

      return res.status(200).json({
        message: 'User successfully returned',
        user,
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

export default validateResource(handler, getUserSchema);
