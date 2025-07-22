
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
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


async function getApplication(id: string): Promise<Application | null> {
    // This function will be executed on the server for the initial fetch
    // and can be called on the client for re-fetching.
    // For simplicity, we are keeping this page a client component.
    const res = await fetch(`/api/applications/${id}`);
    if (!res.ok) return null;
    return res.json();
}

export default function ApplicationReviewPage({ params }: { params: { id: string }}) {
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        const fetchApp = async () => {
            try {
                const res = await fetch(`/api/applications/${params.id}`);
                if (!res.ok) {
                    setApplication(null);
                } else {
                    const data = await res.json();
                    setApplication(data);
                }
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
        if (!application) return;
        setIsSubmitting(true);
        try {
            await updateApplicationStatus(application._id!, status);
            setApplication(prev => prev ? { ...prev, status } : null);
        } catch (error) {
            console.error('Failed to update status', error);
            // Optionally: show toast error
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!application) {
        notFound();
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
                             <Button variant="outline" className="justify-start">
                                <FileText className="mr-2"/>
                                View Resume / CV
                            </Button>
                             <Button variant="outline" className="justify-start">
                                <FileText className="mr-2"/>
                                View Cover Letter
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Application Details</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>Applied On:</strong> {application.date}</p>
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
