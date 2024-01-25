import { object, string } from 'zod';

export const createSendedTokenSchema = object({
  body: object({
    userWallet: string({ required_error: 'User Wallet is required' }),
    stakingInvestmentID: string({
      required_error: 'Staking Investment ID is required',
    }),
  }),
});
