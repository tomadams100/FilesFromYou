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

      console.log('response.data', response.data);

      setCpuData(response.data);
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
