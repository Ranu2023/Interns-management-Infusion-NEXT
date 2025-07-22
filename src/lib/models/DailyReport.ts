import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';

export interface IDailyReport extends Document {
  internId: Types.ObjectId;
  date: Date;
  accomplishments: string;
  goals: string;
  blockers?: string;
}

const DailyReportSchema: Schema<IDailyReport> = new Schema({
  internId: { type: Schema.Types.ObjectId, ref: 'Intern', required: true },
  date: { type: Date, required: true, default: Date.now },
  accomplishments: { type: String, required: true },
  goals: { type: String, required: true },
  blockers: { type: String },
});

const DailyReport: Model<IDailyReport> = models.DailyReport || mongoose.model<IDailyReport>('DailyReport', DailyReportSchema);

export default DailyReport;
