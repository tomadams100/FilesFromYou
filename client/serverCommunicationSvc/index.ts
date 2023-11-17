import ws from 'ws';

class ServerCommunicationService {
  private webSocket: ws;

  constructor() {
    this.webSocket = new ws(
      process.env.WEB_SOCKET_URL || 'ws://localhost:8080'
    );
    this.webSocket.on('open', () => {
      console.log('WebSocket open');
    });
    this.webSocket.on('close', () => {
      console.log('WebSocket close');
    });
  }

  send(cpuUsageData: number): 'success' | 'failure' {
    try {
      this.webSocket.send(cpuUsageData);
      return 'success';
    } catch (error) {
      console.error('Error sending CPU usage data:', error);
      return 'failure';
    }
  }
}

export default new ServerCommunicationService();
