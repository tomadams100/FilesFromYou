import {z} from 'zod';
import { CpuUsageSchema } from './schemas';

export type Schema = z.ZodObject<{ [key: string]: z.ZodTypeAny }>;

export type Event<S extends Schema> = {
  name: string;
  schema: S;
};

export type CpuUsage = z.infer<typeof CpuUsageSchema>;