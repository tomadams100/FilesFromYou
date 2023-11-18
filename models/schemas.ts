import {z} from 'zod'
import { Document, Schema } from 'mongoose';
import { User } from './types';

export const CpuUsageSchema = z.object({
  usage: z.number(),
  timestamp: z.number()
});

export const UserSchema = new Schema<User & Document>({
  userUUID: { type: String, required: true },
  cpuUsage: [
    {
      usage: { type: Number, required: true },
      timestamp: { type: Number, required: true }
    }
  ]
});