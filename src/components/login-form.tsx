
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authenticate } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

function Icon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.37 7.72a4.44 4.44 0 0 1 5.26 0l1.18 1.18a4.44 4.44 0 0 1 0 5.26l-1.18 1.18a4.44 4.44 0 0 1-5.26 0l-1.18-1.18a4.44 4.44 0 0 1 0-5.26l1.18-1.18zM9.37 16.28a4.44 4.44 0 0 1 5.26 0l1.18-1.18a4.44 4.44 0 0 1 0-5.26l-1.18-1.18a4.44 4.44 0 0 1-5.26 0l-1.18 1.18a4.44 4.44 0 0 1 0 5.26l1.18 1.18z" />
    </svg>
  );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
             {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log In
        </Button>
    )
}

export function LoginForm() {
    const [state, formAction] = useActionState(authenticate, undefined);

    return (
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center space-y-2">
                <div className="mx-auto h-12 w-12 text-primary">
                    <Icon className="h-full w-full" />
                </div>
                <h1 className="text-3xl font-bold font-headline">Infusion NEXT</h1>
                <p className="text-muted-foreground">
                    Welcome back! Please log in to your account.
                </p>
            </div>
            <form action={formAction} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="bg-gray-800 border-gray-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                            className="bg-gray-800 border-gray-700"
                        />
                    </div>
                </div>
                
                {state?.message && (
                    <Alert variant="destructive">
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}
                
                <SubmitButton />
            </form>
             <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}
