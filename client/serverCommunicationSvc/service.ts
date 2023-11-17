import ws from 'ws';

type CpuUsageData = {
  timestamp: number;
  usage: number;
  userUUID: string;
};

export class ServerCommunicationService {
  private webSocket: ws;
  private queue: CpuUsageData[] = [];

  constructor() {
    this.webSocket = new ws(
      process.env.WEB_SOCKET_URL || 'ws://localhost:8080'
    );
    this.webSocket.on('open', () => {
      console.log('WebSocket open');
      this.processQueue();
    });
    this.webSocket.on('close', () => {
      console.log('WebSocket close');
    });
  }

  private async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const cpuUsageData = this.queue.shift();
      if (cpuUsageData) {
        const result = await this.send(cpuUsageData);
        if (result === 'failure') {
          this.queue.push(cpuUsageData);
          break;
        }
      }
    }
  }

  public async send(args: CpuUsageData): Promise<'success' | 'failure'> {
    return new Promise((resolve) => {
      try {
        this.webSocket.send(JSON.stringify(args), (error) => {
          if (error) {
            console.error('Error sending CPU usage data:', error);
            this.queue.push(args);
            resolve('failure');
          } else {
            resolve('success');
          }
        });
      } catch (error) {
        console.error('Error sending CPU usage data:', error);
        this.queue.push(args);
        return resolve('failure');
      }
    });
  }
}
