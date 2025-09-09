
'use client';

import { useRef, useActionState, useState } from 'react';
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
import { FileUp, Send, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type IIntern } from "@/lib/models/Intern";
import { assignProject } from '@/lib/actions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 animate-spin" /> : <Send className="mr-2" />}
            {pending ? "Assigning..." : "Assign Project"}
        </Button>
    )
}


export function AssignProjectForm({ interns }: { interns: (IIntern & {_id: string})[] }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date>();
  
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    if (date) {
        formData.set('completionDate', date.toISOString());
    }
    try {
        const result = await assignProject(formData);
        if (result.success) {
            toast({
                title: "Project Assigned!",
                description: `${formData.get('projectName')} has been assigned.`,
            });
            formRef.current?.reset();
            setDate(undefined);
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
        <CardTitle>Assign New Project</CardTitle>
        <CardDescription>
          Fill in the details below to assign a new project to an intern from your team.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="intern">Select Intern</Label>
            {interns.length > 0 ? (
                 <Select name="internId" required>
                    <SelectTrigger id="intern">
                        <SelectValue placeholder="Select an intern from your team..." />
                    </SelectTrigger>
                    <SelectContent>
                        {interns.map((intern) => (
                        <SelectItem key={intern._id} value={intern._id}>
                            {intern.name} ({intern.project && intern.project !== 'Unassigned' ? intern.project : 'Unassigned'})
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ): (
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                    You have no interns assigned to you.
                </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                id="project-name"
                name="projectName"
                placeholder="e.g., Customer Feedback Analysis Tool"
                required
                disabled={interns.length === 0}
                />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="completion-date">Completion Deadline</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        disabled={interns.length === 0}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Project Description</Label>
            <Textarea
              id="project-description"
              name="projectDescription"
              placeholder="Provide a detailed description of the project, its goals, and expected outcomes."
              rows={4}
              required
              disabled={interns.length === 0}
            />
          </div>
           <div className="grid gap-2">
                <Label htmlFor="project-tasks">Project Tasks</Label>
                <Textarea
                    id="project-tasks"
                    name="projectTasks"
                    placeholder="List the tasks for this project, one task per line."
                    rows={8}
                    required
                    disabled={interns.length === 0}
                />
                <p className="text-xs text-muted-foreground">
                    Enter each task on a new line. These will become the trackable tasks for the intern.
                </p>
            </div>
          <div className="grid gap-2">
            <Label htmlFor="document-link">Task Document Link</Label>
             <div className="flex gap-2">
                <Input
                  id="document-link"
                  name="documentLink"
                  placeholder="https://example.com/project-brief.pdf"
                  disabled={interns.length === 0}
                />
                <Button type="button" variant="outline" disabled={interns.length === 0}>
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
