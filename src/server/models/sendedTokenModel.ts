import mongoose from 'mongoose';
import { ISendedToken } from '@/types/SendedToken';

export interface SendedTokenDocument extends mongoose.Document, ISendedToken {
  createdAt: Date;
  updatedAt: Date;
}

const sendedTokenSchema = new mongoose.Schema(
  {
    userWallet: { type: String, required: true },
    payment_transaction_hash: {
      type: String,
      required: false,
    },
    is_sended: {
      type: String,
      enum: ['preparing', 'sended', 'pending', 'error'],
      required: true,
    },
    total_token_amount: {
      type: Number,
    },
    total_bonus_token: {
      type: Number,
      required: false,
      default: 0,
    },
    is_staked: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const sendedTokenModel =
  mongoose.models.SendedToken ||
  mongoose.model<SendedTokenDocument>('SendedToken', sendedTokenSchema);

export default sendedTokenModel;
