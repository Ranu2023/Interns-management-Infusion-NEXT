
'use client';

import { useState, useRef, useActionState } from 'react';
import type { Intern, Project } from '@/lib/types';
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
import { useFormStatus } from 'react-dom';
import { savePPOAssessment } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Assessment
        </Button>
    )
}

export function InternProfileClient({ intern, project }: { intern: Intern, project: Project | null }) {
    const { user } = useAuth();
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    
    const [aiSuggestion, setAiSuggestion] = useState<SuggestPPOOutput | null>(null);
    const [aiLoading, setAiLoading] = useState(false);

    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await savePPOAssessment(intern._id, formData);
        if (result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
        return result;
    }, { success: false, message: '' });

    const handleGenerateSuggestion = async () => {
        if (!intern || !project) return;
        setAiLoading(true);
        setAiSuggestion(null);

        // Get current form values for suggestion
        const formData = new FormData(formRef.current!);
        const assessmentScore = Number(formData.get('assessmentScore'));

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
            toast({ variant: "destructive", title: "Error", description: "Failed to generate AI suggestion." });
        } finally {
            setAiLoading(false);
        }
    };

    const canManage = user?.role === 'hr' || user?.role === 'mentor';

    return (
        <Card>
            <form ref={formRef} action={formAction}>
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
                                name="assessmentScore"
                                type="number"
                                placeholder="e.g., 88"
                                defaultValue={intern.assessmentScore || ''}
                                disabled={!canManage}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="ppo-status">PPO Status</Label>
                            <Select
                                name="ppoStatus"
                                defaultValue={intern.ppoStatus}
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
                            name="ppoReasoning"
                            placeholder="Explain the reasons for the PPO recommendation..."
                            rows={5}
                            defaultValue={intern.ppoReasoning || ''}
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
                        <Button type="button" variant="outline" onClick={handleGenerateSuggestion} disabled={aiLoading}>
                            {aiLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            {aiLoading ? 'Generating...' : 'Generate AI Suggestion'}
                        </Button>
                        <SubmitButton />
                    </CardFooter>
                )}
            </form>
        </Card>
    );
}
