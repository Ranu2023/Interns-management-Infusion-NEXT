
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IActivityDetail {
  action: string;
  timestamp: Date;
}

const ActivityDetailSchema: Schema<IActivityDetail> = new Schema({
  action: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

export interface IActivity extends Document {
  internId: mongoose.Schema.Types.ObjectId;
  loginTime: Date;
  logoutTime?: Date;
  activities: IActivityDetail[];
}

const ActivitySchema: Schema<IActivity> = new Schema({
  internId: { type: Schema.Types.ObjectId, ref: 'Intern', required: true },
  loginTime: { type: Date, required: true },
  logoutTime: { type: Date },
  activities: [ActivityDetailSchema],
});

ActivitySchema.index({ internId: 1, loginTime: -1 });

const Activity: Model<IActivity> = models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
