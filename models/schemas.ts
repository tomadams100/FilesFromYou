import {z} from 'zod'

export const CpuUsageSchema = z.object({
  usage: z.number()
});