
'use server';

import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IMentorshipRequest extends Document {
  intern: mongoose.Schema.Types.ObjectId;
  mentor: mongoose.Schema.Types.ObjectId;
  status: 'Pending' | 'Accepted' | 'Rejected';
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipRequestSchema: Schema<IMentorshipRequest> = new Schema({
  intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  status: { type: String, required: true, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  reason: { type: String },
}, { timestamps: true });

const MentorshipRequest: Model<IMentorshipRequest> = models.MentorshipRequest || mongoose.model<IMentorshipRequest>('MentorshipRequest', MentorshipRequestSchema);

export default MentorshipRequest;
