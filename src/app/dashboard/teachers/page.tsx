
'use client';
import { useSchoolData } from '@/context/school-data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TeachersPage() {
    const { role, isLoading } = useAuth();
    const { teachersData } = useSchoolData();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && role !== 'Admin') {
            router.push('/dashboard');
        }
    }, [role, isLoading, router]);

    if (isLoading || role !== 'Admin') {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Teacher Management</h2>
                    <p className="text-muted-foreground">Manage teacher information and assignments.</p>
                </div>
                 <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Teacher
                </Button>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>All Teachers</CardTitle>
                    <CardDescription>View and manage all teachers in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Experience</TableHead>
                                <TableHead>Qualifications</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teachersData.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell className="font-medium">{teacher.name}</TableCell>
                                    <TableCell>{teacher.subject}</TableCell>
                                    <TableCell>
                                        <div>{teacher.email}</div>
                                        <div className="text-muted-foreground">{teacher.phone}</div>
                                    </TableCell>
                                    <TableCell>{teacher.experience}</TableCell>
                                    <TableCell>{teacher.qualifications}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
