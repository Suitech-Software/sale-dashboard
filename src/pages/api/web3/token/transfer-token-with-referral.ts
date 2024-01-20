import { NextApiRequest, NextApiResponse } from 'next';

import validateResource from '@/server/middlewares/validateResource';

import TokenService from '@/server/services/TokenService';
import { transferTokenSchema } from '@/server/schemas/tokenSchema';
import { TransferTokenWithReferralType } from '@/types/Token';
import transferModel, { TransferDocument } from '@/server/models/transferModel';
import referralModel, { ReferralDocument } from '@/server/models/referralModel';
import CustomError from '@/server/errors/CustomError';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const transferTokenData: TransferTokenWithReferralType = req.body;

      const referral: ReferralDocument = (await referralModel.findOne({
        hash: transferTokenData.hash,
      })) as ReferralDocument;

      if (!referral)
        throw new CustomError('Bad Request', 'There is no such hash', 400);

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

      await tokenService.transfer(
        transfer.userWallet,
        Number(transfer.amountOfReceive)
      );

      await transferModel.findByIdAndUpdate(transferTokenData.transferId, {
        isTransferred: true,
      });

      const bonusForReferral = Number(transfer.amountOfReceive) * 0.1;

      await referralModel.findByIdAndUpdate(referral._id, {
        amountOfReceive: [...referral.amountOfReceive, bonusForReferral],
        isTransferred: [...referral.isTransferred, false],
      });

      const newReferral: ReferralDocument = (await referralModel.findById(
        referral._id
      )) as ReferralDocument;

      let smartContractForReferral;

      if (newReferral.currentNetwork === 'bsc') {
        smartContractForReferral = await process.env
          .NEXT_PUBLIC_OUR_BSC_CONTRACT;
      } else {
        smartContractForReferral = await process.env
          .NEXT_PUBLIC_OUR_ETH_CONTRACT;
      }

      const newIsTransferred = [...newReferral.isTransferred];

      for (let i = 0; i < newReferral.amountOfReceive.length; i++) {
        if (!newReferral.isTransferred[i]) {
          const tokenServiceForReferral = new TokenService(
            newReferral.currentNetwork,
            smartContractForReferral,
            privateKey,
            wallet
          );

          await tokenServiceForReferral.transfer(
            newReferral.userWallet,
            newReferral.amountOfReceive[i]
          );

          newIsTransferred[i] = true;
        }
      }

      await referralModel.findByIdAndUpdate(newReferral._id, {
        isTransferred: newIsTransferred,
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
