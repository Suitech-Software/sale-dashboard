import { object, string } from 'zod';

export const createTransferSchema = object({
  body: object({
    userWallet: string({ required_error: 'User Wallet is required' }),
    currentToken: string({ required_error: 'Current Token is required' }),
    currentNetwork: string({ required_error: 'Current Network is required' }),
    amountOfPay: string({ required_error: 'amount of Pay is required' }),
    amountOfReceive: string({
      required_error: 'Amount of Receive is required',
    }),
    tokenPrice: string({ required_error: 'Token Price is required' }),
    stage: string({ required_error: 'Stage is required' }),
  }),
});
