
'use client';

import { useEffect, useState, useTransition } from 'react';
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
import { Button } from '@/components/ui/button';
import { Check, FileText, University, X, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Application } from '@/lib/types';
import { updateApplicationStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

async function getApplication(id: string): Promise<Application | null> {
    const res = await fetch(`/api/applications/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    // Ensure _id is a string
    return { ...data, _id: data._id.toString() };
}

export default function ApplicationReviewPage({ params }: { params: { id: string }}) {
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, startTransition] = useTransition();
    const { toast } = useToast();
    
    useEffect(() => {
        const fetchApp = async () => {
            if (!params.id.match(/^[0-9a-fA-F]{24}$/)) {
                setLoading(false);
                return;
            }
            try {
                const data = await getApplication(params.id);
                setApplication(data);
            } catch (error) {
                console.error('Failed to fetch application', error);
                setApplication(null);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchApp();
        }
    }, [params.id]);


    const handleStatusUpdate = async (status: 'Accepted' | 'Rejected') => {
        if (!application?._id) return;
        
        startTransition(async () => {
            try {
                await updateApplicationStatus(application._id!, status);
                setApplication(prev => prev ? { ...prev, status } : null);
                toast({
                    title: `Application ${status}`,
                    description: `${application.name}'s application has been ${status.toLowerCase()}.`,
                })
            } catch (error) {
                console.error('Failed to update status', error);
                toast({
                    variant: 'destructive',
                    title: "Update failed",
                    description: "Could not update the application status."
                })
            }
        });
    }

    if (loading) {
        return (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!application) {
        return notFound();
    }
    
    const isActionDisabled = application.status === 'Accepted' || application.status === 'Rejected' || isSubmitting;
    
    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Application Review</CardTitle>
                        <Badge variant={
                            application.status === 'Accepted' ? 'default' :
                            application.status === 'Rejected' ? 'destructive' :
                            application.status === 'Reviewed' ? 'secondary' : 'outline'
                        }>
                            {application.status}
                        </Badge>
                    </div>
                    <CardDescription>Reviewing application from {application.name}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="avatar person" />
                            <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold">{application.name}</h2>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                <University className="h-4 w-4" /> {application.university}
                            </p>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="space-y-4">
                        <h3 className="font-semibold">Applicant Documents</h3>
                        <div className="grid gap-3">
                             <Button variant="outline" className="justify-start" asChild>
                               <a href="https://placehold.co/800x1100.png" target="_blank" rel="noopener noreferrer">
                                <FileText className="mr-2"/>
                                View Resume / CV
                               </a>
                            </Button>
                             <Button variant="outline" className="justify-start" asChild>
                               <a href="https://placehold.co/800x1100.png" target="_blank" rel="noopener noreferrer">
                                <FileText className="mr-2"/>
                                View Cover Letter
                               </a>
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Application Details</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>Applied On:</strong> {new Date(application.date).toLocaleDateString()}</p>
                            <p><strong>Desired Role:</strong> Software Engineer Intern</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="destructive" onClick={() => handleStatusUpdate('Rejected')} disabled={isActionDisabled}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        <X className="mr-2" />
                        Reject
                    </Button>
                    <Button onClick={() => handleStatusUpdate('Accepted')} disabled={isActionDisabled}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        <Check className="mr-2" />
                        Accept
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
