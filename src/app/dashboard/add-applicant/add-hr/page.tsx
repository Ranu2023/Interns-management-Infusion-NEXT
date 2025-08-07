
'use client';

import { useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserCog, ArrowLeft, Copy, Check } from 'lucide-react';
import { addApplicant } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCog className="mr-2" />}
      Add HR Member
    </Button>
  );
}

export default function AddHrPage() {
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
          <CardTitle>Add New HR</CardTitle>
          <CardDescription>Fill out the form to add a new HR member to the system.</CardDescription>
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
             <Button onClick={() => window.location.reload()}>Add Another HR</Button>
           </CardContent>
        ) : (
          <form action={formAction} ref={formRef}>
            <CardContent className="space-y-4">
              <input type="hidden" name="role" value="hr" />
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="hr@example.com" required />
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
