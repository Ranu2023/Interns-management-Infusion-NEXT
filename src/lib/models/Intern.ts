import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IIntern extends Document {
    name: string;
    email: string;
    avatar?: string;
    project: string;
    mentor: string;
    status: 'Active' | 'Completed' | 'On-Hold';
    interestField?: string;
    assessmentScore?: number;
    ppoStatus?: 'Recommended' | 'Not Recommended' | 'Pending';
    ppoReasoning?: string;
    ppoDecision?: 'Accepted' | 'Rejected' | 'Pending';
    internshipStartDate?: Date;
    internshipEndDate?: Date;
    finalAssessmentDate?: Date;
    ppoRecommendationDate?: Date;
    hrInterviewDate?: Date;
    finalDecisionDate?: Date;
    college?: string;
    year?: string;
    course?: string;
    internshipDuration?: number;
}

const InternSchema: Schema<IIntern> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    project: { type: String, required: true, default: 'Unassigned' },
    mentor: { type: String, required: true, default: 'Unassigned' },
    status: { 
        type: String, 
        enum: ['Active', 'Completed', 'On-Hold'], 
        default: 'Active' 
    },
    interestField: { type: String },
    assessmentScore: { type: Number },
    ppoStatus: { 
        type: String, 
        enum: ['Recommended', 'Not Recommended', 'Pending'], 
        default: 'Pending' 
    },
    ppoReasoning: { type: String },
    ppoDecision: { 
        type: String, 
        enum: ['Accepted', 'Rejected', 'Pending'], 
        default: 'Pending' 
    },
    internshipStartDate: { 
        type: Date, 
        default: () => new Date() 
    },
    internshipEndDate: { 
        type: Date, 
        default: () => {
            const end = new Date();
            end.setMonth(end.getMonth() + 3);
            return end;
        }
    },
    finalAssessmentDate: { type: Date },
    ppoRecommendationDate: { type: Date },
    hrInterviewDate: { type: Date },
    finalDecisionDate: { type: Date },
    college: { type: String },
    year: { type: String },
    course: { type: String },
    internshipDuration: { type: Number },
}, { timestamps: true }); // optional timestamps

const Intern: Model<IIntern> = models.Intern || mongoose.model<IIntern>('Intern', InternSchema);

export default Intern;

    