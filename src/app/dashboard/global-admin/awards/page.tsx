'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Award, School, GraduationCap, Presentation, Star } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGpaFromNumeric, formatCurrency } from '@/lib/utils';

const calculateAverageGpaForSchool = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const totalPoints = grades.reduce((acc, g) => acc + getGpaFromNumeric(parseFloat(g.grade)), 0);
    return parseFloat((totalPoints / grades.length).toFixed(2));
};

export default function AwardsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();

  const isLoading = authLoading || schoolLoading;

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const topSchools = useMemo(() => {
    if (!allSchoolData) return [];
    return Object.values(allSchoolData)
      .map(school => ({
        id: school.profile.id,
        name: school.profile.name,
        avgGpa: calculateAverageGpaForSchool(school.grades),
      }))
      .sort((a, b) => b.avgGpa - a.avgGpa)
      .slice(0, 5);
  }, [allSchoolData]);

  const topStudents = useMemo(() => {
    if (!allSchoolData) return [];
    const allStudents = Object.values(allSchoolData).flatMap(s => s.students.map(student => ({...student, schoolName: s.profile.name})));
    const allGrades = Object.values(allSchoolData).flatMap(s => s.grades);
    
    return allStudents.map(student => {
        const studentGrades = allGrades.filter(g => g.studentId === student.id).map(g => parseFloat(g.grade));
        const avgGrade = studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g, 0) / studentGrades.length : 0;
        return { ...student, avgGrade };
    })
    .sort((a,b) => b.avgGrade - a.avgGrade)
    .slice(0, 10);
  }, [allSchoolData]);

  const topTeachers = useMemo(() => {
    if (!allSchoolData) return [];
    const allTeachers = Object.values(allSchoolData).flatMap(s => s.teachers.map(teacher => ({...teacher, schoolName: s.profile.name, schoolId: s.profile.id})));
    
    return allTeachers.map(teacher => {
      const school = allSchoolData[teacher.schoolId];
      const teacherCourses = school.courses.filter(c => c.teacherId === teacher.id);
      const studentIds = new Set<string>();
      teacherCourses.forEach(course => {
          const classInfo = school.classes.find(c => c.id === course.classId);
          if(classInfo) {
              school.students
                  .filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim())
                  .forEach(s => studentIds.add(s.id));
          }
      });
      const teacherGrades = school.grades
          .filter(g => studentIds.has(g.studentId) && g.subject === teacher.subject)
          .map(g => parseFloat(g.grade));
      
      const avgStudentGrade = teacherGrades.length > 0
          ? teacherGrades.reduce((sum, g) => sum + g, 0) / teacherGrades.length
          : 0;
      
      return { ...teacher, avgStudentGrade };
    })
    .sort((a, b) => b.avgStudentGrade - a.avgStudentGrade)
    .slice(0, 10);
  }, [allSchoolData]);

  if (isLoading || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const handleAnnounceWinners = () => {
    console.log("Announcing winners... (Functionality to be connected to backend)");
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">EduManage Excellence Awards</h2>
            <p className="text-muted-foreground">Manage and announce the annual awards for the top performers in the network.</p>
        </div>
        <Button onClick={handleAnnounceWinners}>
          <Star className="mr-2 h-4 w-4" /> Announce Winners
        </Button>
      </header>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><School /> Top Performing Schools</CardTitle>
            <CardDescription>Ranked by overall student Grade Point Average (GPA).</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>School</TableHead><TableHead className="text-right">Avg. GPA</TableHead></TableRow></TableHeader>
                <TableBody>
                  {topSchools.map((school, i) => ( 
                    <TableRow key={school.id}>
                        <TableCell className="font-bold text-lg">{i + 1}</TableCell>
                        <TableCell>{school.name}</TableCell>
                        <TableCell className="text-right font-medium">{school.avgGpa.toFixed(2)}</TableCell>
                    </TableRow> 
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GraduationCap /> Students of the Year</CardTitle>
            <CardDescription>The highest-achieving students across the entire network.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Student</TableHead><TableHead>School</TableHead><TableHead className="text-right">Avg. Grade</TableHead></TableRow></TableHeader>
                <TableBody>
                    {topStudents.map((student, i) => (
                    <TableRow key={student.id}>
                        <TableCell className="font-bold text-lg">{i + 1}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{student.name[0]}</AvatarFallback></Avatar>
                                <span>{student.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{student.schoolName}</TableCell>
                        <TableCell className="text-right font-medium">{student.avgGrade.toFixed(2)}/20</TableCell>
                    </TableRow> 
                    ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Presentation /> Teachers of the Year</CardTitle>
            <CardDescription>Teachers whose students demonstrated the highest average academic performance.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Teacher</TableHead><TableHead>School</TableHead><TableHead>Subject</TableHead><TableHead className="text-right">Avg. Student Grade</TableHead></TableRow></TableHeader>
                <TableBody>
                    {topTeachers.map((teacher, i) => (
                    <TableRow key={teacher.id}>
                        <TableCell className="font-bold text-lg">{i + 1}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{teacher.name[0]}</AvatarFallback></Avatar>
                                <span>{teacher.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{teacher.schoolName}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell className="text-right font-medium">{teacher.avgStudentGrade.toFixed(2)}/20</TableCell>
                    </TableRow> 
                    ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
