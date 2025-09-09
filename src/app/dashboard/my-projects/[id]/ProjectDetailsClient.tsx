
'use client';

import { useState, useMemo, useTransition } from 'react';
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
import { updateTaskCompletion } from '@/lib/actions';

export function ProjectDetailsClient({ project: initialProject }: { project: Project & {_id: string} }) {
    const [tasks, setTasks] = useState<Task[]>(initialProject.tasks || []);
    const [isPending, startTransition] = useTransition();

    const handleTaskChange = (taskId: number) => {
        // Find the task to determine its current state
        const currentTask = tasks.find(t => t.id === taskId);
        if (!currentTask || currentTask.completed) {
            // If task is not found or already completed, do nothing.
            return;
        }

        // Optimistically update the UI
        const newTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
        );
        setTasks(newTasks);

        // Call the server action to update the database
        startTransition(async () => {
            try {
                // We are always setting it to true now.
                await updateTaskCompletion(initialProject._id, taskId, true);
            } catch (error) {
                console.error("Failed to update task", error);
                // Revert UI on error by resetting to original task state
                setTasks(tasks); 
            }
        });
    };
    
    const { progress, tasksCompleted, tasksTotal, status } = useMemo(() => {
        if (!tasks || tasks.length === 0) {
            return { progress: initialProject?.progress || 0, tasksCompleted: 0, tasksTotal: 0, status: initialProject?.status || 'In Progress' };
        }
        const completed = tasks.filter(task => task.completed).length;
        const total = tasks.length;
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        let newStatus: Project['status'] = 'In Progress';
        if (progressPercentage === 100) {
            newStatus = 'Completed';
        } else if (initialProject.completionDate && new Date(initialProject.completionDate) < new Date()) {
            newStatus = 'On-Hold'; // Or some 'Overdue' status if you add it
        }

        return { progress: progressPercentage, tasksCompleted: completed, tasksTotal: total, status: newStatus };
    }, [tasks, initialProject]);

  return (
    <div>
        <div className="mb-4">
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/my-projects">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-headline">{initialProject.title}</CardTitle>
              <CardDescription className="mt-1">
                {initialProject.description}
              </CardDescription>
            </div>
            <Badge variant={status === 'Completed' ? 'secondary' : status === 'On-Hold' ? 'destructive' : 'default'}>
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
                      disabled={isPending || task.completed}
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
