import * as cron from 'node-cron';
import { measureCPUUsage } from '../systemAnalytics';
import serverCommunicationSvc from '../serverCommunicationSvc';

export function startCronJob() {
  cron.schedule('*/10 * * * * *', async () => {
    const cpuUsage = await measureCPUUsage();

    const result = await serverCommunicationSvc.send(cpuUsage);

    if (result === 'failure') {
      console.error('Error sending CPU usage data');
    }
  });
}
