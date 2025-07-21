
import { getDb } from '@/lib/mongodb';
import { type Intern, type Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Briefcase, Star, User } from 'lucide-react';
import { InternProfileClient } from './InternProfileClient';

async function getInternData(id: number): Promise<{ intern: Intern | null, project: Project | null }> {
    const db = await getDb();
    const intern = await db.collection('interns').findOne<Intern>({ id: id }, { projection: { _id: 0 } });
    if (!intern) return { intern: null, project: null };

    const project = await db.collection('projects').findOne<Project>({ title: intern.project }, { projection: { _id: 0 } });
    return { intern, project };
}

// This is now a Server Component to fetch initial data
export default async function InternProfilePage({ params }: { params: { id: string } }) {
    const internId = parseInt(params.id, 10);
    if (isNaN(internId)) {
        notFound();
    }
    
    const { intern, project } = await getInternData(internId);

    if (!intern) {
        notFound();
    }
    
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader className="items-center text-center">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="avatar person" />
                            <AvatarFallback>{intern.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl">{intern.name}</CardTitle>
                        <CardDescription>{intern.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Separator className="my-4" />
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-primary" />
                                <span>Status: <Badge variant={intern.status === 'Active' ? 'default' : 'secondary'}>{intern.status}</Badge></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-4 h-4 text-primary" />
                                <span>Project: {intern.project}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Star className="w-4 h-4 text-primary" />
                                <span>Mentor: {intern.mentor}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {project && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                            <CardDescription>{project.title}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex justify-between items-center text-sm mb-1">
                                <p className="text-muted-foreground">Progress</p>
                                <span>{project.progress}%</span>
                            </div>
                           <Progress value={project.progress} />
                            <p className="text-sm mt-4 text-muted-foreground">{project.description}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className="lg:col-span-2">
                <InternProfileClient intern={intern} project={project} />
            </div>
        </div>
    );
}

// Enable revalidation to fetch fresh data
export const revalidate = 60;
