
'use client';

import { useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, ArrowLeft, Copy } from 'lucide-react';
import { addApplicant } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2" />}
      Add Intern
    </Button>
  );
}

export default function AddInternPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(addApplicant, null);
  const { toast } = useToast();
  
  const handleCopy = () => {
    if (state?.password) {
      navigator.clipboard.writeText(state.password);
      toast({ title: 'Password Copied!' });
    }
  };

  return (
    <div>
        <div className="mb-4">
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/add-applicant">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Applicant Types
                </Link>
            </Button>
        </div>
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Intern</CardTitle>
          <CardDescription>Fill out the form to onboard a new intern.</CardDescription>
        </CardHeader>
        {state?.success && state.password ? (
           <CardContent className="space-y-4 text-center">
             <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-500">
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
            <div className="p-4 border-dashed border-2 rounded-lg space-y-2">
                 <p className="text-sm text-muted-foreground">Temporary password for the new user:</p>
                 <div className="flex items-center justify-center gap-2">
                    <p className="text-2xl font-mono tracking-widest font-bold">{state.password}</p>
                    <Button onClick={handleCopy} size="icon" variant="ghost">
                        <Copy className="h-5 w-5"/>
                    </Button>
                 </div>
                 <p className="text-xs text-muted-foreground">Please share this password securely. The user will be prompted to change it on first login.</p>
            </div>
             <Button onClick={() => window.location.reload()}>Add Another Intern</Button>
           </CardContent>
        ) : (
          <form action={formAction} ref={formRef}>
            <CardContent className="space-y-4">
              <input type="hidden" name="role" value="intern" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Jane Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="jane.doe@example.com" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="college">College Name</Label>
                <Input id="college" name="college" placeholder="University of Technology" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Select name="year">
                    <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Year</SelectItem>
                      <SelectItem value="2nd">2nd Year</SelectItem>
                      <SelectItem value="3rd">3rd Year</SelectItem>
                      <SelectItem value="Final">Final Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="course">Course of Study</Label>
                  <Input id="course" name="course" placeholder="B.Tech in Computer Science" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interestField">Field of Interest</Label>
                <Input id="interestField" name="interestField" placeholder="e.g., AI/ML, Web Development, UI/UX" />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="resume">Resume (Link)</Label>
                  <Input id="resume" name="resume" placeholder="https://linkedin.com/in/jane.doe/resume.pdf" />
                   <p className="text-xs text-muted-foreground">
                    For now, please provide a link to the resume PDF.
                  </p>
              </div>

            {state && !state.success && state.message && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
