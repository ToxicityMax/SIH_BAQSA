import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { UserEntity } from '../auth/auth.entity';

export interface Order extends Document {
  _id: string;
  name: string;
  product: string;
  threshold: object;
  imageUrl: string;
  deviceId: string;
  blockchainId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
export enum Products {
  wheat = 'wheat',
  rice = 'rice',
  mangoes = 'mangoes',
  sugarcane = 'sugarcane',
}
export const OrderEntity = new mongoose.Schema(
  {
    name: { type: String },
    product: { type: String, enum: Products },
    threshold: {
      temperature: { type: Array },
      humidity: { type: Array },
      accelerometer: { type: Array },
    },
    imageUrl: { type: String, default: '' },
    deviceId: { type: String, default: '' },
    blockchainId: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
