import mongoose, { Schema, Document } from 'mongoose';

export interface IMentor extends Document {
  name: string;
  email: string;
  expertise: string;
  experience?: string;
  interns: number;
  avatar: string;
}

const MentorSchema: Schema<IMentor> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    expertise: { type: String, required: true },
    experience: { type: String, default: '2+ years' },
    interns: { type: Number, required: true, default: 0 },
    avatar: { type: String, required: true },
  },
  {
    timestamps: true, // ✅ Optional: track createdAt & updatedAt
  }
);

// ✅ Prevent model overwrite errors in Next.js dev mode
export default mongoose.models.Mentor || mongoose.model<IMentor>('Mentor', MentorSchema);

    