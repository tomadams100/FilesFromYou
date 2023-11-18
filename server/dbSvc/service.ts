import mongoose from 'mongoose';
import type { CpuUsage, User } from 'models';
import { UserModel } from './models';

export class DbSvc {
  private mongoDbUrl: string;
  private mongoose: typeof mongoose;
  private db: mongoose.Connection;

  constructor() {
    this.mongoDbUrl =
      process.env.MONGO_DB_URL ||
      `mongodb://localhost:27017/${process.env.MONGO_DB_NAME || 'test'}`;
    this.mongoose = mongoose;
    this.mongoose.connect(this.mongoDbUrl);
    this.db = mongoose.connection;
    this.db.once('open', async () => {
      console.log('Connected to database');
    });
  }

  public async createUser(userUUID: string): Promise<string> {
    const user = new UserModel({
      userUUID,
      cpuUsage: {}
    });

    const result = await user.save();
    return result.userUUID;
  }

  public async getUser(userUUID: string): Promise<User | null> {
    return await UserModel.findOne({ userUUID });
  }

  public async getAllUsers(): Promise<User[]> {
    return await UserModel.find({});
  }

  public async updateUser(args: {
    userUUID: string;
    cpuUsage: CpuUsage;
  }): Promise<User | null> {
    try {
      const { userUUID, cpuUsage } = args;
      const user = await UserModel.findOne({ userUUID });

      if (!user) return null;

      const result = await user.updateOne(
        { $push: { cpuUsage: cpuUsage } },
        { new: true }
      );

      if (!result) return null;

      return {
        userUUID: result.userUUID,
        cpuUsage: result.cpuUsage
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  public async getLatestCpuUsage(userUUID: string): Promise<CpuUsage | null> {
    const user = await this.getUser(userUUID);

    if (!user) return null;

    return user.cpuUsage.sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  public async getCpuUsageForRange(args: {
    userUUID: string;
    startTimestamp: number;
    endTimestamp: number;
  }): Promise<CpuUsage[] | null> {
    const { userUUID, startTimestamp, endTimestamp } = args;
    const user = await this.getUser(userUUID);

    if (!user) return null;

    return user.cpuUsage.filter(
      (data) =>
        data.timestamp >= startTimestamp && data.timestamp <= endTimestamp
    );
  }

  public async getCpuUsageForLastXMinutes(args: {
    userUUID: string;
    minutes: number;
  }): Promise<CpuUsage[] | null> {
    const { userUUID, minutes } = args;

    const now = Date.now();
    const startTimestamp = now - minutes * 60 * 1000;

    return await this.getCpuUsageForRange({
      userUUID,
      startTimestamp,
      endTimestamp: now
    });
  }

  public async getAverageCpuUsageForLastXMinutes(args: {
    userUUID: string;
    minutes: number;
  }): Promise<number | null> {
    const { userUUID, minutes } = args;

    const cpuUsageData = await this.getCpuUsageForLastXMinutes({
      userUUID,
      minutes
    });

    if (!cpuUsageData) return null;

    const cpuUsageTotal = cpuUsageData.reduce(
      (total, data) => total + data.usage,
      0
    );

    return cpuUsageTotal / cpuUsageData.length;
  }

  public async getAllUsersAverageCpuUsageForLastXMinutes(args: {
    minutes: number;
  }): Promise<number | null> {
    const { minutes } = args;

    const allUsers = await this.getAllUsers();

    if (!allUsers) return null;

    const _allUsersCpuUsageData = await Promise.all(
      allUsers
        .map(async (user) => {
          return await this.getAverageCpuUsageForLastXMinutes({
            userUUID: user.userUUID,
            minutes
          });
        })
        .filter((data) => data !== null)
    );

    const allUsersCpuUsageData = _allUsersCpuUsageData.filter(
      (data) => data !== null
    ) as number[];

    const allUsersCpuUsageTotal = allUsersCpuUsageData.reduce(
      (total, data) => total + data,
      0
    );

    return allUsersCpuUsageTotal / allUsersCpuUsageData.length;
  }

  public async getUsersWithAboveAvgCpuUsageForLastXMinutes(args: {
    minutes: number;
  }): Promise<Array<{ user: User; userAvg: number }> | null> {
    const { minutes } = args;

    const allUsers = await this.getAllUsers();

    if (!allUsers) return null;

    const allUserAvgCpuUsage =
      await this.getAllUsersAverageCpuUsageForLastXMinutes({ minutes });

    if (!allUserAvgCpuUsage) return null;

    const allUsersCpuUsageData = await Promise.all(
      allUsers.map(async (user) => {
        const userAvg = await this.getAverageCpuUsageForLastXMinutes({
          userUUID: user.userUUID,
          minutes
        });
        if (!userAvg) return null;
        return { user, userAvg };
      })
    );

    const _aboveAvgCpuUsageUsers = allUsersCpuUsageData.filter(
      (data) => data !== null && data.userAvg > allUserAvgCpuUsage
    );

    return _aboveAvgCpuUsageUsers.filter((data) => data !== null) as {
      user: User;
      userAvg: number;
    }[];
  }
}
