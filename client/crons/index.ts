import * as cron from 'node-cron';
import eventSvc from '../eventSvc';
import { measureCPUUsage } from '../systemAnalytics';

export const startCronJob = cron.schedule('*/10 * * * * *', async () => {
  const cpuUsage = await measureCPUUsage();

  eventSvc.publish('cpuUsageEvent', cpuUsage);
});
