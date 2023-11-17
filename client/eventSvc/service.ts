import EventEmitter from 'events';

export class EventService {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public publish(name: string, data: any) {
    this.eventEmitter.emit(name, data);
  }

  public subscribe(name: string, callback: (data: any) => void) {
    this.eventEmitter.on(name, callback);
  }
}
