
'use client';

import { useRef, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, FileUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { IIntern } from "@/lib/models/Intern";
import { assignDocuments } from '@/lib/actions';

function SubmitButton({ disabled }: { disabled: boolean}) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending || disabled}>
            {pending ? <Loader2 className="mr-2 animate-spin" /> : <FileUp className="mr-2" />}
            {pending ? "Assigning..." : "Assign & Notify Intern"}
        </Button>
    )
}

type Props = {
    intern: IIntern & { _id: string };
    existingCertificateHref?: string;
    existingLorHref?: string;
}

export function DocumentAssignmentForm({ intern, existingCertificateHref, existingLorHref }: Props) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const formActionWithInternId = assignDocuments.bind(null, intern._id);

  const [state, formAction] = useActionState(formActionWithInternId, { success: false, message: '' });

  useEffect(() => {
    if (state.success) {
        toast({
            title: "Documents Assigned!",
            description: `Documents have been assigned to ${intern.name}.`,
        });
    } else if (state.message) {
        toast({
            variant: "destructive",
            title: "Assignment Failed",
            description: state.message,
        });
    }
  }, [state, intern.name, toast]);

  const areDocsAssigned = !!state.success || (!!existingCertificateHref && !!existingLorHref);

  return (
    <div>
         <div className="mb-4">
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/assign-documents">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Intern List
                </Link>
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Assign Documents for {intern.name}</CardTitle>
                <CardDescription>
                Upload the final documents and provide the public links below. The intern will be notified upon submission.
                </CardDescription>
            </CardHeader>
            <form ref={formRef} action={formAction}>
                <CardContent className="space-y-6">
                 {areDocsAssigned && (
                    <Alert variant="default" className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Documents Already Assigned</AlertTitle>
                        <AlertDescription>
                            The final documents have been assigned to this intern. You can update the links below if needed.
                        </AlertDescription>
                    </Alert>
                )}
                <div className="grid gap-2">
                    <Label htmlFor="certificateLink">Completion Certificate Link (PDF)</Label>
                    <Input
                    id="certificateLink"
                    name="certificateLink"
                    placeholder="https://example.com/certificate.pdf"
                    required
                    defaultValue={existingCertificateHref}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="lorLink">Letter of Recommendation Link (PDF)</Label>
                    <Input
                    id="lorLink"
                    name="lorLink"
                    placeholder="https://example.com/lor.pdf"
                    required
                    defaultValue={existingLorHref}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="feedback">Internship Feedback (Optional)</Label>
                    <Input
                    id="feedback"
                    name="feedback"
                    placeholder="Provide a link to a feedback document..."
                    />
                     <p className="text-xs text-muted-foreground">
                        This is an optional field for any additional performance feedback document.
                    </p>
                </div>
                
                </CardContent>
                <CardFooter>
                    <SubmitButton disabled={areDocsAssigned} />
                </CardFooter>
            </form>
        </Card>
    </div>
  );
}
