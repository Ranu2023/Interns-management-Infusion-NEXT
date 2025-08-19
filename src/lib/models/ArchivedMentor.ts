
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { IMentor } from './Mentor';

export interface IArchivedMentor extends IMentor {
  deletedAt: Date;
}

const ArchivedMentorSchema: Schema<IArchivedMentor> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    expertise: { type: String, required: true },
    experience: { type: String },
    interns: { type: Number, required: true, default: 0 },
    avatar: { type: String },
    deletedAt: { type: Date, required: true, default: Date.now },
}, {
    timestamps: true,
    collection: 'archived_mentors'
});

const ArchivedMentor: Model<IArchivedMentor> = models.ArchivedMentor || mongoose.model<IArchivedMentor>('ArchivedMentor', ArchivedMentorSchema);

export default ArchivedMentor;
