import { z } from 'zod';
import { Event, EventSchema, CpuUsageSchema } from 'models';

export const cpuUsageMeasured = generateEvent({
  name: 'cpuUsageMeasured',
  schema: z.object({
    usage: CpuUsageSchema,
    timestamp: z.number(),
    userUUID: z.string()
  })
});

function generateEvent<S extends EventSchema>(event: Event<S>): Event<S> {
  return {
    name: event.name,
    schema: event.schema
  };
}
