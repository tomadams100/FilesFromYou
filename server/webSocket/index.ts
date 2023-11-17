import WebSocket from 'ws';
import { DbSvc } from '../dbSvc';
const dbSvc = new DbSvc('data.json');

export const handleWebSocketConnection = (webSocket: WebSocket) => {
  console.log('Server connected');
  webSocket.on('message', async (message) => {
    const cpuUsageData = JSON.parse(message.toString()) as {
      timestamp: number;
      usage: number;
      userUUID: string;
    };

    dbSvc.writeData(cpuUsageData.userUUID, {
      timestamp: cpuUsageData.timestamp.toString(),
      usage: cpuUsageData.usage.toString()
    });
  });
};
