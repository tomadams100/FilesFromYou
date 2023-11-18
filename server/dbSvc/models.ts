import mongoose from 'mongoose';
import { UserSchema } from 'models';
export const UserModel = mongoose.model('User', UserSchema);
