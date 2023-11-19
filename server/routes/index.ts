import express from 'express';
import * as utils from '../utils';
import userSvc from '../userSvc';

const router = express.Router();

router.get('/cpu-usage', async (req, res) => {
  try {
    // TODO: do not hard code id
    const userUUID = 'user_0';
    const user = await userSvc.getUser(userUUID);

    if (!user) {
      return new Error('User not found in cpu-usage route');
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
    const userUUID = 'user_0';
    const user = await userSvc.getUser(userUUID);

    if (!user) {
      return new Error('User not found in last-hour-avg route');
    }
    const _lastHourAvg = utils.getAverageCpuUsageForLastXMinutes({
      minutes: 60,
      user
    });

    const lastHourAvg = Math.floor(_lastHourAvg);

    res.status(200).json(lastHourAvg);
  } catch (error) {
    console.error('Error fetching CPU usage data:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/above-avg-usage-users', async (req, res) => {
  try {
    const allUsers = await userSvc.getAllUsers();

    const aboveAvgUsageUsers =
      utils.getUsersWithAboveAvgCpuUsageForLastXMinutes({
        allUsers,
        minutes: 60
      });

    res.status(200).json(aboveAvgUsageUsers);
  } catch (error) {
    console.error('Error fetching CPU usage data:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/user-percentile', async (req, res) => {
  try {
    const allUsers = await userSvc.getAllUsers();

    const user = allUsers.find((user) => user.userUUID === 'user_0');

    if (!user) {
      return new Error('User not found in user-percentile route');
    }

    const percentile = utils.getUserPercentileForLastXMinutes({
      allUsers,
      minutes: 60,
      user
    });

    res.status(200).json(percentile);
  } catch (error) {
    console.error('Error fetching CPU usage data:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const routes = router;
