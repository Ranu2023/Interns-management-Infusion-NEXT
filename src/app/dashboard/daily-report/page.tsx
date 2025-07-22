
'use client';

import { useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Send, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { submitDailyReport } from '@/lib/actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {pending ? 'Submitting...' : 'Submit Report'}
        </Button>
    );
}

const pastSubmissions = [
  { date: '2024-07-15', status: 'Submitted' },
  { date: '2024-07-14', status: 'Submitted' },
  { date: '2024-07-13', status: 'Submitted' },
  { date: '2024-07-12', status: 'Submitted' },
  { date: '2024-07-11', status: 'Submitted' },
];

export default function DailyReportPage() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        try {
            const result = await submitDailyReport(formData);
            if (result.success) {
                toast({
                    title: 'Report Submitted!',
                    description: 'Your daily report has been successfully submitted.',
                });
                formRef.current?.reset();
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
                                <Label htmlFor="yesterday-tasks">What did you accomplish yesterday?</Label>
                                <Textarea
                                    id="yesterday-tasks"
                                    name="accomplishments"
                                    placeholder="e.g., Completed the user authentication flow. Integrated the payment gateway API..."
                                    rows={5}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="today-tasks">What are your goals for today?</Label>
                                <Textarea
                                    id="today-tasks"
                                    name="goals"
                                    placeholder="e.g., Start working on the profile page. Write unit tests for the new components..."
                                    rows={5}
                                    required
                                />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="blockers">Are there any blockers or challenges?</Label>
                                <Textarea
                                    id="blockers"
                                    name="blockers"
                                    placeholder="e.g., I'm waiting for the API documentation for the new service..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                             <SubmitButton />
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
                        <ul className="space-y-3">
                            {pastSubmissions.map((sub, index) => (
                                <li key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>{sub.date}</span>
                                    </div>
                                    <span className="text-muted-foreground">{sub.status}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
