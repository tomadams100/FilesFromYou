import WebSocket from 'ws';
import { CpuUsage } from 'models';
import userSvc from '../userSvc';

export const handleWebSocketConnection = (webSocket: WebSocket) => {
  console.log('Server connected');
  webSocket.on('message', async (message) => {
    const cpuUsageData = JSON.parse(message.toString()) as CpuUsage & {
      userUUID: string;
    };

    const { timestamp, usage, userUUID } = cpuUsageData;

    const user = await userSvc.getUser(userUUID);

    if (!user) {
      return new Error('User not found in websocket message');
    }

    await userSvc.updateUser({
      cpuUsage: { timestamp, usage },
      userUUID
    });
  });
};
