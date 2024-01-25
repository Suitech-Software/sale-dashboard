export interface ISendedToken {
  userWallet: string;
  payment_transaction_hash: string;
  is_sended: string;
  total_token_amount: number;
  total_bonus_token: number;
  is_staked: boolean;
  description: string;
}

export type CreateType = ISendedToken;

export type SendedTokenReturnType = ISendedToken & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
