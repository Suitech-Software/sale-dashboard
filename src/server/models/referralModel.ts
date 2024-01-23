import mongoose from 'mongoose';
import { IReferral } from '@/types/Referral';

export interface ReferralDocument extends mongoose.Document, IReferral {
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new mongoose.Schema(
  {
    userWallet: { type: String, required: true, unique: true },
    hash: { type: String, required: true, unique: true },
    currentNetwork: { type: String, required: true },
    amountOfReceive: [{ type: Number }],
    isTransferred: [{ type: Boolean }],
  },
  {
    timestamps: true,
  }
);

const referralModel =
  mongoose.models.Referral ||
  mongoose.model<ReferralDocument>('Referral', referralSchema);

export default referralModel;
