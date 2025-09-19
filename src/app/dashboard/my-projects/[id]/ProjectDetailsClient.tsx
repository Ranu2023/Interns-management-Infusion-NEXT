
'use client';

import { useState, useMemo, useTransition, useActionState, useRef } from 'react';
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
import { ArrowLeft, GitBranch, Github, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { updateTaskCompletion, submitGithubRepo } from '@/lib/actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFormStatus } from 'react-dom';

function RepoSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 animate-spin" /> : <GitBranch className="mr-2" />}
            Submit Repo
        </Button>
    )
}


export function ProjectDetailsClient({ project: initialProject }: { project: Project & {_id: string} }) {
    const [tasks, setTasks] = useState<Task[]>(initialProject.tasks || []);
    const [isTransitioning, startTransition] = useTransition();
    const { toast } = useToast();
    const repoFormRef = useRef<HTMLFormElement>(null);

    const hasRepo = !!initialProject.githubRepo;
    
    // Server action for submitting the repo
    const [repoState, repoFormAction] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await submitGithubRepo(initialProject._id, formData);
        if (result.success) {
            toast({ title: "Success!", description: result.message });
            repoFormRef.current?.reset();
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
        }
        return result;
    }, { success: false, message: '' });


    const handleTaskChange = (taskId: number) => {
        const currentTask = tasks.find(t => t.id === taskId);
        if (!currentTask || currentTask.completed) {
            return;
        }

        const newTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
        );
        setTasks(newTasks);

        startTransition(async () => {
            try {
                await updateTaskCompletion(initialProject._id, taskId, true);
            } catch (error) {
                console.error("Failed to update task", error);
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
            newStatus = 'On-Hold';
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
            
            {hasRepo ? (
                 <Alert>
                    <Github className="h-4 w-4" />
                    <AlertTitle>Repository Submitted</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                       <Link href={initialProject.githubRepo!} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                         {initialProject.githubRepo}
                       </Link>
                    </AlertDescription>
                </Alert>
            ) : (
                <Card className="bg-muted/50 p-4">
                    <form ref={repoFormRef} action={repoFormAction} className="space-y-3">
                        <Label htmlFor="githubRepo">Submit GitHub Repository to Begin</Label>
                        <div className="flex gap-2">
                             <Input 
                                id="githubRepo"
                                name="githubRepo"
                                placeholder="https://github.com/your-username/your-repo"
                                required
                            />
                            <RepoSubmitButton />
                        </div>
                        {repoState && !repoState.success && (
                            <p className="text-sm text-destructive">{repoState.message}</p>
                        )}
                    </form>
                </Card>
            )}

            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm mb-1">
                    <p className="text-muted-foreground">Progress</p>
                    <span>{tasksCompleted} / {tasksTotal} tasks completed</span>
                </div>
              <Progress value={progress} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tasks</h3>
                {!hasRepo && (
                    <div className="flex items-center gap-1.5 text-sm text-destructive font-medium">
                        <AlertCircle className="h-4 w-4" />
                        <span>Repo link required to unlock tasks</span>
                    </div>
                )}
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleTaskChange(task.id)}
                      disabled={isTransitioning || task.completed || !hasRepo}
                    />
                    <Label
                      htmlFor={`task-${task.id}`}
                      className={`flex-1 text-base ${task.completed ? 'line-through text-muted-foreground' : ''} ${!hasRepo ? 'cursor-not-allowed' : ''}`}
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
