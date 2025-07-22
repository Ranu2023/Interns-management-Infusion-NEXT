
import { initialData } from '@/lib/seed-data';
import { type Application } from '@/lib/types';
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
import { Check, FileText, University, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

async function getApplication(id: number): Promise<Application | null> {
    const application = initialData.applications.find(a => a.id === id) || null;
    return application;
}

export default async function ApplicationReviewPage({ params }: { params: { id: string } }) {
    const appId = parseInt(params.id, 10);
    if (isNaN(appId)) {
        notFound();
    }
    
    const application = await getApplication(appId);

    if (!application) {
        notFound();
    }
    
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
                    <Button variant="destructive">
                        <X className="mr-2" />
                        Reject
                    </Button>
                    <Button>
                        <Check className="mr-2" />
                        Accept
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
