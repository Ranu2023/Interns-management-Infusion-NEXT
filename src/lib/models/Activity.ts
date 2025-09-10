
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IActivityDetail {
  action: string;
  timestamp: Date;
}

export interface IActivity extends Document {
  internId: mongoose.Schema.Types.ObjectId;
  date: Date;
  loginTime: Date;
  logoutTime?: Date;
  activities: IActivityDetail[];
}

const ActivityDetailSchema: Schema<IActivityDetail> = new Schema({
  action: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

const ActivitySchema: Schema<IActivity> = new Schema({
  internId: { type: Schema.Types.ObjectId, ref: 'Intern', required: true },
  date: { type: Date, required: true },
  loginTime: { type: Date, required: true },
  logoutTime: { type: Date },
  activities: [ActivityDetailSchema],
});

const Activity: Model<IActivity> = models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
