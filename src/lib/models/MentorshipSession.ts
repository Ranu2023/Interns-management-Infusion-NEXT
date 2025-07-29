
'use server';

import mongoose, { Schema, Document, models, Model } from 'mongoose';

interface IChatMessage {
    senderId: mongoose.Schema.Types.ObjectId;
    message: string;
    timestamp: Date;
}

export interface IMentorshipSession extends Document {
  internId: mongoose.Schema.Types.ObjectId;
  mentorId: mongoose.Schema.Types.ObjectId;
  chat: IChatMessage[];
  meetLink?: string;
  roadmapLinks?: string[];
  resources?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema: Schema<IChatMessage> = new Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const MentorshipSessionSchema: Schema<IMentorshipSession> = new Schema({
  internId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  chat: [ChatMessageSchema],
  meetLink: { type: String },
  roadmapLinks: [{ type: String }],
  resources: [{ type: String }],
}, { timestamps: true });

const MentorshipSession: Model<IMentorshipSession> = models.MentorshipSession || mongoose.model<IMentorshipSession>('MentorshipSession', MentorshipSessionSchema);

export default MentorshipSession;
