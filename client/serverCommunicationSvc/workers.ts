import { cpuUsageMeasured } from '../crons/events';
import eventSvc from '../eventSvc';
import serverCommunicationSvc from './';

export const onCpuUsageMeasured = eventSvc.subscribe(
  cpuUsageMeasured,
  async (data) => {
    const { timestamp, usage, userUUID } = data;
    await serverCommunicationSvc.send(usage);
  }
);
