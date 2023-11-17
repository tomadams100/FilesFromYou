import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import { createServer } from 'http';
import WebSocket from 'ws';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.use(bodyParser.json());

let latestCpuUsageData: any;

const server = createServer(app);
const webSocketServer = new WebSocket.Server({ noServer: true });

webSocketServer.on('connection', (webSocket) => {
  console.log('Server connected');
  webSocket.on('message', (message) => {
    latestCpuUsageData = message;
  });
});

server.on('upgrade', (request, socket, head) => {
  webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
    webSocketServer.emit('connection', webSocket, request);
  });
});

app.get('/cpu-usage', async (req, res) => {
  try {
    // TODO - Fetch data from DB

    res.status(200).send(latestCpuUsageData);
  } catch (error) {
    console.error('Error fetching CPU usage data:', error);
    res.status(500).send('Internal Server Error');
  }
});

server.listen(port, () => {
  console.log(`WebSockets Server listening at http://localhost:${port}`);
});