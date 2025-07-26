
'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { type Mentor } from '@/lib/types';

// This data would be fetched from the server in a real app
const allMentors: (Mentor & { id: string })[] = [
    { _id: "m1", id: '1', name: "Dr. Guide", email: "mentor@synergy.com", expertise: "AI/ML", interns: 2, avatar: "https://placehold.co/100x100.png" },
    { _id: "m2", id: '2', name: "Jane Doe", email: "jane.d@synergy.com", expertise: "Data Science", interns: 2, avatar: "https://placehold.co/100x100.png" },
    { _id: "m3", id: '3', name: "John Smith", email: "john.s@synergy.com", expertise: "Mobile Development", interns: 2, avatar: "https://placehold.co/100x100.png" },
    { _id: "m4", id: '4', name: "Emily White", email: "emily.w@synergy.com", expertise: "UI/UX Design", interns: 2, avatar: "https://placehold.co/100x100.png" },
    { _id: "m5", id: '5', name: "Michael Green", email: "michael.g@synergy.com", expertise: "Cloud Architecture", interns: 2, avatar: "https://placehold.co/100x100.png" },
    { _id: "m6", id: '6', name: "Sarah Black", email: "sarah.b@synergy.com", expertise: "Backend Systems", interns: 1, avatar: "https://placehold.co/100x100.png" },
];


export default function MentorshipPage() {
    const { toast } = useToast();

    const handleRequest = (mentorName: string) => {
        // In a real app, this would trigger a server action to record the request
        // and send a notification to the mentor.
        toast({
            title: "Mentorship Request Sent!",
            description: `Your request to ${mentorName} has been sent. They will review it shortly.`,
        });
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">Mentorship Hub</h1>
                <p className="text-muted-foreground">Find and request guidance from available mentors.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allMentors.map((mentor) => (
                    <Card key={mentor.id}>
                        <CardHeader className="items-center text-center">
                             <Avatar className="w-20 h-20 mb-2">
                                <AvatarImage src={mentor.avatar} alt={mentor.name} data-ai-hint="avatar person" />
                                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{mentor.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Badge variant="secondary">{mentor.expertise}</Badge>
                            <p className="text-sm text-muted-foreground mt-2">
                                An experienced professional in {mentor.expertise.toLowerCase()} looking to help the next generation of talent.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="w-full">Request Mentorship</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Premium Mentorship Request</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You are about to request a premium mentorship session with {mentor.name}.
                                        This is a paid service. Are you sure you want to proceed?
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRequest(mentor.name)}>Confirm & Send Request</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
