export interface IUser {
  userWallet: string;
  balance: number;
  awardedBalance: number;
}

export type CreateType = { userWallet: string };

export type UserReturnType = IUser & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
