
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Award, School, GraduationCap, Presentation, Star, Medal, CheckCircle } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGpaFromNumeric } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const calculateAverageGpaForSchool = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const totalPoints = grades.reduce((acc, g) => acc + getGpaFromNumeric(parseFloat(g.grade)), 0);
    return parseFloat((totalPoints / grades.length).toFixed(2));
};

const rankingStyles = [
  { color: 'text-yellow-500', size: 'h-8 w-8', label: '1st Place' },
  { color: 'text-gray-400', size: 'h-6 w-6', label: '2nd Place' },
  { color: 'text-orange-600', size: 'h-6 w-6', label: '3rd Place' },
];

function AnnounceWinnersButton({ onAnnounce, hasBeenAnnounced }) {
  const { toast } = useToast();

  const handleAnnounce = () => {
    onAnnounce();
    toast({
      title: "Winners Announced!",
      description: "An event has been created on every school's calendar.",
    });
  };

  if (hasBeenAnnounced) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-semibold p-2 bg-green-500/10 rounded-md">
        <CheckCircle className="h-4 w-4" />
        <span>Awards for {new Date().getFullYear()} have been announced.</span>
      </div>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Star className="mr-2 h-4 w-4" /> Announce Winners
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Announcement</AlertDialogTitle>
          <AlertDialogDescription>
            This will create a public event on every school's calendar announcing the winners for this year. This action cannot be undone. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAnnounce}>Confirm & Announce</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default function AwardsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, announceAwards } = useSchoolData();
  const router = useRouter();
  const [hasAnnounced, setHasAnnounced] = useState(false);

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
        logoUrl: school.profile.logoUrl,
        avgGpa: calculateAverageGpaForSchool(school.grades),
      }))
      .sort((a, b) => b.avgGpa - a.avgGpa)
      .slice(0, 3);
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
    .slice(0, 3);
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
    .slice(0, 3);
  }, [allSchoolData]);

  if (isLoading || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const handleAnnounceWinners = () => {
    announceAwards();
    setHasAnnounced(true);
  };
  
  const AwardCard = ({ rank, children }) => {
    const isFirst = rank === 0;
    return (
        <Card className={cn(isFirst ? 'md:col-span-1' : '', 'flex flex-col')}>
            <CardHeader className="flex-row items-center gap-4">
                <Medal className={cn(rankingStyles[rank].color, rankingStyles[rank].size)} />
                <div className="flex-1">
                    <CardTitle>{rankingStyles[rank].label}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                {children}
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">EduManage Excellence Awards</h2>
            <p className="text-muted-foreground">Manage and announce the annual awards for the top performers in the network.</p>
        </div>
        <AnnounceWinnersButton onAnnounce={handleAnnounceWinners} hasBeenAnnounced={hasAnnounced} />
      </header>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-2xl font-semibold flex items-center gap-3 mb-4"><School /> Top Performing Schools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topSchools[0] && (
              <AwardCard rank={0}>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4 border-2 border-yellow-500">
                        <AvatarImage src={topSchools[0].logoUrl} data-ai-hint="school logo"/>
                        <AvatarFallback>{topSchools[0].name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p className="text-xl font-bold">{topSchools[0].name}</p>
                    <p className="text-3xl font-bold text-primary mt-2">{topSchools[0].avgGpa.toFixed(2)} GPA</p>
                  </div>
              </AwardCard>
            )}
            <div className="space-y-6">
              {topSchools[1] && (
                  <AwardCard rank={1}>
                     <div className="flex items-center gap-4">
                       <Avatar className="h-16 w-16 border-2 border-gray-400"><AvatarImage src={topSchools[1].logoUrl} data-ai-hint="school logo"/><AvatarFallback>{topSchools[1].name.substring(0, 2)}</AvatarFallback></Avatar>
                       <div>
                         <p className="font-bold">{topSchools[1].name}</p>
                         <p className="text-xl font-bold text-primary mt-1">{topSchools[1].avgGpa.toFixed(2)} GPA</p>
                       </div>
                     </div>
                  </AwardCard>
              )}
              {topSchools[2] && (
                  <AwardCard rank={2}>
                     <div className="flex items-center gap-4">
                       <Avatar className="h-16 w-16 border-2 border-orange-600"><AvatarImage src={topSchools[2].logoUrl} data-ai-hint="school logo"/><AvatarFallback>{topSchools[2].name.substring(0, 2)}</AvatarFallback></Avatar>
                       <div>
                         <p className="font-bold">{topSchools[2].name}</p>
                         <p className="text-xl font-bold text-primary mt-1">{topSchools[2].avgGpa.toFixed(2)} GPA</p>
                       </div>
                     </div>
                  </AwardCard>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold flex items-center gap-3 mb-4"><GraduationCap /> Students of the Year</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topStudents[0] && (
                <AwardCard rank={0}>
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4 border-2 border-yellow-500"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topStudents[0].name[0]}</AvatarFallback></Avatar>
                      <p className="text-xl font-bold">{topStudents[0].name}</p>
                      <p className="text-sm text-muted-foreground">{topStudents[0].schoolName}</p>
                      <p className="text-3xl font-bold text-primary mt-2">{topStudents[0].avgGrade.toFixed(2)}/20</p>
                    </div>
                </AwardCard>
              )}
               <div className="space-y-6">
                {topStudents[1] && (
                    <AwardCard rank={1}>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-2 border-gray-400"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topStudents[1].name[0]}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-bold">{topStudents[1].name}</p>
                            <p className="text-xs text-muted-foreground">{topStudents[1].schoolName}</p>
                            <p className="text-xl font-bold text-primary mt-1">{topStudents[1].avgGrade.toFixed(2)}/20</p>
                          </div>
                        </div>
                    </AwardCard>
                )}
                 {topStudents[2] && (
                    <AwardCard rank={2}>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-2 border-orange-600"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topStudents[2].name[0]}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-bold">{topStudents[2].name}</p>
                            <p className="text-xs text-muted-foreground">{topStudents[2].schoolName}</p>
                            <p className="text-xl font-bold text-primary mt-1">{topStudents[2].avgGrade.toFixed(2)}/20</p>
                          </div>
                        </div>
                    </AwardCard>
                )}
               </div>
           </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold flex items-center gap-3 mb-4"><Presentation /> Teachers of the Year</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topTeachers[0] && (
                <AwardCard rank={0}>
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4 border-2 border-yellow-500"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topTeachers[0].name[0]}</AvatarFallback></Avatar>
                      <p className="text-xl font-bold">{topTeachers[0].name}</p>
                      <p className="text-sm text-muted-foreground">{topTeachers[0].schoolName} - {topTeachers[0].subject}</p>
                      <p className="text-3xl font-bold text-primary mt-2">{topTeachers[0].avgStudentGrade.toFixed(2)}/20</p>
                      <p className="text-xs text-muted-foreground">Avg. Student Grade</p>
                    </div>
                </AwardCard>
              )}
               <div className="space-y-6">
                {topTeachers[1] && (
                    <AwardCard rank={1}>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-2 border-gray-400"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topTeachers[1].name[0]}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-bold">{topTeachers[1].name}</p>
                             <p className="text-xs text-muted-foreground">{topTeachers[1].schoolName} - {topTeachers[1].subject}</p>
                            <p className="text-xl font-bold text-primary mt-1">{topTeachers[1].avgStudentGrade.toFixed(2)}/20</p>
                          </div>
                        </div>
                    </AwardCard>
                )}
                 {topTeachers[2] && (
                    <AwardCard rank={2}>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-2 border-orange-600"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topTeachers[2].name[0]}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-bold">{topTeachers[2].name}</p>
                            <p className="text-xs text-muted-foreground">{topTeachers[2].schoolName} - {topTeachers[2].subject}</p>
                            <p className="text-xl font-bold text-primary mt-1">{topTeachers[2].avgStudentGrade.toFixed(2)}/20</p>
                          </div>
                        </div>
                    </AwardCard>
                )}
               </div>
           </div>
        </section>
      </div>
    </div>
  );
}
