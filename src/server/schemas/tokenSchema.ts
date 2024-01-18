import { object, string } from 'zod';

export const transferTokenSchema = object({
  body: object({
    userWallet: string({ required_error: 'User Wallet is required' }),
    transferId: string({ required_error: 'Transfer Id is required' }),
  }),
});
