import os from 'os';
import { promisify } from 'util';

const setTimeoutPromise = promisify(setTimeout);

export async function measureCPUUsage(): Promise<number> {
  const cpuStartTimes = os.cpus()[0].times;
  let cpuUsagePercentage: number = 0;

  await setTimeoutPromise(1000);

  const cpuEndTimes = os.cpus()[0].times;

  const cpuUsage = {
    user: cpuEndTimes.user - cpuStartTimes.user,
    nice: cpuEndTimes.nice - cpuStartTimes.nice,
    sys: cpuEndTimes.sys - cpuStartTimes.sys,
    idle: cpuEndTimes.idle - cpuStartTimes.idle
  };

  const totalCpuTime =
    cpuUsage.user + cpuUsage.nice + cpuUsage.sys + cpuUsage.idle;

  cpuUsagePercentage = ((totalCpuTime - cpuUsage.idle) / totalCpuTime) * 100;

  return cpuUsagePercentage;
}
