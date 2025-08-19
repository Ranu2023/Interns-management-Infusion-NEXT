
'use server';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Archive } from "lucide-react";
import dbConnect from '@/lib/db';
import ArchivedIntern from "@/lib/models/ArchivedIntern";
import ArchivedMentor from "@/lib/models/ArchivedMentor";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";


async function getArchivedData() {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'hr') {
        redirect('/dashboard');
    }

    await dbConnect();
    const interns = await ArchivedIntern.find({}).sort({ deletedAt: -1 }).lean();
    const mentors = await ArchivedMentor.find({}).sort({ deletedAt: -1 }).lean();

    return {
        interns: JSON.parse(JSON.stringify(interns)),
        mentors: JSON.parse(JSON.stringify(mentors)),
    }
}

export default async function DeletedRecordsPage() {
    const { interns, mentors } = await getArchivedData();

    return (
        <Tabs defaultValue="interns">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight font-headline">Deleted Records</h1>
                    <p className="text-muted-foreground">View archived intern and mentor records.</p>
                </div>
                <TabsList>
                    <TabsTrigger value="interns"><User className="mr-2" /> Interns ({interns.length})</TabsTrigger>
                    <TabsTrigger value="mentors"><Briefcase className="mr-2" /> Mentors ({mentors.length})</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="interns">
                <Card>
                    <CardHeader>
                        <CardTitle>Archived Interns</CardTitle>
                        <CardDescription>List of all interns that have been deleted from the active system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {interns.length === 0 ? (
                             <div className="text-center text-muted-foreground py-12">
                                <Archive className="mx-auto h-12 w-12" />
                                <h3 className="mt-4 text-lg font-semibold">No Archived Interns</h3>
                                <p className="mt-2 text-sm">Deleted intern records will appear here.</p>
                            </div>
                        ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Last Project</TableHead>
                                    <TableHead>Deleted On</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {interns.map((intern) => (
                                    <TableRow key={intern._id}>
                                        <TableCell>{intern.name}</TableCell>
                                        <TableCell>{intern.email}</TableCell>
                                        <TableCell>{intern.project || 'N/A'}</TableCell>
                                        <TableCell>{new Date(intern.deletedAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="mentors">
                 <Card>
                    <CardHeader>
                        <CardTitle>Archived Mentors</CardTitle>
                        <CardDescription>List of all mentors that have been deleted from the active system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mentors.length === 0 ? (
                            <div className="text-center text-muted-foreground py-12">
                                <Archive className="mx-auto h-12 w-12" />
                                <h3 className="mt-4 text-lg font-semibold">No Archived Mentors</h3>
                                <p className="mt-2 text-sm">Deleted mentor records will appear here.</p>
                            </div>
                        ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Expertise</TableHead>
                                    <TableHead>Deleted On</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mentors.map((mentor) => (
                                    <TableRow key={mentor._id}>
                                        <TableCell>{mentor.name}</TableCell>
                                        <TableCell>{mentor.email}</TableCell>
                                        <TableCell>{mentor.expertise}</TableCell>
                                        <TableCell>{new Date(mentor.deletedAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
