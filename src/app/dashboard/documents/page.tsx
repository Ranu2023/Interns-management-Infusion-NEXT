
'use client';

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
import { Download, FolderOpen, File } from "lucide-react";

// The hardcoded data has been removed.
const documents: any[] = [];

export default function DocumentsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>Access and download your important documents.</CardDescription>
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
                                <TableRow key={doc.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-medium">
                                            {/* Icon logic removed for brevity */}
                                            <span>{doc.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>{doc.date}</TableCell>
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
                            Important documents like your offer letter and certificates will appear here.
                        </p>
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
