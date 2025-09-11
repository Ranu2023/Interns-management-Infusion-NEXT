
'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, ListTodo, GitFork, FileText, Download, CalendarClock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IProject } from '@/lib/models/Project';
import { differenceInDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { cn } from '@/lib/utils';

export function ProjectCard({ project }: { project: IProject & {tasksCompleted: number, tasksTotal: number} }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/my-projects/${project._id}`);
  };

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };
  
  const daysLeft = project.completionDate ? differenceInDays(new Date(project.completionDate), new Date()) : null;
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isNearingDeadline = daysLeft !== null && daysLeft >= 0 && daysLeft <= 5;


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
            <AvatarImage src="" alt={project.mentor} />
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
       <CardFooter className="flex flex-col items-start gap-3 text-xs text-muted-foreground border-t pt-4 mt-auto">
         {project.completionDate && (
             <div className={cn("w-full flex justify-between items-center text-sm p-2 rounded-md", {
                 "bg-destructive/10 text-destructive": isNearingDeadline || isOverdue
             })}>
                <div className="flex items-center gap-2">
                    {isNearingDeadline || isOverdue ? <AlertTriangle className="h-4 w-4"/> : <CalendarClock className="h-4 w-4"/>}
                    <span className="font-medium">
                        {isOverdue ? 'Deadline Missed' : 'Deadline'}
                    </span>
                </div>
                <span>
                    {formatInTimeZone(new Date(project.completionDate), "Asia/Kolkata", "PP")}
                    {daysLeft !== null && ` (${isOverdue ? Math.abs(daysLeft) + ' days ago' : daysLeft + ' days left'})`}
                </span>
             </div>
         )}
        <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4" />
            <span>{project.recentActivity}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
