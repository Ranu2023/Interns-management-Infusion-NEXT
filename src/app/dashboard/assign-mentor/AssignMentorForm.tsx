
'use client';

import { useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Loader2, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Intern, type Mentor } from "@/lib/types";
import { assignMentor } from '@/lib/actions';
import { Label } from '@/components/ui/label';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 animate-spin" /> : <UserCheck className="mr-2" />}
            {pending ? "Assigning..." : "Assign Mentor"}
        </Button>
    )
}

export function AssignMentorForm({ interns, mentors }: { interns: (Intern & {_id: string})[], mentors: (Mentor & {_id: string})[] }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    try {
        const result = await assignMentor(formData);
        if (result.success) {
            toast({
                title: "Mentor Assigned!",
                description: result.message,
            });
            formRef.current?.reset();
        } else {
             toast({
                variant: "destructive",
                title: "Assignment Failed",
                description: result.message,
            });
        }
        return result;
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "Assignment Failed",
            description: e.message,
        });
        return { success: false, message: e.message };
    }
  }, { success: false, message: ''});


  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Mentor to Intern</CardTitle>
        <CardDescription>
          Select an unassigned intern and a mentor to pair them.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="intern">Select Unassigned Intern</Label>
             {interns.length > 0 ? (
                <Select name="internId" required>
                <SelectTrigger id="intern">
                    <SelectValue placeholder="Select an intern..." />
                </SelectTrigger>
                <SelectContent>
                    {interns.map((intern) => (
                    <SelectItem key={intern._id} value={intern._id}>
                        {intern.name} ({intern.email})
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
             ) : (
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                    All interns have been assigned a mentor.
                </p>
             )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mentor">Select Mentor</Label>
            <Select name="mentorId" required>
              <SelectTrigger id="mentor">
                <SelectValue placeholder="Select a mentor..." />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((mentor) => (
                  <SelectItem key={mentor._id} value={mentor._id}>
                    {mentor.name} ({mentor.expertise})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
        </CardContent>
        <CardFooter>
            <SubmitButton/>
        </CardFooter>
      </form>
    </Card>
  );
}
