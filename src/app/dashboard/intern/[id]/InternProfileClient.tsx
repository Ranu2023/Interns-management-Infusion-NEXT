
'use client';

import { useState } from 'react';
import { type Intern, type Project } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';

export function InternProfileClient({ intern, project }: { intern: Intern, project: Project | null }) {
    const { user } = useAuth();
    
    const [assessmentScore, setAssessmentScore] = useState<number | undefined>(intern.assessmentScore);
    const [ppoReasoning, setPpoReasoning] = useState(intern.ppoReasoning || '');
    const [ppoStatus, setPpoStatus] = useState<'Recommended' | 'Not Recommended' | 'Pending' | undefined>(intern.ppoStatus);

    const [aiSuggestion, setAiSuggestion] = useState<SuggestPPOOutput | null>(null);
    const [aiLoading, setAiLoading] = useState(false);

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

    const canManage = user?.role === 'hr' || user?.role === 'mentor';

    return (
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
    );
}
