import * as cron from 'node-cron';
import { measureCPUUsage } from '../systemAnalytics';
import { eventSvc } from '../eventSvc';

export const startCronJob = cron.schedule('*/10 * * * * *', async () => {
  const cpuUsage = await measureCPUUsage();

  eventSvc.publish('cpuUsageEvent', cpuUsage);
});
