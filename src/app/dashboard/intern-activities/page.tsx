
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
import { Button } from "@/components/ui/button";
import { ArrowRight, History } from "lucide-react";
import dbConnect from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Intern from "@/lib/models/Intern";
import { type IIntern } from "@/lib/models/Intern";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


async function getInternsListForActivity(): Promise<IIntern[]> {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'hr') {
        redirect('/dashboard');
    }
    
    await dbConnect();
    const interns = await Intern.find({}).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(interns));
}

export default async function InternActivitiesPage() {
    const interns = await getInternsListForActivity();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Intern Activity Tracking</CardTitle>
                <CardDescription>
                    Select an intern to view their detailed activity logs.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {interns.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        <History className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No Interns Found</h3>
                        <p className="mt-2 text-sm">There are no intern records in the system to track.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Intern</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {interns.map((intern) => (
                                <TableRow key={intern._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={intern.avatar} alt={intern.name} />
                                                <AvatarFallback>{intern.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{intern.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{intern.email}</TableCell>
                                    <TableCell>{intern.status}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm" disabled>
                                            <Link href={`/dashboard/intern-activities/${intern._id}`}>
                                                View Logs <ArrowRight className="ml-2" />
                                            </Link>
                                        </Button>
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
