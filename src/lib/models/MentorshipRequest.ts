
'use server';

import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IMentorshipRequest extends Document {
  internId: mongoose.Schema.Types.ObjectId;
  mentorId: mongoose.Schema.Types.ObjectId;
  status: 'Pending' | 'Accepted' | 'Rejected';
  sessionId?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipRequestSchema: Schema<IMentorshipRequest> = new Schema({
  internId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  status: { type: String, required: true, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipSession' }
}, { timestamps: true });

const MentorshipRequest: Model<IMentorshipRequest> = models.MentorshipRequest || mongoose.model<IMentorshipRequest>('MentorshipRequest', MentorshipRequestSchema);

export default MentorshipRequest;
