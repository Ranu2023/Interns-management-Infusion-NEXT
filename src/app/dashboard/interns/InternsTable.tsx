
'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useState, useTransition } from 'react';
import { type IIntern } from '@/lib/models/Intern';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { archiveUser, updateInternActiveStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { formatInTimeZone } from 'date-fns-tz';

export function InternsTable({ initialInterns }: { initialInterns: IIntern[] }) {
  const { user } = useAuth();
  const [interns, setInterns] = useState<IIntern[]>(initialInterns);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (internId: string) => {
    const result = await archiveUser(internId, 'intern');
    if (result.success) {
        toast({ title: "Intern Archived", description: result.message });
        setInterns(prev => prev.filter(i => i._id.toString() !== internId));
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const handleStatusChange = (internId: string, newStatus: boolean) => {
    startTransition(async () => {
        const status = newStatus ? 'active' : 'inactive';
        const result = await updateInternActiveStatus(internId, status);
        if (result.success) {
            toast({ title: 'Status Updated', description: result.message });
            setInterns(prev => prev.map(i => i._id.toString() === internId ? { ...i, activeStatus: status } : i));
        } else {
             toast({ variant: "destructive", title: "Error", description: result.message });
        }
    });
  }

  const formatIST = (date: Date | string) => {
    return formatInTimeZone(new Date(date), 'Asia/Kolkata', 'PPp');
  }


  if (!user) {
    return redirect('/');
  }

  if (user.role !== 'hr') {
      return (
          <div className="text-center text-muted-foreground py-12">
              You do not have permission to view this page.
          </div>
      )
  }
  
  if (interns.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-12">
            No intern records found.
        </div>
    )
  }

  return (
    <Table>
    <TableHeader>
        <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Project</TableHead>
        <TableHead>First Login</TableHead>
        <TableHead>Login Status</TableHead>
        <TableHead>Active Status</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {interns.map((intern) => (
        <TableRow key={intern._id}>
            <TableCell className="font-medium">{intern.name}</TableCell>
            <TableCell>{intern.project}</TableCell>
             <TableCell>
              {intern.firstLoginAt 
                ? formatIST(intern.firstLoginAt)
                : 'N/A'
              }
            </TableCell>
            <TableCell>
              <Badge variant={intern.firstLogin ? 'default' : 'secondary'}>
                {intern.firstLogin ? 'Logged In' : 'Not Logged In Yet'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`active-switch-${intern._id}`}
                  checked={intern.activeStatus === 'active'}
                  onCheckedChange={(checked) => handleStatusChange(intern._id.toString(), checked)}
                  disabled={isPending}
                />
                <Label htmlFor={`active-switch-${intern._id}`} className="capitalize">{intern.activeStatus}</Label>
              </div>
            </TableCell>
            <TableCell>
            <Badge
                variant={
                intern.status === 'Active'
                    ? 'default'
                    : intern.status === 'Completed'
                    ? 'secondary'
                    : 'destructive'
                }
            >
                {intern.status}
            </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
                <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/intern/${intern._id}`}>
                    View <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                {user.role === 'hr' && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will archive the intern's record. It can be viewed in "Deleted Records" but cannot be easily undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(intern._id.toString())}>
                                Yes, archive intern
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </TableCell>
        </TableRow>
        ))}
    </TableBody>
    </Table>
  );
}
