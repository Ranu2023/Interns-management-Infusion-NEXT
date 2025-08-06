
import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';

export type MentorFeedbackStatus = 'Approved' | 'Rejected' | 'Changes-Required';

export interface IMentorFeedback {
  status: MentorFeedbackStatus;
  comments?: string;
  date: Date;
}

export interface IDailyReport extends Document {
  internId: Types.ObjectId;
  mentorId: Types.ObjectId;
  projectId: Types.ObjectId;
  projectName: string;
  progressNote: string;
  blockers?: string;
  date: Date;
  completedTasks: string[];
  mentorFeedback?: IMentorFeedback;
}

const MentorFeedbackSchema: Schema<IMentorFeedback> = new Schema({
    status: { type: String, enum: ['Approved', 'Rejected', 'Changes-Required'], required: true },
    comments: { type: String },
    date: { type: Date, required: true, default: Date.now }
});

const DailyReportSchema: Schema<IDailyReport> = new Schema({
  internId: { type: Schema.Types.ObjectId, ref: 'Intern', required: true },
  mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  projectName: { type: String, required: true },
  progressNote: { type: String, required: true },
  blockers: { type: String },
  completedTasks: { type: [String], default: [] },
  date: { type: Date, required: true, default: Date.now },
  mentorFeedback: { type: MentorFeedbackSchema },
});

const DailyReport: Model<IDailyReport> = models.DailyReport || mongoose.model<IDailyReport>('DailyReport', DailyReportSchema);

export default DailyReport;
