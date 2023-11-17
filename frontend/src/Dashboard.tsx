import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const Dashboard = () => {
  const [cpuData, setCpuData] = useState<string>();

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/cpu-usage');

      const data = response.data as {
        [key: string]: string;
      };

      const latestCpuUsageData =
        data[
          Object.keys(data).sort((a, b) =>
            moment(`2021-01-01 ${a}`).isBefore(moment(`2021-01-01 ${b}`))
              ? 1
              : -1
          )[0]
        ];

      setCpuData(latestCpuUsageData);
    } catch (error) {
      console.error('Error fetching CPU usage data:', error);
    }
  };

  const timeNow = moment().format('h:mm:ss');

  return (
    <div>
      <h1>CPU Usage Dashboard</h1>
      {cpuData && (
        <p>
          {cpuData}% is the CPU usage at {timeNow}
        </p>
      )}
    </div>
  );
};

export default Dashboard;
