
'use client';

import { useActionState, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, KeyRound, Save, Pencil, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updatePassword, updateProfile } from '@/lib/actions';
import { User as AuthUser } from '@/context/AuthContext';

function PasswordSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Change Password
    </Button>
  );
}

function ProfileSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2" />}
            Save Changes
        </Button>
    )
}

type Props = {
    user: AuthUser;
    profileData: any;
}

export function ProfileClient({ user, profileData }: Props) {
  const { toast } = useToast();
  const passwordFormRef = useRef<HTMLFormElement>(null);
  const profileFormRef = useRef<HTMLFormElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [passwordState, passwordFormAction] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await updatePassword(prevState, formData);
    if (result.success) {
        toast({ title: 'Success!', description: result.message });
        passwordFormRef.current?.reset();
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    return result;
  }, { success: false, message: '' });

  const [profileState, profileFormAction] = useActionState(async (prevState: any, formData: FormData) => {
      const result = await updateProfile(formData);
       if (result.success) {
            toast({ title: 'Success!', description: result.message });
            setIsEditing(false);
            // The page will be revalidated by the server action, so new data will be fetched.
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        return result;
  }, { success: false, message: ''});

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight font-headline">My Profile</h1>
            <p className="text-muted-foreground">View your account details and manage your password.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <form action={profileFormAction} ref={profileFormRef}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Account Details</CardTitle>
                            {!isEditing && (
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                    <Pencil className="mr-2 h-4 w-4"/> Edit
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" defaultValue={profileData?.name} disabled={!isEditing} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" defaultValue={profileData?.email} disabled />
                            </div>
                            <div className="space-y-1">
                                <Label>Role</Label>
                                <p className="text-muted-foreground capitalize">{user.role}</p>
                            </div>
                            {user.role === 'intern' && (
                                <>
                                    <div className="space-y-1">
                                        <Label htmlFor="interestField">Field of Interest</Label>
                                        <Input id="interestField" name="interestField" defaultValue={profileData?.interestField || ''} disabled={!isEditing} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="college">College</Label>
                                        <Input id="college" name="college" defaultValue={profileData?.college || ''} disabled={!isEditing} />
                                    </div>
                                </>
                            )}
                             {user.role === 'mentor' && (
                                <>
                                    <div className="space-y-1">
                                        <Label htmlFor="expertise">Area of Expertise</Label>
                                        <Input id="expertise" name="expertise" defaultValue={profileData?.expertise || ''} disabled={!isEditing} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="experience">Experience</Label>
                                        <Input id="experience" name="experience" defaultValue={profileData?.experience || ''} disabled={!isEditing} />
                                    </div>
                                </>
                            )}
                        </CardContent>
                        {isEditing && (
                            <CardFooter className="justify-end gap-2">
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                    <X className="mr-2"/> Cancel
                                </Button>
                                <ProfileSubmitButton />
                            </CardFooter>
                        )}
                    </Card>
                </form>
            </div>

            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Update your password here. Remember to use a strong password.</CardDescription>
                    </CardHeader>
                    <form ref={passwordFormRef} action={passwordFormAction}>
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
                            {passwordState && !passwordState.success && passwordState.message && (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{passwordState.message}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                        <CardFooter>
                           <PasswordSubmitButton />
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    </div>
  );
}
