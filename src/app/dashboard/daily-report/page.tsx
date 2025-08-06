
'use client';

import { useEffect, useState, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Send, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { submitDailyReport, getMyDailyReports } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { type IProject } from '@/lib/models/Project';

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending || disabled}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {pending ? 'Submitting...' : 'Submit Report'}
        </Button>
    );
}

type Report = { _id: string; date: string; }
type Project = IProject & { _id: string };

async function getMyProjects(): Promise<Project[]> {
    const res = await fetch('/api/intern/projects');
    if (!res.ok) return [];
    return res.json();
}


export default function DailyReportPage() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            setLoadingReports(true);
            const fetchedReports = await getMyDailyReports();
            setReports(fetchedReports);
            setLoadingReports(false);
        }
        const fetchProjects = async () => {
            setLoadingProjects(true);
            const fetchedProjects = await getMyProjects();
            setProjects(fetchedProjects);
            setLoadingProjects(false);
        }
        fetchReports();
        fetchProjects();
    }, []);

    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        try {
            const result = await submitDailyReport(formData);
            if (result.success) {
                toast({
                    title: 'Report Submitted!',
                    description: 'Your daily report has been successfully submitted.',
                });
                formRef.current?.reset();
                const fetchedReports = await getMyDailyReports();
                setReports(fetchedReports);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Submission Failed',
                    description: result.message,
                });
            }
            return result;
        } catch (e: any) {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: e.message,
            });
            return { success: false, message: e.message };
        }
    }, { success: false, message: null });
    
    const noProjects = !loadingProjects && projects.length === 0;

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <form action={formAction} ref={formRef}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Progress Report</CardTitle>
                            <CardDescription>Submit your report for today, {new Date().toLocaleDateString()}.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="project">Project Name</Label>
                                {loadingProjects ? <Skeleton className="h-10 w-full" /> : (
                                     <Select name="projectId" required disabled={noProjects}>
                                        <SelectTrigger id="project">
                                            <SelectValue placeholder="Select the project you worked on..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projects.map((project) => (
                                            <SelectItem key={project._id} value={project._id}>
                                                {project.title}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="progress-note">Progress Note</Label>
                                <Textarea
                                    id="progress-note"
                                    name="progressNote"
                                    placeholder="e.g., Completed the user authentication flow. Integrated the payment gateway API..."
                                    rows={5}
                                    required
                                    disabled={noProjects}
                                />
                            </div>
                            
                             <div className="grid gap-2">
                                <Label htmlFor="blockers">Blockers (if any)</Label>
                                <Textarea
                                    id="blockers"
                                    name="blockers"
                                    placeholder="e.g., I'm waiting for the API documentation for the new service..."
                                    rows={3}
                                    disabled={noProjects}
                                />
                            </div>
                            {noProjects && (
                                <p className="text-sm text-destructive text-center p-4 bg-destructive/10 rounded-md">You cannot submit a report because you are not assigned to any projects yet.</p>
                            )}
                        </CardContent>
                        <CardFooter>
                             <SubmitButton disabled={noProjects}/>
                        </CardFooter>
                    </Card>
                </form>
            </div>
             <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Past Submissions</CardTitle>
                        <CardDescription>Your recent report history.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingReports ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
                            </div>
                        ) : reports.length > 0 ? (
                            <ul className="space-y-3">
                                {reports.slice(0, 10).map((sub) => (
                                    <li key={sub._id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>{new Date(sub.date).toLocaleDateString()}</span>
                                        </div>
                                        <span className="text-muted-foreground">Submitted</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No reports submitted yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Need an API route to fetch projects for the client-side component
export const dynamic = 'force-dynamic'; // ensure it's always dynamic
