
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSchoolData } from '@/context/school-data-context';
import { Award, Trophy, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { formatGradeDisplay } from '@/lib/utils';

// --- Grade Calculation Helpers ---
const calculateAverageScore = (studentId: string, grades: any[]) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    const totalPoints = studentGrades.reduce((acc, g) => acc + parseFloat(g.grade), 0);
    return (totalPoints / studentGrades.length);
};


// --- Components ---

const LeaderboardTable = ({ students, gradingSystem }) => {
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
                    <TableHead className="text-right">Average Grade</TableHead>
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
                                {formatGradeDisplay(student.averageScore, gradingSystem)}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};


const IndividualRankingView = () => {
  const { role } = useAuth();
  const { studentsData, allSchoolData } = useSchoolData();

  const allStudentsWithScoreBySchool = useMemo(() => {
    if (!allSchoolData) return {};
    const data = {};
    for (const schoolId in allSchoolData) {
      const school = allSchoolData[schoolId];
      data[schoolId] = {
        students: school.students.map(student => ({
          ...student,
          averageScore: calculateAverageScore(student.id, school.grades),
        })).sort((a, b) => b.averageScore - a.averageScore),
        gradingSystem: school.profile.gradingSystem,
      };
    }
    return data;
  }, [allSchoolData]);

  const getRank = (studentId, rankedList) => {
    if (!rankedList) return { rank: 0, total: 0 };
    const rank = rankedList.findIndex(s => s.id === studentId) + 1;
    return { rank, total: rankedList.length };
  };

  const getSubjectRanks = (student, schoolId) => {
      if (!allSchoolData || !allSchoolData[schoolId]) return [];
      const schoolGrades = allSchoolData[schoolId]?.grades || [];
      const studentSubjects = [...new Set(schoolGrades.filter(g => g.studentId === student.id).map(g => g.subject))];

      return studentSubjects.map(subject => {
          const subjectGradesForSchool = schoolGrades.filter(g => g.subject === subject);
          const studentIdsInSubject = [...new Set(subjectGradesForSchool.map(g => g.studentId))];
          
          const rankedStudents = studentIdsInSubject.map(sId => {
              const avgScore = calculateAverageScore(sId, subjectGradesForSchool);
              return { id: sId, averageScore: avgScore };
          }).sort((a, b) => b.averageScore - a.averageScore);

          const rankInfo = getRank(student.id, rankedStudents);
          return { subject, ...rankInfo };
      }).sort((a, b) => a.rank - b.rank);
  };
  
  const headerTitle = role === 'Parent' ? "My Children's Rankings" : "My Academic Rankings";
  const headerDescription = role === 'Parent'
    ? "A detailed look at your children's academic performance for the 2024-2025 year."
    : "A detailed look at your academic performance for the 2024-2025 year.";


  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Trophy /> {headerTitle}</h2>
        <p className="text-muted-foreground">{headerDescription}</p>
      </header>
      <div className="space-y-6">
        {studentsData.map(child => {
          const schoolRanks = allStudentsWithScoreBySchool[child.schoolId!]?.students || [];
          const classRanks = schoolRanks.filter(s => s.grade === child.grade && s.class === child.class);
          
          const overallRank = getRank(child.id, schoolRanks);
          const classRank = getRank(child.id, classRanks);
          const subjectRanks = getSubjectRanks(child, child.schoolId!);

          return (
            <Card key={child.id}>
              <CardHeader>
                <CardTitle>{child.name}</CardTitle>
                <CardDescription>{child.schoolName} - Grade {child.grade}, Class {child.class}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2"><Trophy className="text-primary"/> Overall & Class Rank</h3>
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">School Rank</span>
                          <span className="font-bold">{overallRank.rank > 0 ? `${overallRank.rank} / ${overallRank.total}` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Class Rank</span>
                          <span className="font-bold">{classRank.rank > 0 ? `${classRank.rank} / ${classRank.total}` : 'N/A'}</span>
                      </div>
                  </div>
                </div>
                 <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2"><BookOpen className="text-primary"/> Subject Ranks</h3>
                    <div className="p-4 bg-muted rounded-lg space-y-2 max-h-48 overflow-y-auto">
                       {subjectRanks.length > 0 ? subjectRanks.map(sr => (
                           <div key={sr.subject} className="flex justify-between items-center text-sm">
                               <span className="text-muted-foreground">{sr.subject}</span>
                               <span className="font-bold">{sr.rank > 0 ? `${sr.rank} / ${sr.total}` : 'N/A'}</span>
                           </div>
                       )) : <p className="text-sm text-muted-foreground">No subject ranks available.</p>}
                    </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};


export default function LeaderboardsPage() {
    const { role, user } = useAuth();
    const { studentsData, classesData, grades, schoolProfile, coursesData, teachersData } = useSchoolData();
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const gradingSystem = schoolProfile?.gradingSystem;

    const allStudentsWithScore = useMemo(() => studentsData.map(student => ({
        ...student,
        averageScore: calculateAverageScore(student.id, grades),
    })).sort((a, b) => b.averageScore - a.averageScore), [studentsData, grades]);
    
    const teacherInfo = useMemo(() => {
        if (role !== 'Teacher' || !user) return null;
        return teachersData.find(t => t.email === user.email);
    }, [role, user, teachersData]);

    const teacherClasses = useMemo(() => {
        if (!teacherInfo) return classesData; // Admins see all
        const teacherCourseClassIds = coursesData
            .filter(c => c.teacherId === teacherInfo.id)
            .map(c => c.classId);
        return classesData.filter(c => teacherCourseClassIds.includes(c.id));
    }, [teacherInfo, classesData, coursesData]);


    const subjects = useMemo(() => [...new Set(grades.map(g => g.subject))], [grades]);

    const topStudentsInClass = useMemo(() => {
        if (!selectedClass) return [];
        const classInfo = classesData.find(c => c.id === selectedClass);
        if (!classInfo) return [];

        const studentsInClass = allStudentsWithScore.filter(s =>
            s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim()
        );
        return studentsInClass.sort((a, b) => b.averageScore - a.averageScore);
    }, [selectedClass, classesData, allStudentsWithScore]);

    const topStudentsBySubject = useMemo(() => {
        if (!selectedSubject) return [];
        const subjectGrades = grades.filter(g => g.subject === selectedSubject);
        const studentIdsInSubject = [...new Set(subjectGrades.map(g => g.studentId))];
        
        const rankedStudents = studentIdsInSubject.map(studentId => {
            const studentInfo = studentsData.find(s => s.id === studentId);
            const avgScore = calculateAverageScore(studentId, subjectGrades);
            return {
                ...studentInfo,
                id: studentId,
                averageScore: avgScore,
            };
        }).sort((a, b) => b.averageScore - a.averageScore);

        return rankedStudents;
    }, [selectedSubject, grades, studentsData]);

    if (role === 'Parent' || role === 'Student') {
        return <IndividualRankingView />;
    }

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Trophy /> Leaderboards</h2>
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
                            <CardDescription>Top 10 students across all grades based on calculated average score.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LeaderboardTable students={allStudentsWithScore} gradingSystem={gradingSystem} />
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
                                        {teacherClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <LeaderboardTable students={topStudentsInClass} gradingSystem={gradingSystem}/>
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
                           <LeaderboardTable students={topStudentsBySubject} gradingSystem={gradingSystem}/>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
