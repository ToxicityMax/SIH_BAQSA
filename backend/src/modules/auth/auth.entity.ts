import { compare, hash } from 'bcrypt';
import config from './../../config';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface User extends Document {
  fullName: string;
  username: string;
  email: string;
  walletAddress: string;
  password: string;
  role: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
export enum UserRole {
  FARMER = 'FARMER',
  RETAILER = 'RETAILER',
}
export const UserEntity = new mongoose.Schema(
  {
    fullName: { type: String },
    walletAddress: { type: String },
    email: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: UserRole },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

UserEntity.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this['password'] = await createHash(this['password']);
  return next();
});

// Duplicate the ID field.
UserEntity.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserEntity.set('toJSON', {
  virtuals: true,
});
function addSalt(password: string) {
  return `${password}${config.SECRET}`;
}

async function createHash(password: string) {
  password = addSalt(password);
  const saltRounds = 10;
  return await hash(password, saltRounds);
}

export async function checkPasswd(hash: string, password: string) {
  password = addSalt(password);
  return await compare(password, hash);
}
