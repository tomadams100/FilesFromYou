import mongoose from 'mongoose';
import { UserModel } from '../models';
import type { User } from 'models';

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

  public async updateUser(
    userUUID: string,
    cpuUsage: {
      [key: string]: string;
    }
  ): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ userUUID });

      if (!user) return null;

      const result = await user.updateOne(
        { $set: { cpuUsage: { ...user.cpuUsage, ...cpuUsage } } },
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
}
