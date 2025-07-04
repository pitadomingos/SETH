'use client';
import { useSchoolData } from '@/context/school-data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { formatGradeDisplay, calculateAge } from '@/lib/utils';


export default function StudentsPage() {
    const { role, isLoading } = useAuth();
    const { studentsData, grades, schoolProfile } = useSchoolData();
    const router = useRouter();
    
    const studentsWithDetails = useMemo(() => {
        return studentsData.map(student => {
            const studentGrades = grades.filter(g => g.studentId === student.id);
            let averageGrade: string | number = 'N/A';
            if (studentGrades.length > 0) {
                const totalPoints = studentGrades.reduce((acc, g) => acc + parseFloat(g.grade), 0);
                const averageNumericGrade = totalPoints / studentGrades.length;
                averageGrade = formatGradeDisplay(averageNumericGrade, schoolProfile?.gradingSystem);
            }
            
            const age = student.dateOfBirth ? calculateAge(student.dateOfBirth) : 'N/A';

            return {
                ...student,
                averageGrade,
                age,
            };
        });
    }, [studentsData, grades, schoolProfile]);


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
                    <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
                    <p className="text-muted-foreground">View student information and records. New students are added by approving applications in the Admissions section.</p>
                </div>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>A list of all currently enrolled students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Average Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentsWithDetails.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.age}</TableCell>
                                    <TableCell>Grade {student.grade} - {student.class}</TableCell>
                                    <TableCell>
                                        <div>{student.email}</div>
                                        <div className="text-muted-foreground">{student.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={typeof student.averageGrade === 'string' && (student.averageGrade.startsWith('A') || student.averageGrade.startsWith('4.0') || parseFloat(student.averageGrade) >= 17) ? 'secondary' : 'outline'}>
                                            {student.averageGrade}
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
