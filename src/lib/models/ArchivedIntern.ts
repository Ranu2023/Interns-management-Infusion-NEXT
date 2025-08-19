
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { IIntern } from './Intern';

export interface IArchivedIntern extends IIntern {
    deletedAt: Date;
}

const ArchivedInternSchema: Schema<IArchivedIntern> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    project: { type: String },
    mentor: { type: String },
    status: { type: String },
    interestField: { type: String },
    assessmentScore: { type: Number },
    ppoStatus: { type: String },
    ppoReasoning: { type: String },
    ppoDecision: { type: String },
    internshipStartDate: { type: Date },
    internshipEndDate: { type: Date },
    finalAssessmentDate: { type: Date },
    ppoRecommendationDate: { type: Date },
    hrInterviewDate: { type: Date },
    finalDecisionDate: { type: Date },
    college: { type: String },
    year: { type: String },
    course: { type: String },
    internshipDuration: { type: Number },
    deletedAt: { type: Date, required: true, default: Date.now },
}, {
    timestamps: true,
    collection: 'archived_interns'
});

const ArchivedIntern: Model<IArchivedIntern> = models.ArchivedIntern || mongoose.model<IArchivedIntern>('ArchivedIntern', ArchivedInternSchema);

export default ArchivedIntern;
