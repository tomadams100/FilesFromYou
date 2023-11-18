import {z} from 'zod'
import { Document, Schema } from 'mongoose';
import { User } from './types';

export const CpuUsageSchema = z.object({
  usage: z.number()
});

export const UserSchema = new Schema<User & Document>({
  userUUID: { type: String, required: true },
  cpuUsage: { type: Object, required: true }
});