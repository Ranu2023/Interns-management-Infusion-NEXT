
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


export function MentorshipRequestDialog({ mentorName }: { mentorName: string }) {
    const { toast } = useToast();

    const handleRequest = () => {
        // In a real app, this would trigger a server action to record the request
        // and send a notification to the mentor.
        toast({
            title: "Mentorship Request Sent!",
            description: `Your request to ${mentorName} has been sent. They will review it shortly.`,
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="w-full">Request Mentorship</Button>
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
