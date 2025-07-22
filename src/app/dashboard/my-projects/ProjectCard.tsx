
'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, ListTodo, GitFork, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/types';

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/my-projects/${project._id}`);
  };

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  return (
    <Card
      onClick={handleCardClick}
      className="flex flex-col h-full hover:border-primary transition-all w-full cursor-pointer"
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <Badge variant={project.status === 'In Progress' ? 'default' : project.status === 'Completed' ? 'secondary' : 'destructive'}>
            {project.status}
          </Badge>
        </div>
        <div className="flex items-center pt-2 gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://placehold.co/100x100.png" alt={project.mentor} data-ai-hint="avatar person" />
            <AvatarFallback>{project.mentor.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Mentor: {project.mentor}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <p>Overall Progress</p>
              <span>{Math.round(project.progress || 0)}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
          <div className="flex justify-around text-center text-sm">
            <div>
              <CheckCircle2 className="h-5 w-5 mx-auto text-primary" />
              <p className="font-semibold">{project.tasksCompleted}</p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </div>
            <div>
              <ListTodo className="h-5 w-5 mx-auto text-primary" />
              <p className="font-semibold">{project.tasksTotal}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
            {project.document && (
              <div>
                <FileText className="h-5 w-5 mx-auto text-primary" />
                <p className="font-semibold">1</p>
                <p className="text-xs text-muted-foreground">Document</p>
              </div>
            )}
          </div>
        </div>
        {project.document && (
          <Button variant="outline" className="w-full" asChild>
            <a href={project.document} target="_blank" rel="noopener noreferrer" onClick={handleDownloadClick}>
              <Download className="mr-2" />
              Download Project Brief
            </a>
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-4 mt-auto">
        <GitFork className="h-4 w-4" />
        <span>{project.recentActivity}</span>
      </CardFooter>
    </Card>
  );
}
