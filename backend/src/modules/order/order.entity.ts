import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { UserEntity } from '../auth/auth.entity';
import { Products } from './order.constant';

export interface Order extends Document {
  _id: string;
  name: string;
  product: string;
  threshold: object;
  imageUrl: string;
  deviceId: string;
  blockchainId: string;
  transactionApproved: boolean;
  createdBy: string;
  currentOwner: string;
  createdAt: string;
  updatedAt: string;
}

export const OrderEntity = new mongoose.Schema(
  {
    name: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    currentOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: String, enum: Products },
    threshold: {
      temperature: { type: Array },
      humidity: { type: Array },
      npk: { type: Array },
      alcohol: { type: Array },
    },
    imageUrl: { type: String, default: '' },
    deviceId: { type: String, default: '' },
    transactionApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Duplicate the ID field.
UserEntity.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserEntity.set('toJSON', {
  virtuals: true,
});
