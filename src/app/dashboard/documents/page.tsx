
'use server';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Download, FolderOpen, FileText, Award } from "lucide-react";
import dbConnect from "@/lib/db";
import Document from "@/lib/models/Document";
import { getSession } from "@/lib/session";
import { User } from "@/context/AuthContext";
import { redirect } from "next/navigation";

async function getMyDocuments() {
    const session = await getSession();
    const user = session?.user as User;
    if (!user) redirect('/');

    await dbConnect();
    const documents = await Document.find({ userId: user.id }).lean();
    
    return documents.map(doc => ({
        ...doc,
        _id: doc._id.toString(),
        userId: doc.userId.toString(),
        date: new Date(doc.date).toISOString()
    }));
}


export default async function DocumentsPage() {
    const documents = await getMyDocuments();

    const getIcon = (type: string) => {
        switch(type) {
            case 'Offer Letter': return <FileText className="h-4 w-4" />;
            case 'LOR': return <Award className="h-4 w-4" />;
            case 'Completion Certificate': return <Award className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>Access and download your important documents issued by HR.</CardDescription>
            </CardHeader>
            <CardContent>
                 {documents.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date Issued</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow key={doc._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-medium">
                                            {getIcon(doc.type)}
                                            <span>{doc.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>{new Date(doc.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={doc.href} target="_blank" rel="noopener noreferrer">
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 ) : (
                    <div className="text-center text-muted-foreground py-20">
                        <FolderOpen className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No Documents Found</h3>
                        <p className="mt-2 text-sm">
                            Important documents like your offer letter and certificates will appear here once issued by HR.
                        </p>
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
