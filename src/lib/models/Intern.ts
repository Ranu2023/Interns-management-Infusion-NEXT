

import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IIntern extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    project: string;
    mentor: string;
    status: 'Active' | 'Completed' | 'On-Hold';
    assessmentScore?: number;
    ppoStatus?: 'Recommended' | 'Not Recommended' | 'Pending';
    ppoReasoning?: string;
    ppoDecision?: 'Accepted' | 'Rejected' | 'Pending';
    // Timeline tracking fields
    internshipStartDate?: Date;
    finalAssessmentDate?: Date;
    ppoRecommendationDate?: Date;
    hrInterviewDate?: Date;
    finalDecisionDate?: Date;
}

const InternSchema: Schema<IIntern> = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    project: { type: String, required: true },
    mentor: { type: String, required: true },
    status: { type: String, required: true, enum: ['Active', 'Completed', 'On-Hold'] },
    assessmentScore: { type: Number },
    ppoStatus: { type: String, enum: ['Recommended', 'Not Recommended', 'Pending'] },
    ppoReasoning: { type: String },
    ppoDecision: { type: String, enum: ['Accepted', 'Rejected', 'Pending'], default: 'Pending' },
    // Timeline tracking fields
    internshipStartDate: { type: Date },
    finalAssessmentDate: { type: Date },
    ppoRecommendationDate: { type: Date },
    hrInterviewDate: { type: Date },
    finalDecisionDate: { type: Date },
});

// To prevent overwriting the model if it already exists, especially during hot-reloading
InternSchema.set('toObject', { transform: (doc, ret) => {
  ret._id = ret._id.toString();
  return ret;
}});

const Intern: Model<IIntern> = models.Intern || mongoose.model<IIntern>('Intern', InternSchema);

export default Intern;
