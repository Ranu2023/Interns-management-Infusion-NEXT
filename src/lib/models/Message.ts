
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  message: string;
  timestamp: Date;
  read: boolean;
}

const MessageSchema: Schema<IMessage> = new Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  read: { type: Boolean, default: false },
}, { timestamps: true });

const Message: Model<IMessage> = models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
