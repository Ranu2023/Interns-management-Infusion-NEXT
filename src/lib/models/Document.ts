
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IDocument extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  type: 'Offer Letter' | 'LOR' | 'Completion Certificate';
  date: Date;
  href: string;
}

const DocumentSchema: Schema<IDocument> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Offer Letter', 'LOR', 'Completion Certificate'] },
  date: { type: Date, required: true, default: Date.now },
  href: { type: String, required: true },
});

const DocumentModel: Model<IDocument> = models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;
