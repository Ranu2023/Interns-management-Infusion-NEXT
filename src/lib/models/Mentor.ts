
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IMentor extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  expertise: string;
  interns: number;
  avatar: string;
}

const MentorSchema: Schema<IMentor> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  expertise: { type: String, required: true },
  interns: { type: Number, required: true, default: 0 },
  avatar: { type: String, required: true },
});

const Mentor: Model<IMentor> = models.Mentor || mongoose.model<IMentor>('Mentor', MentorSchema);

export default Mentor;
