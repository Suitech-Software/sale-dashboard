import { NextApiResponse, NextApiRequest } from 'next';
import validateResource from '@/server/middlewares/validateResource';
import stakingInvestmentModel, {
  StakingInvestmentDocument,
} from '@/server/models/stakingInvestmentModel';
import { ClaimType } from '@/types/StakingInvestment';
import { claimStakingInvestmentSchema } from '@/server/schemas/stakingInvestmentSchema';
import stakingStageModel, {
  StakingStageDocument,
} from '@/server/models/stakingStageModel';
import CustomError from '@/server/errors/CustomError';
import sendedTokenModel, {
  SendedTokenDocument,
} from '@/server/models/sendedTokenModel';
import transferModel, { TransferDocument } from '@/server/models/transferModel';
import TokenService from '@/server/services/TokenService';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const claimData: ClaimType = req.body;

      const transfer: TransferDocument = (await transferModel.findOne({
        userWallet: claimData.userWallet,
      })) as TransferDocument;

      if (!transfer)
        throw new CustomError(
          'Not Found',
          'You have to buy token for make claim',
          404
        );

      const stakingInvestment: StakingInvestmentDocument =
        (await stakingInvestmentModel.findOne({
          userWallet: claimData.userWallet,
          is_active: true,
          is_cancelled: false,
          is_unstaked: false,
        })) as StakingInvestmentDocument;

      if (!stakingInvestment)
        throw new CustomError('Not Found', 'You do not have any stake', 404);

      const stakingStake: StakingStageDocument =
        (await stakingStageModel.findById(
          stakingInvestment.staking_stage
        )) as StakingStageDocument;

      const stake_reward_percentage = stakingStake.reward_percentage;
      const stake_duration = stakingStake.duration;
      const _earned_award =
        (stakingInvestment.staked_token_amount *
          stake_duration *
          stake_reward_percentage) /
        100;
      const earned_award = _earned_award.toFixed(3);

      const sendedToken: SendedTokenDocument = (await sendedTokenModel.create({
        userWallet: transfer.userWallet,
        is_sended: 'preparing',
        total_token_amount: earned_award,
        description: 'Stake Reward',
      })) as SendedTokenDocument;

      let smartContract;

      if (stakingInvestment.currentNetwork === 'bsc') {
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
        stakingInvestment.currentNetwork,
        smartContract,
        privateKey,
        wallet
      );

      const hash = await tokenService.transferForClaim(
        transfer.userWallet,
        Number(sendedToken.total_token_amount)
      );

      stakingInvestment.is_unstaked = true;
      stakingInvestment.is_active = false;
      stakingInvestment.description = 'Reward Claimed';

      await stakingInvestment.save();

      await sendedTokenModel.findByIdAndUpdate(sendedToken._id, {
        is_sended: 'sended',
        payment_transaction_hash: hash,
      });

      return res.status(200).json({
        message: 'Claim successfully happened',
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

export default validateResource(handler, claimStakingInvestmentSchema);
