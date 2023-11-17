import eventSvc from '../eventSvc';
import serverCommunicationSvc from './';

export const cpuUsageEvent = eventSvc.subscribe(
  'cpuUsageEvent',
  async (cpuUsage) => {
    await serverCommunicationSvc.send(cpuUsage);
  }
);
