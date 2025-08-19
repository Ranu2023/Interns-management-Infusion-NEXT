
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, Trash2 } from 'lucide-react';
import { User, useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { archiveUser, getInternsForHR } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export default function InternsPage() {
  const { user } = useAuth();
  const [interns, setInterns] = useState<IIntern[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.role === 'hr') {
        getInternsForHR().then(setInterns);
    }
  }, [user]);

  const handleDelete = async (internId: string) => {
    const result = await archiveUser(internId, 'intern');
    if (result.success) {
        toast({ title: "Intern Archived", description: result.message });
        setInterns(prev => prev.filter(i => i._id.toString() !== internId));
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };


  if (!user) {
    return redirect('/');
  }

  // A non-HR user should not see this page, but if they land here, show empty.
  if (user.role !== 'hr') {
      return (
          <Card>
              <CardHeader>
                  <CardTitle>Interns</CardTitle>
                  <CardDescription>
                      You do not have permission to view this page.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="text-center text-muted-foreground py-12">
                      Access Denied.
                  </div>
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interns</CardTitle>
        <CardDescription>
          View and manage intern profiles.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {interns.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
                No intern records found.
            </div>
         ) : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {interns.map((intern) => (
                <TableRow key={intern._id}>
                    <TableCell className="font-medium">{intern.name}</TableCell>
                    <TableCell>{intern.email}</TableCell>
                    <TableCell>{intern.project}</TableCell>
                    <TableCell>{intern.mentor}</TableCell>
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
         )}
      </CardContent>
    </Card>
  );
}

