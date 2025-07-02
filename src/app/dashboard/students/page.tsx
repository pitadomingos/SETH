
'use client';
import { studentsData } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function StudentsPage() {
    const { role } = useAuth();
    const router = useRouter();

    if (role && role !== 'Admin') {
        router.push('/dashboard');
        return null;
    }
    
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
                    <p className="text-muted-foreground">Manage student information and records.</p>
                </div>
                 <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Student
                </Button>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>View and manage all students in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>GPA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentsData.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>Grade {student.grade} - {student.class}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={student.gpa >= 3.5 ? 'secondary' : 'outline'}>
                                            {student.gpa}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
