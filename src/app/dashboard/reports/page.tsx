
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
import { Download } from "lucide-react";

const reports = [
  { id: 1, intern: "Alice Johnson", date: "2024-07-15", type: "Weekly Summary" },
  { id: 2, intern: "Bob Williams", date: "2024-07-15", type: "Weekly Summary" },
  { id: 3, intern: "Fiona Garcia", date: "2024-07-15", type: "Weekly Summary" },
  { id: 4, intern: "George Rodriguez", date: "2024-07-15", type: "Weekly Summary" },
  { id: 5, intern: "Alice Johnson", date: "2024-07-08", type: "Weekly Summary" },
  { id: 6, intern: "Bob Williams", date: "2024-07-08", type: "Weekly Summary" },
  { id: 7, intern: "Charlie Brown", date: "2024-07-01", type: "Final Report" },
  { id: 8, intern: "Hannah Martinez", date: "2024-07-01", type: "Final Report" },
  { id: 9, intern: "Ian Hernandez", date: "2024-07-15", type: "Weekly Summary" },
  { id: 10, intern: "Jasmine Lopez", date: "2024-07-15", type: "Weekly Summary" },
];

export default function ReportsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Intern Reports</CardTitle>
                <CardDescription>View and manage intern reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Intern Name</TableHead>
                            <TableHead>Report Type</TableHead>
                            <TableHead>Submission Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">{report.intern}</TableCell>
                                <TableCell>{report.type}</TableCell>
                                <TableCell>{report.date}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4" />
                                        <span className="sr-only">Download</span>
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
