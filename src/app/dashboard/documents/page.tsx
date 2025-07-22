
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
import { Download, File, Award, Mail } from "lucide-react";

const documents = [
  { id: 1, name: "Internship Offer Letter", date: "2024-05-01", type: "Offer", icon: <Mail/>, href: "https://placehold.co/800x1100.png" },
  { id: 2, name: "Internship Completion Certificate", date: "2024-07-30", type: "Certificate", icon: <Award/>, href: "https://placehold.co/1100x800.png" },
  { id: 3, name: "Letter of Recommendation (LOR)", date: "2024-08-01", type: "Recommendation", icon: <File/>, href: "https://placehold.co/800x1100.png" },
  { id: 4, name: "Performance Review Q1", date: "2024-06-15", type: "Review", icon: <File/>, href: "https://placehold.co/800x1100.png" },
  { id: 5, name: "Stipend Slip - May 2024", date: "2024-06-05", type: "Financial", icon: <File/>, href: "https://placehold.co/800x1100.png" },
  { id: 6, name: "Stipend Slip - June 2024", date: "2024-07-05", type: "Financial", icon: <File/>, href: "https://placehold.co/800x1100.png" },
];

export default function DocumentsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>Access and download your important documents.</CardDescription>
            </CardHeader>
            <CardContent>
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
                                        {doc.icon}
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
            </CardContent>
        </Card>
    );
}
