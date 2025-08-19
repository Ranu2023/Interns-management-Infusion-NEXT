
'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { type IMentor } from '@/lib/models/Mentor';
import { archiveUser, getAllMentors } from "@/lib/actions";

export default function MentorsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [mentors, setMentors] = useState<IMentor[]>([]);

    useEffect(() => {
        getAllMentors().then(setMentors);
    }, []);

    const handleDelete = async (mentorId: string) => {
        const result = await archiveUser(mentorId, 'mentor');
        if (result.success) {
            toast({ title: "Mentor Archived", description: result.message });
            setMentors(prev => prev.filter(m => m._id.toString() !== mentorId));
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Mentor Management</CardTitle>
                <CardDescription>View and manage all mentors.</CardDescription>
            </CardHeader>
            <CardContent>
                {mentors.length === 0 ? (
                     <div className="text-center text-muted-foreground py-12">
                        No mentor records found.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mentor</TableHead>
                                <TableHead>Expertise</TableHead>
                                <TableHead className="text-center">Interns Assigned</TableHead>
                                {user?.role === 'hr' && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mentors.map((mentor) => (
                                <TableRow key={mentor._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={mentor.avatar || `https://placehold.co/100x100.png`} alt={mentor.name} data-ai-hint="avatar person" />
                                                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{mentor.name}</p>
                                                <p className="text-sm text-muted-foreground">{mentor.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{mentor.expertise}</TableCell>
                                    <TableCell className="text-center">{mentor.interns}</TableCell>
                                    {user?.role === 'hr' && (
                                        <TableCell className="text-right">
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
                                                        This action will archive the mentor's record. It can be viewed in "Deleted Records" but cannot be easily undone.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(mentor._id.toString())}>
                                                        Yes, archive mentor
                                                    </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
