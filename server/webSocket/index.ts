import WebSocket from 'ws';
import dbSvc from '../dbSvc';
import { CpuUsage } from 'models';

export const handleWebSocketConnection = (webSocket: WebSocket) => {
  console.log('Server connected');
  webSocket.on('message', async (message) => {
    const cpuUsageData = JSON.parse(message.toString()) as CpuUsage & {
      userUUID: string;
    };

    const { timestamp, usage, userUUID } = cpuUsageData;

    await dbSvc.updateUser({ userUUID, cpuUsage: { usage, timestamp } });
  });
};
