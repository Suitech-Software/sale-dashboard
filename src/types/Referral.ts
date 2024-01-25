export interface IReferral {
  userWallet: string;
  hash: string;
  currentNetwork: string;
  amountOfReceive: number[];
  isTransferred: boolean[];
}

export type CreateType = Omit<
  Omit<Omit<IReferral, 'isTransferred'>, 'amountOfReceive'>,
  'hash'
>;

export type ReferralGetType = {
  userWallet: string;
};

export type ReferralReturnType = IReferral & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
