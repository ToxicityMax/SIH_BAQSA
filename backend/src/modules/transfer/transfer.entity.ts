import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { UserEntity } from '../auth/auth.entity';

export interface Transfer extends Document {
  _id: string;
  order: string;
  prevOwner: string;
  owner: string;
  imageUrl: string;
  review: {
    rating: number;
    message: string;
    imageUrl: string;
  };
  status: string;
  approvedAt: Date;
  location: {
    latitude: string;
    longitude: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum TransferStatus {
  INITIATED = 'INITIATED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

export const TransferEntity = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    prevOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    review: {
      rating: { type: Number, min: 0, max: 5 },
      message: { type: String },
      imageUrl: { type: String },
    },
    status: {
      type: String,
      enum: TransferStatus,
      default: TransferStatus.INITIATED,
    },
    approvedAt: { type: Date },
    location: {
      latitude: { type: String },
      longitude: { type: String },
    },
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
