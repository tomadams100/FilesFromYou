import { z } from 'zod';
import { Event, Schema } from '../types';

export const cpuUsageMeasured = generateEvent({
  name: 'cpuUsageMeasured',
  schema: z.object({
    usage: z.number(),
    timestamp: z.number(),
    userUUID: z.string()
  })
});

function generateEvent<S extends Schema>(event: Event<S>): Event<S> {
  return {
    name: event.name,
    schema: event.schema
  };
}
