import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const Dashboard = () => {
  const [cpuData, setCpuData] = useState<any>();

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/cpu-usage');

      setCpuData(response.data);
    } catch (error) {
      console.error('Error fetching CPU usage data:', error);
    }
  };

  const timeNow = moment().format('h:mm:ss');

  return (
    <div>
      <h1>CPU Usage Dashboard</h1>
      {cpuData?.user && (
        <p>
          {cpuData.user} is the CPU usage at {timeNow}
        </p>
      )}
    </div>
  );
};

export default Dashboard;
