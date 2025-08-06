
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export type DocumentType = 'Offer Letter' | 'LOR' | 'Completion Certificate' | 'Feedback';

export interface IDocument extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  type: DocumentType;
  date: Date;
  href: string;
}

const DocumentSchema: Schema<IDocument> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Offer Letter', 'LOR', 'Completion Certificate', 'Feedback'] },
  date: { type: Date, required: true, default: Date.now },
  href: { type: String, required: true },
});

const DocumentModel: Model<IDocument> = models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;
