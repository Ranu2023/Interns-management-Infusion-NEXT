
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
      viewBox="0 0 24"
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
    const [state, formAction] = useFormState(authenticate, undefined);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4 text-white">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <div className="mx-auto h-12 w-12 text-primary">
                        <Icon className="h-full w-full" />
                    </div>
                    <h1 className="text-3xl font-bold font-headline">Synergy Interns</h1>
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
                                placeholder="hr@synergy.com"
                                required
                                className="bg-gray-800 border-gray-700"
                                defaultValue="intern@synergy.com"
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
                                className="bg-gray-800 border-gray-700"
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" required defaultValue="intern">
                                <SelectTrigger id="role" className="bg-gray-800 border-gray-700">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hr">HR / Admin</SelectItem>
                                    <SelectItem value="mentor">Mentor</SelectItem>
                                    <SelectItem value="intern">Intern</SelectItem>
                                    <SelectItem value="employee">Employee</SelectItem>
                                </SelectContent>
                            </Select>
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
        </main>
    );
}
