
'use client';

import { useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updatePassword } from '@/lib/actions';
import { User as AuthUser } from '@/context/AuthContext';
import { IIntern } from '@/lib/models/Intern';
import { IMentor } from '@/lib/models/Mentor';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Change Password
    </Button>
  );
}

type Props = {
    user: AuthUser;
    profileData: any;
}

export function ProfileClient({ user, profileData }: Props) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await updatePassword(prevState, formData);
    if (result.success) {
        toast({ title: 'Success!', description: result.message });
        formRef.current?.reset();
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    return result;
  }, { success: false, message: '' });

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight font-headline">My Profile</h1>
            <p className="text-muted-foreground">View your account details and manage your password.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label>Full Name</Label>
                            <p className="text-muted-foreground">{user.name}</p>
                        </div>
                         <div className="space-y-1">
                            <Label>Email Address</Label>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                         <div className="space-y-1">
                            <Label>Role</Label>
                            <p className="text-muted-foreground capitalize">{user.role}</p>
                        </div>
                        {user.role === 'intern' && (
                            <>
                                <div className="space-y-1">
                                    <Label>Field of Interest</Label>
                                    <p className="text-muted-foreground">{profileData?.interestField || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label>College</Label>
                                    <p className="text-muted-foreground">{profileData?.college || 'N/A'}</p>
                                </div>
                            </>
                        )}
                        {user.role === 'mentor' && (
                            <>
                                <div className="space-y-1">
                                    <Label>Area of Expertise</Label>
                                    <p className="text-muted-foreground">{profileData?.expertise || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label>Experience</Label>
                                    <p className="text-muted-foreground">{profileData?.experience || 'N/A'}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Update your password here. Remember to use a strong password.</CardDescription>
                    </CardHeader>
                    <form ref={formRef} action={formAction}>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" name="currentPassword" type="password" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" name="newPassword" type="password" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input id="confirmPassword" name="confirmPassword" type="password" required />
                                </div>
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
                </Card>
            </div>
        </div>
    </div>
  );
}

    