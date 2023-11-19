import * as cron from 'node-cron';
import eventSvc from '../eventSvc';
import { measureCPUUsage } from '../systemAnalytics';
import { cpuUsageMeasured } from './events';

export const startCronJob = cron.schedule('*/10 * * * * *', async () => {
  const usage = await measureCPUUsage();

  const timestamp = Date.now();

  // TODO: do not hard code userUUID
  const userUUID = 'user_0';

  eventSvc.publish(cpuUsageMeasured, {
    timestamp,
    usage: { usage, timestamp },
    userUUID
  });
});
