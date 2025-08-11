
'use client';

import { useActionState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { registerUser } from '@/lib/actions';


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
            Create Account
        </Button>
    )
}

export function RegisterForm() {
    const { toast } = useToast();
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction] = useActionState(registerUser, { success: false, message: '' });

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Registration Successful!",
                description: "You will be redirected to the login page.",
            });
            formRef.current?.reset();
            const timer = setTimeout(() => {
                router.push('/');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [state.success, router, toast]);

  return (
      <div className="w-full max-w-sm">
        <form ref={formRef} action={formAction}>
            <Card className="bg-gray-950 text-white border-gray-800">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto h-12 w-12 text-primary">
                    <Icon className="h-full w-full" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
                    <CardDescription className="text-gray-400">
                    Join Infusion NEXT to start your journey.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {state.success ? (
                         <Alert variant="default" className="bg-green-900/50 border-green-500 text-green-200">
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    ) : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            required
                             className="bg-gray-800 border-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john.doe@example.com"
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
                            required
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
                            </SelectContent>
                            </Select>
                        </div>

                        {!state.success && state.message && (
                            <Alert variant="destructive">
                                <AlertTitle>Registration Failed</AlertTitle>
                                <AlertDescription>{state.message}</AlertDescription>
                            </Alert>
                        )}

                        <SubmitButton />
                    </>
                    )}

                </CardContent>
                <CardFooter className="flex-col text-sm">
                    <p className="text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/" className="font-medium text-primary hover:underline">
                            Log In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </form>
      </div>
  );
}
