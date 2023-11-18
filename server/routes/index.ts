import express from 'express';
import dbSvc from '../dbSvc';

const router = express.Router();

router.get('/cpu-usage', async (req, res) => {
  try {
    // TODO: do not hard code userUUID
    const user = await dbSvc.getUser('123abc');

    if (!user) {
      return new Error('User not found');
    }

    const latestCpuUsageData = await dbSvc.getLatestCpuUsage(user.userUUID);

    res.status(200).send(latestCpuUsageData);
  } catch (error) {
    console.error('Error fetching CPU usage data:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const routes = router;
