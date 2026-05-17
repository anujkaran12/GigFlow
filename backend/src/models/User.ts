import { Schema, model, type HydratedDocument } from 'mongoose'
import type { IUser } from '../types'

export type UserDocument = HydratedDocument<IUser>

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'sales',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
)

export const User = model<IUser>('User', userSchema)
