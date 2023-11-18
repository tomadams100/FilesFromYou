import EventEmitter from 'events';
import { Event, Schema } from 'models';
import { z } from 'zod';
export class EventService {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public publish<S extends Schema>(event: Event<S>, data: z.infer<S>) {
    this.eventEmitter.emit(event.name, data);
  }

  public subscribe<S extends Schema>(
    event: Event<S>,
    callback: (data: z.infer<S>) => void
  ) {
    this.eventEmitter.on(event.name, callback);
  }
}
