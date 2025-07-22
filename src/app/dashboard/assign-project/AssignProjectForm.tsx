
'use client';

import { useRef } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Intern } from "@/lib/types";
import { assignProject } from '@/lib/actions';
import { useEffect } from 'react';


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 animate-spin" /> : <Send className="mr-2" />}
            {pending ? "Assigning..." : "Assign Project"}
        </Button>
    )
}


export function AssignProjectForm({ interns }: { interns: (Intern & {_id: string})[] }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, formAction] = useFormState(async (prevState: any, formData: FormData) => {
    try {
        await assignProject(formData);
        toast({
            title: "Project Assigned!",
            description: `${formData.get('projectName')} has been assigned.`,
        });
        formRef.current?.reset();
        return { success: true, message: 'Project assigned' };
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
        <CardTitle>Assign New Project</CardTitle>
        <CardDescription>
          Fill in the details below to assign a new project to an intern.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="intern">Select Intern</Label>
            <Select name="internId">
              <SelectTrigger id="intern">
                <SelectValue placeholder="Select an intern..." />
              </SelectTrigger>
              <SelectContent>
                {interns.map((intern) => (
                  <SelectItem key={intern._id} value={intern._id}>
                    {intern.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              name="projectName"
              placeholder="e.g., Customer Feedback Analysis Tool"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Project Description</Label>
            <Textarea
              id="project-description"
              name="projectDescription"
              placeholder="Provide a detailed description of the project, its goals, and expected outcomes."
              rows={6}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="document-link">Task Document Link</Label>
             <div className="flex gap-2">
                <Input
                  id="document-link"
                  name="documentLink"
                  placeholder="https://example.com/project-brief.pdf"
                />
                <Button type="button" variant="outline">
                    <FileUp className="mr-2"/>
                    Upload
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Optionally, provide a link to a document with detailed tasks or upload a file.
            </p>
          </div>
        </CardContent>
        <CardFooter>
            <SubmitButton/>
        </CardFooter>
      </form>
    </Card>
  );
}
