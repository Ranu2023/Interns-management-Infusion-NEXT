
'use client';

import { useState } from "react";
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
import { FileUp, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const interns = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Fiona Garcia" },
  { id: 3, name: "Bob Williams" },
  { id: 4, name: "George Rodriguez" },
  { id: 7, name: "Diana Miller" },
  { id: 8, name: "Ian Hernandez" },
  { id: 9, name: "Ethan Davis" },
  { id: 10, name: "Jasmine Lopez" },
];

export default function AssignProjectPage() {
  const { toast } = useToast();
  const [selectedIntern, setSelectedIntern] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [documentLink, setDocumentLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntern || !projectName || !projectDescription) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill out all required fields.",
      });
      return;
    }
    
    // In a real app, you would handle the form submission, 
    // e.g., save to a database.
    console.log({
      internId: selectedIntern,
      projectName,
      projectDescription,
      documentLink,
    });

    toast({
      title: "Project Assigned!",
      description: `${projectName} has been assigned to the selected intern.`,
    });

    // Reset form
    setSelectedIntern("");
    setProjectName("");
    setProjectDescription("");
    setDocumentLink("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign New Project</CardTitle>
        <CardDescription>
          Fill in the details below to assign a new project to an intern.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="intern">Select Intern</Label>
            <Select onValueChange={setSelectedIntern} value={selectedIntern}>
              <SelectTrigger id="intern">
                <SelectValue placeholder="Select an intern..." />
              </SelectTrigger>
              <SelectContent>
                {interns.map((intern) => (
                  <SelectItem key={intern.id} value={intern.id.toString()}>
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
              placeholder="e.g., Customer Feedback Analysis Tool"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Project Description</Label>
            <Textarea
              id="project-description"
              placeholder="Provide a detailed description of the project, its goals, and expected outcomes."
              rows={6}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="document-link">Task Document Link</Label>
             <div className="flex gap-2">
                <Input
                  id="document-link"
                  placeholder="https://example.com/project-brief.pdf"
                  value={documentLink}
                  onChange={(e) => setDocumentLink(e.target.value)}
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
          <Button type="submit">
            <Send className="mr-2" />
            Assign Project
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
