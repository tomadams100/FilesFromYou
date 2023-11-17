import * as cron from 'node-cron';
import eventSvc from '../eventSvc';
import { measureCPUUsage } from '../systemAnalytics';
import { cpuUsageMeasured } from './events';

export const startCronJob = cron.schedule('*/10 * * * * *', async () => {
  const usage = await measureCPUUsage();

  const timestamp = Date.now();

  const userUUID = '1234';

  eventSvc.publish(cpuUsageMeasured, { timestamp, usage, userUUID });
});
