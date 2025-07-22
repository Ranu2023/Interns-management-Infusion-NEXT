import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IApplication extends Document {
  name: string;
  university: string;
  date: Date;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
}

const ApplicationSchema: Schema<IApplication> = new Schema({
  name: { type: String, required: true },
  university: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, required: true, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], default: 'Pending' },
});

const Application: Model<IApplication> = models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;
