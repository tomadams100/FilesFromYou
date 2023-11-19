import * as fs from 'fs';
import { User } from 'models';

function generateRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRandomTimestamp(start: number, end: number): number {
  return Math.floor(generateRandomNumber(start, end));
}

function generateRandomCpuUsageDataPoints(
  numPoints: number
): { usage: number; timestamp: number }[] {
  const cpuUsageData: { usage: number; timestamp: number }[] = [];

  for (let i = 0; i < numPoints; i++) {
    const usage = generateRandomNumber(1, 100);
    const timestamp = generateRandomTimestamp(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
      Date.now()
    );
    cpuUsageData.push({ usage, timestamp });
  }

  return cpuUsageData;
}

function generateTestUsers(
  numUsers: number,
  cpuDataPointsPerUser: number
): User[] {
  const users: User[] = [];

  for (let i = 0; i < numUsers; i++) {
    const userUUID = `user_${i}`;
    const cpuUsage = generateRandomCpuUsageDataPoints(cpuDataPointsPerUser);

    const user: User = {
      userUUID,
      cpuUsage
    };

    users.push(user);
  }

  return users;
}

const numUsersToGenerate = 10;
const cpuDataPointsPerUser = 25;

export function generateSeedData(): void {
  const seedData = generateTestUsers(numUsersToGenerate, cpuDataPointsPerUser);

  fs.writeFileSync('seedData.json', JSON.stringify(seedData, null, 2));

  console.log(`Seed data generated and saved to seedData.json.`);
}
