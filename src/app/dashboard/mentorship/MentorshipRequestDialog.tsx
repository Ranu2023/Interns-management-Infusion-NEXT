
'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { requestMentorship } from '@/lib/actions';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


export function MentorshipRequestDialog({ mentorId, mentorName, requestStatus }: { mentorId: string, mentorName: string, requestStatus?: 'pending' | 'approved' | 'rejected' }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleRequest = () => {
        startTransition(async () => {
            const result = await requestMentorship(mentorId);
            if (result.success) {
                toast({
                    title: "Mentorship Request Sent!",
                    description: result.message,
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Request Failed",
                    description: result.message,
                });
            }
        });
    }

    if (requestStatus) {
        return (
             <Button className="w-full" disabled>
                <Badge variant={
                    requestStatus === 'approved' ? 'default' :
                    requestStatus === 'rejected' ? 'destructive' :
                    'secondary'
                } className="capitalize">{requestStatus}</Badge>
             </Button>
        )
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="w-full" disabled={isPending}>
                     {isPending && <Loader2 className="mr-2 animate-spin" />}
                     Request Mentorship
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Confirm Mentorship Request</AlertDialogTitle>
                <AlertDialogDescription>
                    You are about to send a mentorship request to {mentorName}. Are you sure you want to proceed?
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRequest}>Confirm & Send Request</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
