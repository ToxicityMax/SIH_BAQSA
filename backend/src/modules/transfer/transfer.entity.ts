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
  };
  isApproved: boolean;
  location: {
    latitude: string;
    longitude: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const TransferEntity = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    prevOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imageUrl: { type: String },
    review: {
      rating: { type: Number, min: 0, max: 5 },
      message: { type: String },
    },
    isApproved: { type: Boolean, default: false },
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
