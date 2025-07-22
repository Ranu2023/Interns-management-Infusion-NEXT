
'use client';

import { useState, useEffect, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { initialData } from '@/lib/seed-data';
import type { Project, Task } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const projectId = parseInt(params.id, 10);
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        // Load all projects from storage or initial data
        const savedProjectsData = localStorage.getItem('projectsData');
        const allProjects: Project[] = savedProjectsData ? JSON.parse(savedProjectsData) : initialData.projects;
        
        const currentProject = allProjects.find(p => p.id === projectId);

        if (currentProject) {
            setProject(currentProject);
            setTasks(currentProject.tasks || []);
        }
    }, [projectId]);

    useEffect(() => {
        // Persist changes to localStorage whenever tasks change for the current project
        if (project) {
            const updatedProject = { ...project, tasks };
            
            const savedProjectsData = localStorage.getItem('projectsData');
            const allProjects: Project[] = savedProjectsData ? JSON.parse(savedProjectsData) : initialData.projects;

            const updatedProjects = allProjects.map(p => p.id === projectId ? updatedProject : p);
            
            localStorage.setItem('projectsData', JSON.stringify(updatedProjects));
        }
    }, [tasks, project, projectId]);


    const handleTaskChange = (taskId: number) => {
        setTasks(currentTasks =>
            currentTasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };
    
    const { progress, tasksCompleted, tasksTotal, status } = useMemo(() => {
        if (!tasks || tasks.length === 0) {
            return { progress: project?.progress || 0, tasksCompleted: 0, tasksTotal: 0, status: project?.status || 'In Progress' };
        }
        const completed = tasks.filter(task => task.completed).length;
        const total = tasks.length;
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        const newStatus = progressPercentage === 100 ? 'Completed' : 'In Progress';
        return { progress: progressPercentage, tasksCompleted: completed, tasksTotal: total, status: newStatus };
    }, [tasks, project]);


    if (project === undefined) {
      return <div>Loading...</div>; // Or a skeleton loader
    }
    
    if (project === null) {
      notFound();
    }

  return (
    <div>
        <div className="mb-4">
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/my-projects">
                    <ArrowLeft className="mr-2" />
                    Back to Projects
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-headline">{project.title}</CardTitle>
              <CardDescription className="mt-1">
                {project.description}
              </CardDescription>
            </div>
            <Badge variant={status === 'Completed' ? 'secondary' : 'default'}>
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm mb-1">
                    <p className="text-muted-foreground">Progress</p>
                    <span>{tasksCompleted} / {tasksTotal} tasks completed</span>
                </div>
              <Progress value={progress} />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleTaskChange(task.id)}
                    />
                    <Label
                      htmlFor={`task-${task.id}`}
                      className={`flex-1 text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
