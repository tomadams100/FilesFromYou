import express from 'express';
import dbSvc from '../dbSvc';
import * as utils from '../utils';

const router = express.Router();

router.get('/cpu-usage', async (req, res) => {
  try {
    // TODO: do not hard code userUUID
    const user = await dbSvc.getUser('123abc');

    if (!user) {
      return new Error('User not found');
    }

    const latestCpuUsageData = utils.getLatestCpuUsage(user);

    res.status(200).send(latestCpuUsageData);
  } catch (error) {
    console.error('Error fetching CPU usage data:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/last-hour-avg', async (req, res) => {
  try {
    // TODO: do not hard code userUUID
    const user = await dbSvc.getUser('123abc');

    if (!user) {
      return new Error('User not found');
    }
    const _lastHourAvg = utils.getAverageCpuUsageForLastXMinutes({
      minutes: 60,
      user
    });

    if (!_lastHourAvg) {
      return new Error('User not found');
    }

    const lastHourAvg = Math.floor(_lastHourAvg);

    res.status(200).json(lastHourAvg);
  } catch (error) {
    console.error('Error fetching CPU usage data:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const routes = router;
