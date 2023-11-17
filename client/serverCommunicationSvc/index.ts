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

  async send(cpuUsageData: number): Promise<'success' | 'failure'> {
    return new Promise((resolve) => {
      try {
        this.webSocket.send(cpuUsageData, (error) => {
          if (error) {
            resolve('failure');
          } else {
            resolve('success');
          }
        });
      } catch (error) {
        console.error('Error sending CPU usage data:', error);
        return resolve('failure');
      }
    });
  }
}

export default new ServerCommunicationService();
