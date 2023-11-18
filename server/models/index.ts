import mongoose from 'mongoose';
import { UserSchema } from './schemas';
export const UserModel = mongoose.model('User', UserSchema);
