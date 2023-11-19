import { CpuUsage, User } from 'models';

export function getLatestCpuUsage(user: User): CpuUsage | null {
  return user.cpuUsage.sort((a, b) => b.timestamp - a.timestamp)[0];
}

export function getCpuUsageForRange(args: {
  user: User;
  startTimestamp: number;
  endTimestamp: number;
}): CpuUsage[] {
  const { user, startTimestamp, endTimestamp } = args;

  return user.cpuUsage.filter(
    (data) => data.timestamp >= startTimestamp && data.timestamp <= endTimestamp
  );
}

export function getCpuUsageForLastXMinutes(args: {
  user: User;
  minutes: number;
}): CpuUsage[] {
  const { user, minutes } = args;

  const now = Date.now();
  const startTimestamp = now - minutes * 60 * 1000;

  return getCpuUsageForRange({
    user,
    startTimestamp,
    endTimestamp: now
  });
}

export function getAverageCpuUsageForLastXMinutes(args: {
  user: User;
  minutes: number;
}): number {
  const { user, minutes } = args;

  const cpuUsageData = getCpuUsageForLastXMinutes({
    user,
    minutes
  });

  const cpuUsageTotal = cpuUsageData.reduce(
    (total, data) => total + data.usage,
    0
  );

  return cpuUsageData.length > 0 ? cpuUsageTotal / cpuUsageData.length : 0;
}

export function getAllUsersAverageCpuUsageForLastXMinutes(args: {
  allUsers: User[];
  minutes: number;
}): number {
  const { minutes, allUsers } = args;

  const _allUsersCpuUsageData = allUsers
    .map((user) => getAverageCpuUsageForLastXMinutes({ user, minutes }))
    .filter((data) => data !== null);

  console.log('_allUsersCpuUsageData', _allUsersCpuUsageData);

  const allUsersCpuUsageData = _allUsersCpuUsageData.filter(
    (data) => data !== null
  ) as number[];

  const allUsersCpuUsageTotal = allUsersCpuUsageData.reduce(
    (total, data) => total + data,
    0
  );

  return allUsersCpuUsageTotal / allUsersCpuUsageData.length;
}

export function getUsersWithAboveAvgCpuUsageForLastXMinutes(args: {
  allUsers: User[];
  minutes: number;
}): Array<{ user: User; userAvg: number }> {
  const { allUsers, minutes } = args;

  const allUserAvgCpuUsage = getAllUsersAverageCpuUsageForLastXMinutes({
    minutes,
    allUsers
  });

  const allUsersCpuUsageData = allUsers.map((user) => {
    const userAvg = getAverageCpuUsageForLastXMinutes({ minutes, user });
    return { user, userAvg };
  });

  const _aboveAvgCpuUsageUsers = allUsersCpuUsageData.filter(
    (data) => data !== null && data.userAvg > allUserAvgCpuUsage
  );

  return _aboveAvgCpuUsageUsers.filter((data) => data !== null) as {
    user: User;
    userAvg: number;
  }[];
}

export function getUserPercentileForLastXMinutes(args: {
  user: User;
  allUsers: User[];
  minutes: number;
}): number {
  const { user, allUsers, minutes } = args;

  const sortedUsers = allUsers.slice().sort((a, b) => {
    const avgA = getAverageCpuUsageForLastXMinutes({ user: a, minutes });
    const avgB = getAverageCpuUsageForLastXMinutes({ user: b, minutes });
    return (avgB || 0) - (avgA || 0);
  });

  const userIndex =
    sortedUsers.findIndex((u) => u.userUUID === user.userUUID) + 1;

  return (userIndex / sortedUsers.length) * 100;
}

