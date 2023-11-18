import { Document, Schema } from 'mongoose';

export type User = {
  userUUID: string;
  cpuUsage: {
    [key: string]: string;
  };
};

export const UserSchema = new Schema<User & Document>({
  userUUID: { type: String, required: true },
  cpuUsage: { type: Object, required: true }
});
