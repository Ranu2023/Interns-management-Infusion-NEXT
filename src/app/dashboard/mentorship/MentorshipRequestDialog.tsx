
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


export function MentorshipRequestDialog({ mentorId, mentorName }: { mentorId: string, mentorName: string }) {
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
                <AlertDialogTitle>Premium Mentorship Request</AlertDialogTitle>
                <AlertDialogDescription>
                    You are about to request a premium mentorship session with {mentorName}.
                    This is a paid service. Are you sure you want to proceed?
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
