import serverCommunicationSvc from './service';
import { eventSvc } from '../eventSvc';

export const cpuUsageEvent = eventSvc.subscribe(
  'cpuUsageEvent',
  async (cpuUsage) => {
    await serverCommunicationSvc.send(cpuUsage);
  }
);
