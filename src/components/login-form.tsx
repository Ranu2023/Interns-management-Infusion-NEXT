
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
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="24"
      height="24"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgb(0,158,255)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'rgb(83,59,255)', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgb(74,74,255)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'rgb(83,59,255)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#grad1)"
        d="M181.88 24.32C159.87 2.31 129.53-5.24 102.43 4.88C51.27 23.36 24.08 81.33 43.12 133.58C52.12 158.03 69.83 177.64 91.24 189.53C95.27 191.73 97.46 196.44 96.53 201.07C94.43 211.53 89.54 220.9 82.38 228.06C81.01 229.43 82.02 231.63 83.82 231.63H156.41C158.21 231.63 159.22 229.43 157.85 228.06C148.16 218.37 142.3 205.5 141.52 191.36C140.85 178.9 146.61 166.97 156.41 158.42C182.02 136.56 200.41 100.41 181.88 24.32Z"
      />
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
