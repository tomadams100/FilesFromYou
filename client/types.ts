import { z } from 'zod';

export type Schema = z.ZodObject<{ [key: string]: z.ZodTypeAny }>;

export type Event<S extends Schema> = {
  name: string;
  schema: S;
};
