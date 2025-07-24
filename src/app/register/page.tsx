'use client';

import { useActionState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { type Role } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { registerUser } from '@/lib/actions';
import { useRouter } from 'next/navigation';

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
            Create Account
        </Button>
    )
}

export default function RegisterPage() {
    const { toast } = useToast();
    const router = useRouter();

    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await registerUser(formData);
        if (result.success) {
            toast({
                title: "Registration Successful!",
                description: "You can now log in with your credentials.",
            });
            router.push('/');
        } else {
            // The toast is now redundant because the state will show the error message in an Alert.
            // Keeping it can be good for visibility though.
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: result.message,
            });
        }
        return result;

    }, { success: false, message: '' });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <form action={formAction}>
            <Card>
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto h-12 w-12 text-primary">
                    <Icon className="h-full w-full" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
                    <CardDescription>
                    Join Synergy Interns to start your journey.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
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
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select name="role" required defaultValue="intern">
                        <SelectTrigger id="role">
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
    </main>
  );
}
