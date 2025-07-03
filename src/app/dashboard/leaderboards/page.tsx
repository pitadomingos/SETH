'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { studentsData, classesData, grades } from '@/lib/mock-data';
import { Award } from 'lucide-react';

// Re-using the GPA map from admin dashboard
const gpaMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };

const calculateAverageGpa = (studentId: string) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    const totalPoints = studentGrades.reduce((acc, g) => acc + (gpaMap[g.grade] || 0), 0);
    return (totalPoints / studentGrades.length).toFixed(2);
};

const allStudentsWithGpa = studentsData.map(student => ({
    ...student,
    calculatedGpa: parseFloat(calculateAverageGpa(student.id)),
})).sort((a, b) => b.calculatedGpa - a.calculatedGpa);


const subjects = [...new Set(grades.map(g => g.subject))];

const LeaderboardTable = ({ students }) => {
    if (!students || students.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No data available for this selection.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">GPA / Score</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.slice(0, 10).map((student, index) => (
                    <TableRow key={student.id}>
                        <TableCell className="font-bold text-lg text-primary">{index + 1}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={`https://placehold.co/100x100.png`} alt={student.name} data-ai-hint="profile picture" />
                                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{student.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>Grade {student.grade} - {student.class}</TableCell>
                        <TableCell className="text-right">
                             <Badge variant="secondary" className="text-base">
                                {student.score || student.calculatedGpa}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default function LeaderboardsPage() {
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const topStudentsInClass = useMemo(() => {
        if (!selectedClass) return [];
        const classInfo = classesData.find(c => c.id === selectedClass);
        if (!classInfo) return [];

        const studentsInClass = allStudentsWithGpa.filter(s =>
            s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1]
        );
        return studentsInClass.sort((a, b) => b.calculatedGpa - a.calculatedGpa);
    }, [selectedClass]);

    const topStudentsBySubject = useMemo(() => {
        if (!selectedSubject) return [];
        const studentsBySubject = grades
            .filter(g => g.subject === selectedSubject)
            .reduce((acc, grade) => {
                if (!acc[grade.studentId]) {
                    acc[grade.studentId] = { totalPoints: 0, count: 0 };
                }
                acc[grade.studentId].totalPoints += gpaMap[grade.grade] || 0;
                acc[grade.studentId].count++;
                return acc;
            }, {});
        
        const rankedStudents = Object.keys(studentsBySubject).map(studentId => {
            const studentInfo = studentsData.find(s => s.id === studentId);
            const avgScore = (studentsBySubject[studentId].totalPoints / studentsBySubject[studentId].count).toFixed(2);
            return {
                ...studentInfo,
                id: studentId,
                score: parseFloat(avgScore),
            };
        }).sort((a, b) => b.score - a.score);

        return rankedStudents;
    }, [selectedSubject]);


    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header>
                <h2 className="text-3xl font-bold tracking-tight">Leaderboards</h2>
                <p className="text-muted-foreground">Recognizing top student achievements.</p>
            </header>

            <Tabs defaultValue="overall">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overall">Overall Top 10</TabsTrigger>
                    <TabsTrigger value="by-class">By Class</TabsTrigger>
                    <TabsTrigger value="by-subject">By Subject</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overall">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Award /> Overall Academic Champions</CardTitle>
                            <CardDescription>Top 10 students across all grades based on calculated GPA.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LeaderboardTable students={allStudentsWithGpa} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="by-class">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Students by Class</CardTitle>
                            <CardDescription>Select a class to view its top academic performers.</CardDescription>
                            <div className="pt-4">
                                <Select onValueChange={setSelectedClass}>
                                    <SelectTrigger className="w-[280px]">
                                        <SelectValue placeholder="Select a class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classesData.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <LeaderboardTable students={topStudentsInClass} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="by-subject">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Students by Subject</CardTitle>
                            <CardDescription>Select a subject to see the top performers across the school.</CardDescription>
                             <div className="pt-4">
                                <Select onValueChange={setSelectedSubject}>
                                    <SelectTrigger className="w-[280px]">
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <LeaderboardTable students={topStudentsBySubject} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
