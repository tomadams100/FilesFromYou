import WebSocket from 'ws';
import { DbSvc } from '../dbSvc';
import moment from 'moment';

export const handleWebSocketConnection = (webSocket: WebSocket) => {
  console.log('Server connected');
  webSocket.on('message', async (message) => {
    const dbSvc = new DbSvc('data.json');

    const key = moment().format('h:mm:ss');
    const value = message.toString();
    dbSvc.writeData(key, value);
  });
};
