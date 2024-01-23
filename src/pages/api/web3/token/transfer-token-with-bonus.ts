import { NextApiRequest, NextApiResponse } from 'next';

import validateResource from '@/server/middlewares/validateResource';

import TokenService from '@/server/services/TokenService';
import { transferTokenSchema } from '@/server/schemas/tokenSchema';
import { TransferTokenType } from '@/types/Token';
import transferModel, { TransferDocument } from '@/server/models/transferModel';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const transferTokenData: TransferTokenType = req.body;

      const transfer: TransferDocument = (await transferModel.findById(
        transferTokenData.transferId
      )) as TransferDocument;

      let smartContract;

      if (transfer.currentNetwork === 'bsc') {
        smartContract = await process.env.NEXT_PUBLIC_OUR_BSC_CONTRACT;
      } else {
        smartContract = await process.env.NEXT_PUBLIC_OUR_ETH_CONTRACT;
      }
      const wallet =
        process.env.NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS_FOR_OUR_SMART_CONTRACT;

      const privateKey =
        process.env
          .NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS_PRIVATE_KEY_FOR_OUR_SMART_CONTRACT;

      const tokenService = new TokenService(
        transfer.currentNetwork,
        smartContract,
        privateKey,
        wallet
      );

      const bonus = Number(transfer.amountOfReceive) * 0.1;

      const amountWithBonus = Number(transfer.amountOfReceive) + bonus;

      await tokenService.transfer(transfer.userWallet, amountWithBonus);

      await transferModel.findByIdAndUpdate(transferTokenData.transferId, {
        isTransferred: true,
      });

      return res.status(200).json({
        message: 'Token successfully transferred',
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

export default validateResource(handler, transferTokenSchema);
