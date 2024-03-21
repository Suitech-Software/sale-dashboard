import mongoose from 'mongoose';
import { IUser } from '@/types/User';

export interface UserDocument extends mongoose.Document, IUser {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    userWallet: { type: String, required: true },
    balance: { type: Number, default: 0 },
    awardedBalance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const userModel =
  mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default userModel;
