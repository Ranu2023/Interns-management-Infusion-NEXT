
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IMentorshipRequest extends Document {
  intern: mongoose.Schema.Types.ObjectId;
  mentor: mongoose.Schema.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  sessionId?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const MentorshipRequestSchema: Schema<IMentorshipRequest> = new Schema({
  intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipSession' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });


const MentorshipRequest: Model<IMentorshipRequest> = models.MentorshipRequest || mongoose.model<IMentorshipRequest>('MentorshipRequest', MentorshipRequestSchema);

export default MentorshipRequest;
