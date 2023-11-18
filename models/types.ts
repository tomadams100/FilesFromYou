import {z} from 'zod';
import { CpuUsageSchema } from './schemas';

export type EventSchema = z.ZodObject<{ [key: string]: z.ZodTypeAny }>;

export type Event<S extends EventSchema> = {
  name: string;
  schema: S;
};

export type CpuUsage = z.infer<typeof CpuUsageSchema>;

export type User = {
  userUUID: string;
  cpuUsage: CpuUsage[];
};