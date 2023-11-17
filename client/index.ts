import os from 'os';
import axios from 'axios';

function measureCPUUsage() {
  const cpuUsage = os.cpus()[0].times;

  const relevantData = {
    user: cpuUsage.user,
    nice: cpuUsage.nice,
    sys: cpuUsage.sys,
    idle: cpuUsage.idle
  };

  sendToServer(relevantData);
}

async function sendToServer(cpuUsageData: any) {
  // Implement logic to send data to the server (HTTP request, WebSocket, etc.)
  // Ensure data is sent securely and reliably
  try {
    await axios.post('http://localhost:8080/cpu-usage', { cpuUsageData });
    console.log('Data sent successfully');
  } catch (error) {
    console.error('Error sending CPU usage data:', error);
  }
}

setInterval(measureCPUUsage, 5000);
