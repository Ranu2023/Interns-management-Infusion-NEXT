
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IActivityDetail {
  action: string;
  timestamp: Date;
}

const ActivityDetailSchema: Schema<IActivityDetail> = new Schema({
  action: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});


export interface ISession {
    loginTime: Date;
    logoutTime?: Date;
    activities: IActivityDetail[];
}

const SessionSchema: Schema<ISession> = new Schema({
    loginTime: { type: Date, required: true },
    logoutTime: { type: Date },
    activities: [ActivityDetailSchema],
});

export interface IActivity extends Document {
  internId: mongoose.Schema.Types.ObjectId;
  date: Date;
  sessions: ISession[];
}

const ActivitySchema: Schema<IActivity> = new Schema({
  internId: { type: Schema.Types.ObjectId, ref: 'Intern', required: true },
  date: { type: Date, required: true },
  sessions: [SessionSchema],
});

ActivitySchema.index({ internId: 1, date: 1 }, { unique: true });

const Activity: Model<IActivity> = models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;

    