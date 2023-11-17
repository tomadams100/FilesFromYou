import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.use(bodyParser.json());

let latestCpuUsageData: any;

app.post('/cpu-usage', async (req, res) => {
  const { cpuUsageData } = req.body;

  try {
    latestCpuUsageData = cpuUsageData;

    // TODO - Store data in DB
    console.log('Data received:', cpuUsageData);

    res.status(200).send('Data received successfully');
  } catch (error) {
    console.error('Error storing CPU usage data:', error);
    res.status(500).send('Internal Server Error');
  }
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
