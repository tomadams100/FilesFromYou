import WebSocket from 'ws';
import dbSvc from '../dbSvc';

export const handleWebSocketConnection = (webSocket: WebSocket) => {
  console.log('Server connected');
  webSocket.on('message', async (message) => {
    const cpuUsageData = JSON.parse(message.toString()) as {
      timestamp: number;
      usage: number;
      userUUID: string;
    };

    await dbSvc.updateUser(cpuUsageData.userUUID, {
      [cpuUsageData.timestamp]: cpuUsageData.usage.toString()
    });
  });
};
