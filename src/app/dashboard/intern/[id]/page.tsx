
'use client';

import { useEffect, useState } from 'react';
import { getDb } from '@/lib/mongodb';
import { type Intern, type Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { suggestPPO, type SuggestPPOOutput } from '@/ai/flows/suggest-ppo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, Sparkles, User, Briefcase, Star } from 'lucide-react';

async function getInternData(id: number): Promise<{ intern: Intern | null, project: Project | null }> {
    const db = await getDb();
    const intern = await db.collection('interns').findOne<Intern>({ id: id }, { projection: { _id: 0 } });
    if (!intern) return { intern: null, project: null };

    const project = await db.collection('projects').findOne<Project>({ title: intern.project }, { projection: { _id: 0 } });
    return { intern, project };
}

// This is a client component, but we will fetch initial data and then manage state
export default function InternProfilePage({ params }: { params: { id: string } }) {
    const { user } = useAuth();
    const [intern, setIntern] = useState<Intern | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [assessmentScore, setAssessmentScore] = useState<number | undefined>();
    const [ppoReasoning, setPpoReasoning] = useState('');
    const [ppoStatus, setPpoStatus] = useState<'Recommended' | 'Not Recommended' | 'Pending' | undefined>();

    // AI state
    const [aiSuggestion, setAiSuggestion] = useState<SuggestPPOOutput | null>(null);
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const fetch_data = async () => {
            const internId = parseInt(params.id, 10);
            if (isNaN(internId)) {
                setLoading(false);
                return;
            }
            const { intern, project } = await getInternData(internId);
            setIntern(intern);
            setProject(project);

            if (intern) {
                setAssessmentScore(intern.assessmentScore);
                setPpoReasoning(intern.ppoReasoning || '');
                setPpoStatus(intern.ppoStatus);
            }

            setLoading(false);
        };
        fetch_data();
    }, [params.id]);

    const handleGenerateSuggestion = async () => {
        if (!intern || !project) return;
        setAiLoading(true);
        setAiSuggestion(null);

        try {
            const result = await suggestPPO({
                internName: intern.name,
                projectPerformance: `Project: ${project.title}. Progress: ${project.progress}%. Status: ${project.status}. Description: ${project.description}`,
                mentorFeedback: "The intern is proactive and a quick learner. Consistently delivers high-quality work. (Note: using sample feedback)",
                assessmentScore: assessmentScore || 0,
            });
            setAiSuggestion(result);
        } catch (error) {
            console.error("AI suggestion failed:", error);
            // In a real app, show a toast notification
        } finally {
            setAiLoading(false);
        }
    };

    const handleSave = () => {
        // In a real app, this would be a server action to update the database
        console.log("Saving data:", { id: intern?.id, assessmentScore, ppoReasoning, ppoStatus });
        alert("Data saved to console. In a real app, this would update the database.");
    }

    if (loading) {
        return <div>Loading...</div>; // Replace with Skeleton loader
    }

    if (!intern) {
        return notFound();
    }

    const canManage = user?.role === 'hr' || user?.role === 'mentor';

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
                                <Label>Progress</Label>
                                <span>{project.progress}%</span>
                            </div>
                           <Progress value={project.progress} />
                            <p className="text-sm mt-4 text-muted-foreground">{project.description}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>PPO Assessment & Recommendation</CardTitle>
                        <CardDescription>
                            {canManage ? "Evaluate the intern's performance and make a PPO recommendation." : "View PPO assessment details."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="assessment-score">Final Assessment Score (out of 100)</Label>
                                <Input
                                    id="assessment-score"
                                    type="number"
                                    placeholder="e.g., 88"
                                    value={assessmentScore || ''}
                                    onChange={(e) => setAssessmentScore(Number(e.target.value))}
                                    disabled={!canManage}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="ppo-status">PPO Status</Label>
                                <Select
                                    value={ppoStatus}
                                    onValueChange={(val: any) => setPpoStatus(val)}
                                    disabled={!canManage}
                                >
                                    <SelectTrigger id="ppo-status">
                                        <SelectValue placeholder="Select status..."/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Recommended">Recommended</SelectItem>
                                        <SelectItem value="Not Recommended">Not Recommended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ppo-reasoning">Mentor's Reasoning</Label>
                            <Textarea
                                id="ppo-reasoning"
                                placeholder="Explain the reasons for the PPO recommendation..."
                                rows={5}
                                value={ppoReasoning}
                                onChange={(e) => setPpoReasoning(e.target.value)}
                                disabled={!canManage}
                            />
                        </div>
                         {aiSuggestion && (
                            <Alert>
                                <Lightbulb className="h-4 w-4" />
                                <AlertTitle>AI PPO Suggestion</AlertTitle>
                                <AlertDescription className="prose dark:prose-invert max-w-none">
                                    <p><strong>Recommendation:</strong> {aiSuggestion.recommendation} (Confidence: {(aiSuggestion.confidenceScore * 100).toFixed(0)}%)</p>
                                    <p>{aiSuggestion.reasoning}</p>
                                </AlertDescription>
                            </Alert>
                         )}
                    </CardContent>
                    {canManage && (
                        <CardFooter className="justify-between">
                            <Button variant="outline" onClick={handleGenerateSuggestion} disabled={aiLoading}>
                                {aiLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 h-4 w-4" />
                                )}
                                {aiLoading ? 'Generating...' : 'Generate AI Suggestion'}
                            </Button>
                            <Button onClick={handleSave}>Save Assessment</Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}

// Enable revalidation to fetch fresh data for server-side part
export const revalidate = 60;
