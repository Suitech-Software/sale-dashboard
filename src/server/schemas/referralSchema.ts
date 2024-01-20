import { array, object, string } from 'zod';

export const createReferralSchema = object({
  body: object({
    userWallet: string({ required_error: 'User Wallet is required' }),
    currentNetwork: string({
      required_error: 'Current Network is required',
    }),
  }),
});

export const getReferralSchema = object({
  body: object({
    userWallet: string({ required_error: 'User Wallet is required' }),
  }),
});
