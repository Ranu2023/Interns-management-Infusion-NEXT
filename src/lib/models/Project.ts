import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { type Task } from '@/lib/types';

const TaskSchema = new Schema<Task>({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
});


export interface IProject extends Document {
  title: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'On-Hold' | 'Not Started';
  team: string[];
  mentor: string;
  document: string | null;
  recentActivity: string;
  tasks: Task[];
  progress?: number;
  completionDate?: Date;
  githubRepo?: string;
}

const ProjectSchema: Schema<IProject> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, enum: ['In Progress', 'Completed', 'On-Hold', 'Not Started'] },
  team: { type: [String], required: true },
  mentor: { type: String, required: true },
  document: { type: String },
  recentActivity: { type: String, required: true },
  tasks: { type: [TaskSchema], required: true },
  progress: { type: Number, default: 0 },
  completionDate: { type: Date },
  githubRepo: { type: String },
});

const Project: Model<IProject> = models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
