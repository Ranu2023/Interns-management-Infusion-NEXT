
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
  { id: 1, name: "Internship Offer Letter", date: "2024-05-01", type: "Offer", icon: <Mail/> },
  { id: 2, name: "Internship Completion Certificate", date: "2024-07-30", type: "Certificate", icon: <Award/> },
  { id: 3, name: "Letter of Recommendation (LOR)", date: "2024-08-01", type: "Recommendation", icon: <File/> },
  { id: 4, name: "Performance Review Q1", date: "2024-06-15", type: "Review", icon: <File/> },
  { id: 5, name: "Performance Review Q2", date: "2024-07-28", type: "Review", icon: <File/> },
  { id: 6, name: "Project Completion: AI Chatbot", date: "2024-07-25", type: "Certificate", icon: <Award/> },
  { id: 7, name: "Non-Disclosure Agreement (NDA)", date: "2024-05-15", type: "Legal", icon: <File/> },
  { id: 8, name: "Stipend Slip - May 2024", date: "2024-06-05", type: "Financial", icon: <File/> },
  { id: 9, name: "Stipend Slip - June 2024", date: "2024-07-05", type: "Financial", icon: <File/> },
  { id: 10, name: "Exit Interview Form", date: "2024-07-29", type: "Form", icon: <File/> },
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
                                    <Button variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
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
