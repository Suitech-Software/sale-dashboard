import { object, string } from "zod";

export const getUserSchema = object({
    query: object({
      userWallet: string({ required_error: 'User Wallet is required' }),
    }),
  });
  