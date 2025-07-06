
'use client';
import { useSchoolData } from '@/context/school-data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, GraduationCap, TrendingUp, CheckCircle, ArrowRightLeft, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { formatGradeDisplay, calculateAge } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

const PAGE_SIZE = 10;

const StudentsByGradeChart = () => {
    const { studentsData } = useSchoolData();

    const chartData = useMemo(() => {
        const gradeCounts = studentsData.reduce((acc, student) => {
            const gradeKey = `Grade ${student.grade}`;
            acc[gradeKey] = (acc[gradeKey] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(gradeCounts)
            .map(([name, students]) => ({ name, students: students as number }))
            .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));

    }, [studentsData]);

    const chartConfig = {
        students: {
            label: "Students",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Students by Grade Level</CardTitle>
                <CardDescription>A distribution of students across all grades.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis allowDecimals={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="students" fill="var(--color-students)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default function StudentsPage() {
    const { role, isLoading } = useAuth();
    const { studentsData, grades, schoolProfile } = useSchoolData();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredStudents = useMemo(() => {
        return studentsData.map(student => {
            const studentGrades = grades.filter(g => g.studentId === student.id);
            let averageGrade: string | number = 'N/A';
            if (studentGrades.length > 0) {
                const totalPoints = studentGrades.reduce((acc, g) => acc + parseFloat(g.grade), 0);
                const averageNumericGrade = totalPoints / studentGrades.length;
                averageGrade = formatGradeDisplay(averageNumericGrade, schoolProfile?.gradingSystem);
            }
            
            const age = student.dateOfBirth ? calculateAge(student.dateOfBirth) : 'N/A';

            return { ...student, averageGrade, age };
        }).filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [studentsData, grades, schoolProfile, searchTerm]);

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredStudents.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredStudents, currentPage]);
    
    const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
    
    const summaryStats = useMemo(() => {
        let schoolWideAverage: string | number = 'N/A';
        if (grades.length > 0) {
            const totalPoints = grades.reduce((acc, g) => acc + parseFloat(g.grade), 0);
            schoolWideAverage = formatGradeDisplay(totalPoints / grades.length, schoolProfile?.gradingSystem);
        }

        const statusCounts = studentsData.reduce((acc, student) => {
            acc[student.status] = (acc[student.status] || 0) + 1;
            return acc;
        }, { Active: 0, Inactive: 0, Transferred: 0 } as Record<Student['status'], number>);

        const genderCounts = studentsData.reduce((acc, student) => {
            acc[student.sex] = (acc[student.sex] || 0) + 1;
            return acc;
        }, { Male: 0, Female: 0 } as Record<Student['sex'], number>);


        return {
            total: studentsData.length,
            schoolWideAverage,
            active: statusCounts.Active,
            inactive: (statusCounts.Inactive || 0) + (statusCounts.Transferred || 0),
            male: genderCounts.Male,
            female: genderCounts.Female,
        };
    }, [studentsData, grades, schoolProfile]);


    useEffect(() => {
        if (!isLoading && role !== 'Admin') {
            router.push('/dashboard');
        }
    }, [role, isLoading, router]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle><GraduationCap className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.total}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">School Average Grade</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.schoolWideAverage}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Students</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">{summaryStats.active}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Inactive / Transferred</CardTitle><ArrowRightLeft className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-500">{summaryStats.inactive}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Male Students</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.male}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Female Students</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.female}</div></CardContent></Card>
            </div>

            <StudentsByGradeChart />

            <Card>
                <CardHeader>
                    <CardTitle>All Students ({filteredStudents.length})</CardTitle>
                    <CardDescription>A list of all currently enrolled students.</CardDescription>
                    <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search students by name or email..."
                          className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Sex</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Average Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.age}</TableCell>
                                    <TableCell>{student.sex}</TableCell>
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
                    {filteredStudents.length === 0 && (
                        <p className="text-center text-muted-foreground py-10 col-span-full">No students found matching your search.</p>
                    )}
                </CardContent>
                {totalPages > 1 && (
                    <CardFooter className="flex items-center justify-end space-x-2 border-t pt-4">
                        <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            Next <ChevronRight className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
