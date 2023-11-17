import express from 'express';
import { DbSvc } from '../dbSvc';

const router = express.Router();
const dbSvc = new DbSvc('data.json');

router.get('/cpu-usage', async (req, res) => {
  try {
    const latestCpuUsageData = dbSvc.readData();

    res.status(200).send(latestCpuUsageData);
  } catch (error) {
    console.error('Error fetching CPU usage data:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const routes = router;
