
'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2, Send, ThumbsDown, ThumbsUp, XCircle, AlertTriangle } from 'lucide-react';
import type { MentorFeedbackStatus } from '@/lib/models/DailyReport';
import { submitMentorFeedback } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full mt-4" type="submit" disabled={pending || disabled}>
            {pending && <Loader2 className="mr-2 animate-spin" />}
            Submit Feedback
        </Button>
    )
}

export function FeedbackForm({ reportId }: { reportId: string }) {
    const { toast } = useToast();
    const [selectedStatus, setSelectedStatus] = useState<MentorFeedbackStatus | null>(null);

    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        if (!selectedStatus) {
            return { success: false, message: "Please select a feedback status." };
        }
        formData.set('status', selectedStatus);

        const result = await submitMentorFeedback(prevState, formData);
        if (result.success) {
            toast({
                title: "Feedback Submitted!",
                description: result.message,
            });
            // Form will be replaced by status message on re-render, no need to reset
        } else {
            toast({
                variant: 'destructive',
                title: "Submission Failed",
                description: result.message,
            });
        }
        return result;

    }, { success: false, message: null });

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="reportId" value={reportId} />
            <div>
                <Label className="mb-2 block">Feedback Status</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button type="button" variant={selectedStatus === 'Approved' ? 'default' : 'outline'} onClick={() => setSelectedStatus('Approved')}>
                        <CheckCircle className="mr-2"/> Yes, task done.
                    </Button>
                     <Button type="button" variant={selectedStatus === 'Rejected' ? 'destructive' : 'outline'} onClick={() => setSelectedStatus('Rejected')}>
                        <XCircle className="mr-2"/> No, task not done.
                    </Button>
                    <Button type="button" variant={selectedStatus === 'Changes-Required' ? 'secondary' : 'outline'} onClick={() => setSelectedStatus('Changes-Required')}>
                       <AlertTriangle className="mr-2"/>  Needs changes.
                    </Button>
                </div>
            </div>

            {selectedStatus === 'Changes-Required' && (
                <div className="grid gap-2">
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea 
                        id="comments"
                        name="comments"
                        placeholder="Explain what changes are needed..."
                        required
                        rows={4}
                    />
                </div>
            )}
            
            {state && !state.success && state.message && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            <SubmitButton disabled={!selectedStatus} />
        </form>
    )
}
