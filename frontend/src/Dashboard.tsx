import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CpuUsage } from 'models';

const Dashboard = () => {
  const [cpuUsage, setCpuUsage] = useState<CpuUsage>();
  const [lastHourAvg, setLastHourAvg] = useState<number | null>(null);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/cpu-usage');

      const data = response.data as CpuUsage;

      setCpuUsage(data);

      const _lastHourAvg = await axios.get(
        'http://localhost:8080/last-hour-avg'
      );

      const lastHourAvg = _lastHourAvg.data as number | null;

      setLastHourAvg(lastHourAvg);
    } catch (error) {
      console.error('Error fetching CPU usage data:', error);
    }
  };

  return (
    <div>
      <h1>CPU Usage Dashboard</h1>
      {cpuUsage && (
        <p>
          {cpuUsage.usage}% was the CPU usage at{' '}
          {moment(cpuUsage.timestamp).format('HH:mm:ss')}
        </p>
      )}

      {lastHourAvg && (
        <p>{lastHourAvg}% was the average CPU usage in the last hour</p>
      )}
    </div>
  );
};

export default Dashboard;
