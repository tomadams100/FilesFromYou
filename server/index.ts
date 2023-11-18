import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from 'http';
import WebSocket from 'ws';
import { handleWebSocketConnection } from './webSocket';
import { routes } from './routes';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(routes);

const server = createServer(app);
const webSocketServer = new WebSocket.Server({ noServer: true });

webSocketServer.on('connection', handleWebSocketConnection);

server.on('upgrade', (request, socket, head) => {
  webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
    webSocketServer.emit('connection', webSocket, request);
  });
});

server.listen(port, () => {
  console.log(`WebSockets Server listening at http://localhost:${port}`);
});
