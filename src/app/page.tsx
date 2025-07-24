'use client';

import { useActionState, useRef } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, type Role } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { authenticate } from '@/lib/actions';


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
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
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


export default function LoginPage() {
  const [state, formAction] = useActionState(authenticate, undefined);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <form action={formAction}>
            <Card>
            <CardHeader className="space-y-1 text-center">
                <div className="mx-auto h-12 w-12 text-primary">
                <Icon className="h-full w-full" />
                </div>
                <CardTitle className="text-2xl font-headline">Synergy Interns</CardTitle>
                <CardDescription>
                Welcome back! Please log in to your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="hr@example.com"
                    required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    defaultValue="password"
                    />
                </div>
                
                {state === "CredentialsSignin" && (
                    <Alert variant="destructive">
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>Invalid email or password.</AlertDescription>
                    </Alert>
                )}

                 {state && state !== "CredentialsSignin" && (
                    <Alert variant="destructive">
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{state}</AlertDescription>
                    </Alert>
                )}
                
                <SubmitButton />
            </CardContent>
            <CardFooter className="flex-col text-sm">
                <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-medium text-primary hover:underline">
                        Register
                    </Link>
                </p>
            </CardFooter>
            </Card>
        </form>
      </div>
    </main>
  );
}
