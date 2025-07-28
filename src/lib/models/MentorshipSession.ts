
'use server';

import mongoose, { Schema, Document, models, Model } from 'mongoose';

interface IChatMessage {
    senderId: mongoose.Schema.Types.ObjectId;
    message: string;
    timestamp: Date;
}

export interface IMentorshipSession extends Document {
  intern: mongoose.Schema.Types.ObjectId;
  mentor: mongoose.Schema.Types.ObjectId;
  chat: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema: Schema<IChatMessage> = new Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const MentorshipSessionSchema: Schema<IMentorshipSession> = new Schema({
  intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  chat: [ChatMessageSchema]
}, { timestamps: true });

const MentorshipSession: Model<IMentorshipSession> = models.MentorshipSession || mongoose.model<IMentorshipSession>('MentorshipSession', MentorshipSessionSchema);

export default MentorshipSession;
