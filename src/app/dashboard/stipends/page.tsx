
'use client';

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

const stipends = [
  { id: 1, intern: "Alice Johnson", amount: 500, date: "2024-07-01", status: "Paid" },
  { id: 2, intern: "Bob Williams", amount: 500, date: "2024-07-01", status: "Paid" },
  { id: 3, intern: "Charlie Brown", amount: 500, date: "2024-06-01", status: "Paid" },
  { id: 4, intern: "Diana Miller", amount: 500, date: "2024-07-01", status: "Paid" },
  { id: 5, intern: "Ethan Davis", amount: 500, date: "2024-07-01", status: "Pending" },
  { id: 6, intern: "Fiona Garcia", amount: 500, date: "2024-07-01", status: "Paid" },
  { id: 7, intern: "George Rodriguez", amount: 500, date: "2024-07-01", status: "Paid" },
  { id: 8, intern: "Hannah Martinez", amount: 500, date: "2024-06-01", status: "Paid" },
  { id: 9, intern: "Ian Hernandez", amount: 500, date: "2024-07-01", status: "Overdue" },
  { id: 10, intern: "Jasmine Lopez", amount: 500, date: "2024-07-01", status: "Paid" },
];

export default function StipendsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Stipend Management</CardTitle>
                <CardDescription>Track and manage intern stipend disbursals.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Intern Name</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Payment Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stipends.map((stipend) => (
                            <TableRow key={stipend.id}>
                                <TableCell className="font-medium">{stipend.intern}</TableCell>
                                <TableCell className="text-right">${stipend.amount.toFixed(2)}</TableCell>
                                <TableCell>{stipend.date}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        stipend.status === 'Paid' ? 'secondary' :
                                        stipend.status === 'Pending' ? 'outline' : 'destructive'
                                    }>
                                        {stipend.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
