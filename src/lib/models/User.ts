import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Role } from '@/context/AuthContext';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;
  expertise?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['intern', 'mentor', 'hr', 'employee'] },
  avatar: { type: String },
  expertise: { type: String },
},
{
    timestamps: true,
});

// The key fix: Ensure the model is always registered as 'User' to match the 'ref' in other schemas.
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
