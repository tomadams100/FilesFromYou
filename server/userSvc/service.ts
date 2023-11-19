import type { CpuUsage, User } from 'models';
import dbSvc, { UserModel } from '../dbSvc';

export class UserSvc {
  public async createUser(userUUID: string): Promise<User | null> {
    try {
      return await dbSvc.create({
        model: UserModel,
        data: {
          userUUID,
          cpuUsage: []
        }
      });
    } catch (error) {
      console.log('Error creating user: ', userUUID);
      return null;
    }
  }

  public async getUser(userUUID: string): Promise<User | null> {
    try {
      return await dbSvc.get({
        model: UserModel,
        userUUID
      });
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  public async getAllUsers(): Promise<User[]> {
    try {
      return await dbSvc.list({ model: UserModel });
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  public async updateUser(args: {
    userUUID: string;
    cpuUsage: CpuUsage;
  }): Promise<User | null> {
    try {
      const { cpuUsage, userUUID } = args;
      const user = await dbSvc.get({
        userUUID,
        model: UserModel
      });

      if (!user) return null;

      const result = await dbSvc.update({
        model: UserModel,
        id: user._id,
        data: {
          cpuUsage: [...user.cpuUsage, cpuUsage]
        }
      });

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
