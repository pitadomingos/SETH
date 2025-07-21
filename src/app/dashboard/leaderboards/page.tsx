
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSchoolData, Attendance, Student } from '@/context/school-data-context';
import { Award, Trophy, BookOpen, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { formatGradeDisplay } from '@/lib/utils';

// --- Holistic Score Calculation ---
const calculateHolisticScore = (student: Student, allGrades: any[], allAttendance: any[]) => {
    // Academic Score (60%)
    const studentGrades = allGrades.filter(g => g.studentId === student.id).map(g => parseFloat(g.grade));
    const avgGrade = studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g, 0) / studentGrades.length : 0;
    const academicScore = (avgGrade / 20) * 60;

    // Attendance Score (20%)
    const studentAttendance = allAttendance.filter(a => a.studentId === student.id);
    const attendedCount = studentAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const attendanceRate = studentAttendance.length > 0 ? (attendedCount / studentAttendance.length) * 100 : 100; // Default to 100 if no records
    const attendanceScore = (attendanceRate / 100) * 20;

    // Behavioral Score (20%)
    let behaviorScore = 0;
    if (student.behavioralAssessments && student.behavioralAssessments.length > 0) {
        const totalScore = student.behavioralAssessments.reduce((sum, assessment) => sum + assessment.respect + assessment.participation + assessment.socialSkills + assessment.conduct, 0);
        const totalItems = student.behavioralAssessments.length * 4;
        const avgBehavior = totalScore / totalItems;
        // Normalize from 1-5 scale to 0-1, then multiply by weight
        behaviorScore = ((avgBehavior - 1) / 4) * 20;
    } else {
        // Default to average score (3/5) if no assessments
        behaviorScore = ( (3 - 1) / 4 ) * 20;
    }
    
    return academicScore + attendanceScore + behaviorScore;
};


// --- Components ---

const LeaderboardTable = ({ students, gradingSystem }: { students: any[], gradingSystem?: string }) => {
    if (!students || students.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No data available for this selection.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right">Holistic Score</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.slice(0, 10).map((student, index) => {
                    return (
                        <TableRow key={student.id}>
                            <TableCell className="font-bold text-lg text-primary">{index + 1}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={`https://placehold.co/100x100.png`} alt={student.name} data-ai-hint="profile picture" />
                                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-xs text-muted-foreground">Grade {student.grade} - {student.class}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                 <Badge variant="secondary" className="text-base">
                                    {student.holisticScore.toFixed(2)}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    );
                })}
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
          holisticScore: calculateHolisticScore(student, school.grades, school.attendance),
        })).sort((a, b) => b.holisticScore - a.holisticScore),
        gradingSystem: school.profile.gradingSystem,
        attendance: school.attendance,
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
      const schoolData = allSchoolData[schoolId];
      const schoolGrades = schoolData.grades;
      const studentSubjects = [...new Set(schoolGrades.filter(g => g.studentId === student.id).map(g => g.subject))];

      return studentSubjects.map(subject => {
          const subjectGradesForSchool = schoolGrades.filter(g => g.subject === subject);
          const studentIdsInSubject = [...new Set(subjectGradesForSchool.map(g => g.studentId))];
          
          const rankedStudents = studentIdsInSubject.map(sId => {
              const sInfo = schoolData.students.find(s => s.id === sId);
              if (!sInfo) return null;
              const holisticScore = calculateHolisticScore(sInfo, subjectGradesForSchool, schoolData.attendance);
              return { id: sId, holisticScore };
          }).filter(Boolean).sort((a, b) => b.holisticScore - a.holisticScore);

          const rankInfo = getRank(student.id, rankedStudents);
          return { subject, ...rankInfo };
      }).sort((a, b) => a.rank - b.rank);
  };
  
  const headerTitle = role === 'Parent' ? "My Children's Rankings" : "My Academic Rankings";
  const headerDescription = role === 'Parent'
    ? "A detailed look at your children's performance for the 2024-2025 year."
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
          const studentAttendance = allStudentsWithScoreBySchool[child.schoolId!]?.attendance || [];
          const attendanceSummary = studentAttendance.filter(a => a.studentId === child.id).reduce((acc, record) => {
            acc[record.status.toLowerCase()] = (acc[record.status.toLowerCase()] || 0) + 1;
            return acc;
          }, { present: 0, late: 0, absent: 0, sick: 0 });

          return (
            <Card key={child.id}>
              <CardHeader>
                <CardTitle>{child.name}</CardTitle>
                <CardDescription>{child.schoolName} - Grade {child.grade}, Class {child.class}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
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
                 <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2"><CalendarCheck className="text-primary"/> Attendance Summary</h3>
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                        <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Present</span><span className="font-bold text-green-600">{attendanceSummary.present}</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Late</span><span className="font-bold text-orange-500">{attendanceSummary.late}</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Absent</span><span className="font-bold text-red-500">{attendanceSummary.absent}</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Sick</span><span className="font-bold text-blue-500">{attendanceSummary.sick}</span></div>
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
    const { studentsData, classesData, grades, schoolProfile, coursesData, teachersData, attendance } = useSchoolData();
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    
    const gradingSystem = schoolProfile?.gradingSystem;

    const allStudentsWithScore = useMemo(() => studentsData.map(student => ({
        ...student,
        holisticScore: calculateHolisticScore(student, grades, attendance),
    })).sort((a, b) => b.holisticScore - a.holisticScore), [studentsData, grades, attendance]);
    
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
        return studentsInClass.sort((a, b) => b.holisticScore - a.holisticScore);
    }, [selectedClass, classesData, allStudentsWithScore]);

    const topStudentsBySubject = useMemo(() => {
        if (!selectedSubject) return [];
        const subjectGrades = grades.filter(g => g.subject === selectedSubject);
        const studentIdsInSubject = [...new Set(subjectGrades.map(g => g.studentId))];
        
        const rankedStudents = studentIdsInSubject.map(studentId => {
            const studentInfo = studentsData.find(s => s.id === studentId);
            if (!studentInfo) return null;
            return {
                ...studentInfo,
                holisticScore: calculateHolisticScore(studentInfo, subjectGrades, attendance),
            };
        }).filter(Boolean).sort((a, b) => b.holisticScore - a.holisticScore);

        return rankedStudents;
    }, [selectedSubject, grades, studentsData, attendance]);

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
                            <CardDescription>Top 10 students across all grades based on a holistic score including academics, attendance, and behavior.</CardDescription>
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
