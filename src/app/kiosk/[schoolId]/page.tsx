
'use client';
import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSchoolData, SchoolData } from '@/context/school-data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, School, Users, Presentation, TrendingUp, Trophy, Award, BarChart2, Briefcase, Lightbulb, Link as LinkIcon, Tv, Medal, Camera, Building } from 'lucide-react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getGpaFromNumeric, formatGradeDisplay } from '@/lib/utils';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, LabelList, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SchoolDataProvider } from '@/context/school-data-context';

// --- Global Kiosk Slides ---

function KioskGlobalDashboardSlide({ allSchoolData }) {
    const summaryStats = useMemo(() => {
        const schools = Object.values(allSchoolData);
        const totalStudents = schools.reduce((sum, school) => sum + school.students.length, 0);
        const totalTeachers = schools.reduce((sum, school) => sum + school.teachers.length, 0);
        return { totalSchools: schools.length, totalStudents, totalTeachers };
    }, [allSchoolData]);
    
    const chartData = useMemo(() => {
        return Object.values(allSchoolData).map(s => ({
            name: s.profile.name,
            students: s.students.length,
        })).sort((a,b) => b.students - a.students).slice(0, 10);
    }, [allSchoolData]);

    const chartConfig = { students: { label: "Students", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;

    return (
        <div className="p-8 h-full flex flex-col">
            <header className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
                    <Image src="https://placehold.co/100x100.png" alt="EduManage Network Logo" width={80} height={80} className="object-cover" data-ai-hint="logo building"/>
                </div>
                <div>
                    <h2 className="text-5xl font-bold">EduManage Network</h2>
                    <p className="text-2xl text-muted-foreground">Showcasing Excellence Across All Schools</p>
                </div>
            </header>
            <div className="flex-1 grid grid-cols-3 gap-8 mt-12">
                <div className="col-span-1 space-y-8">
                   <Card className="h-full"><CardHeader><CardTitle className="flex items-center gap-3 text-2xl"><School/> Total Schools</CardTitle></CardHeader><CardContent className="text-center"><p className="text-8xl font-bold text-primary">{summaryStats.totalSchools}</p></CardContent></Card>
                   <Card className="h-full"><CardHeader><CardTitle className="flex items-center gap-3 text-2xl"><Users/> Total Students</CardTitle></CardHeader><CardContent className="text-center"><p className="text-8xl font-bold text-primary">{summaryStats.totalStudents?.toLocaleString()}</p></CardContent></Card>
                </div>
                <div className="col-span-2">
                    <Card className="h-full">
                        <CardHeader><CardTitle className="text-2xl">Top Schools by Enrollment</CardTitle></CardHeader>
                        <CardContent>
                             <ChartContainer config={chartConfig} className="h-[400px] w-full">
                                <RechartsBarChart data={chartData} margin={{ top: 30 }}><CartesianGrid vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 14 }}/><YAxis tick={{ fontSize: 14 }} allowDecimals={false}/><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="students" fill="var(--color-students)" radius={5}><LabelList dataKey="students" position="top" offset={8} className="fill-foreground" fontSize={16} /></Bar></RechartsBarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function KioskStudentLeaderboardSlide({ topStudents, isGlobal, gradingSystem }) {
    return (
        <div className="p-8 h-full flex flex-col">
            <h2 className="text-5xl font-bold text-center mb-8 flex items-center justify-center gap-4"><Trophy /> {isGlobal ? 'Network' : 'School'} Top Students</h2>
            <Table className="text-2xl">
                <TableHeader><TableRow><TableHead className="w-[100px] text-3xl">Rank</TableHead><TableHead className="text-3xl">Student</TableHead>{isGlobal && <TableHead className="text-3xl">School</TableHead>}<TableHead className="text-right text-3xl">Average</TableHead></TableRow></TableHeader>
                <TableBody>
                {topStudents.map((student, index) => (
                    <TableRow key={student.id}><TableCell className="font-bold text-4xl text-primary">{index + 1}</TableCell>
                        <TableCell><div className="flex items-center gap-4"><Avatar className="h-16 w-16"><AvatarImage src="https://placehold.co/100x100.png" alt={student.name} data-ai-hint="profile picture"/><AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar><span className="font-medium text-3xl">{student.name}</span></div></TableCell>
                        {isGlobal && <TableCell className="text-2xl">{student.schoolName}</TableCell>}
                        <TableCell className="text-right"><Badge variant="secondary" className="text-3xl p-3">{formatGradeDisplay(student.avgGrade, gradingSystem)}</Badge></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    );
}

function KioskTeacherLeaderboardSlide({ allSchoolData }) {
    const topTeachers = useMemo(() => {
        if (!allSchoolData) return [];
        const allTeachers = Object.values(allSchoolData).flatMap(s => s.teachers.map(teacher => ({...teacher, schoolName: s.profile.name, schoolId: s.profile.id})));
        return allTeachers.map(teacher => {
          const school = allSchoolData[teacher.schoolId];
          if (!school) return { ...teacher, avgStudentGrade: 0 };
          const teacherCourses = school.courses.filter(c => c.teacherId === teacher.id);
          const studentIds = new Set(teacherCourses.flatMap(course => {
            const classInfo = school.classes.find(c => c.id === course.classId);
            return classInfo ? school.students.filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim()).map(s => s.id) : [];
          }));
          const teacherGrades = school.grades.filter(g => studentIds.has(g.studentId) && g.subject === teacher.subject).map(g => parseFloat(g.grade));
          const avgStudentGrade = teacherGrades.length > 0 ? teacherGrades.reduce((sum, g) => sum + g, 0) / teacherGrades.length : 0;
          return { ...teacher, avgStudentGrade };
        }).sort((a, b) => b.avgStudentGrade - a.avgStudentGrade).slice(0, 10);
    }, [allSchoolData]);

    return (
        <div className="p-8 h-full flex flex-col">
            <h2 className="text-5xl font-bold text-center mb-8 flex items-center justify-center gap-4"><Presentation /> Network Top Teachers</h2>
            <Table className="text-2xl">
                <TableHeader><TableRow><TableHead className="w-[100px] text-3xl">Rank</TableHead><TableHead className="text-3xl">Teacher</TableHead><TableHead className="text-3xl">School</TableHead><TableHead className="text-right text-3xl">Avg. Student Grade</TableHead></TableRow></TableHeader>
                <TableBody>
                {topTeachers.map((teacher, index) => (
                    <TableRow key={teacher.id}><TableCell className="font-bold text-4xl text-primary">{index + 1}</TableCell>
                        <TableCell><div className="flex items-center gap-4"><Avatar className="h-16 w-16"><AvatarImage src="https://placehold.co/100x100.png" alt={teacher.name} data-ai-hint="profile picture"/><AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar><span className="font-medium text-3xl">{teacher.name}</span></div></TableCell>
                        <TableCell className="text-2xl">{teacher.schoolName}</TableCell><TableCell className="text-right"><Badge variant="secondary" className="text-3xl p-3">{teacher.avgStudentGrade.toFixed(2)}/20</Badge></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    );
}

function AllSchoolsSlide({ allSchoolData }) {
    return (
        <div className="p-8 h-full flex flex-col">
            <h2 className="text-5xl font-bold text-center mb-8 flex items-center justify-center gap-4"><Building /> Our Schools Network</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-2">
                {Object.values(allSchoolData).map(school => (
                    <Card key={school.profile.id}>
                        <CardHeader className="flex flex-row items-center gap-4"><Image src={school.profile.logoUrl} alt={school.profile.name} width={64} height={64} className="rounded-lg" data-ai-hint="school logo"/><div><CardTitle>{school.profile.name}</CardTitle><CardDescription>"{school.profile.motto}"</CardDescription></div></CardHeader>
                        <CardContent><div className="flex items-center gap-3 p-3 bg-muted rounded-md"><Avatar className="h-12 w-12"><AvatarImage src="https://placehold.co/100x100.png" alt={school.profile.head} data-ai-hint="profile picture"/><AvatarFallback>{school.profile.head.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar><div><p className="font-semibold">{school.profile.head}</p><p className="text-xs text-muted-foreground">Head of School</p></div></div></CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function KioskMarketingSlide({ title, description, icon: Icon, children }) {
    return (
        <div className="p-16 h-full flex flex-col items-center justify-center text-center bg-primary/5">
            <Icon className="h-24 w-24 text-primary mb-8" />
            <h2 className="text-6xl font-bold">{title}</h2>
            <p className="text-3xl text-muted-foreground mt-4 max-w-4xl">{description}</p>
            {children}
        </div>
    );
}

// --- School-Specific Slides ---

function SchoolDashboardSlide({ school }) {
    const genderCounts = school.students.reduce((acc, student) => { acc[student.sex] = (acc[student.sex] || 0) + 1; return acc; }, { Male: 0, Female: 0 });
    const chartData = useMemo(() => {
        const gradeCounts = school.students.reduce((acc, student) => {
            const gradeKey = `Grade ${student.grade}`;
            acc[gradeKey] = (acc[gradeKey] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(gradeCounts).map(([name, students]) => ({ name, students })).sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
    }, [school.students]);
    const chartConfig = { students: { label: "Students", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;

    return (
        <div className="p-8 h-full flex flex-col">
            <header className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden"><Image src={school.profile.logoUrl} alt={`${school.profile.name} Logo`} width={80} height={80} className="object-cover" data-ai-hint="school logo"/></div>
                <div><h2 className="text-5xl font-bold">{school.profile.name}</h2><p className="text-2xl text-muted-foreground">{school.profile.motto}</p></div>
            </header>
            <div className="flex-1 grid grid-cols-3 gap-8 mt-12">
                <div className="col-span-1 space-y-8">
                   <Card className="h-full"><CardHeader><CardTitle className="flex items-center gap-3 text-2xl"><Users/> Total Students</CardTitle></CardHeader><CardContent className="text-center"><p className="text-8xl font-bold text-primary">{school.students.length}</p><p className="text-xl text-muted-foreground">{genderCounts.Male} Male, {genderCounts.Female} Female</p></CardContent></Card>
                   <Card className="h-full"><CardHeader><CardTitle className="flex items-center gap-3 text-2xl"><Presentation/> Total Teachers</CardTitle></CardHeader><CardContent className="text-center"><p className="text-8xl font-bold text-primary">{school.teachers.length}</p></CardContent></Card>
                </div>
                <div className="col-span-2"><Card className="h-full"><CardHeader><CardTitle className="text-2xl">Students by Grade</CardTitle></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-[400px] w-full"><RechartsBarChart data={chartData} margin={{ top: 30 }}><CartesianGrid vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 14 }}/><YAxis tick={{ fontSize: 14 }} allowDecimals={false}/><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="students" fill="var(--color-students)" radius={5}><LabelList dataKey="students" position="top" offset={8} className="fill-foreground" fontSize={16} /></Bar></RechartsBarChart></ChartContainer></CardContent></Card></div>
            </div>
        </div>
    );
}

function KioskPerformersSlide({ topStudents, topTeachers, schoolName, gradingSystem }) {
    return (
        <div className="p-8 h-full flex flex-col">
            <h2 className="text-5xl font-bold text-center mb-8 flex items-center justify-center gap-4"><Medal /> Top Performers & Staff of {schoolName}</h2>
            <div className="grid grid-cols-2 gap-8 flex-1">
                <div><h3 className="text-3xl font-semibold mb-4 text-center">Top Students</h3>
                    <Table><TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Student</TableHead><TableHead className="text-right">Average</TableHead></TableRow></TableHeader>
                        <TableBody>{topStudents.map((s, i) => (<TableRow key={s.id}><TableCell className="font-bold text-xl">{i+1}</TableCell><TableCell className="font-medium">{s.name}</TableCell><TableCell className="text-right"><Badge variant="secondary">{formatGradeDisplay(s.avgGrade, gradingSystem)}</Badge></TableCell></TableRow>))}</TableBody>
                    </Table>
                </div>
                <div><h3 className="text-3xl font-semibold mb-4 text-center">Top Teachers</h3>
                     <Table><TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Teacher</TableHead><TableHead className="text-right">Avg. Student Grade</TableHead></TableRow></TableHeader>
                        <TableBody>{topTeachers.map((t, i) => (<TableRow key={t.id}><TableCell className="font-bold text-xl">{i+1}</TableCell><TableCell className="font-medium">{t.name}</TableCell><TableCell className="text-right"><Badge variant="secondary">{t.avgGrade.toFixed(2)}</Badge></TableCell></TableRow>))}</TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

function KioskShowcaseSlide({ media }) {
    return (
        <div className="p-8 h-full flex flex-col items-center justify-center bg-muted">
            <Carousel opts={{ loop: true }} className="w-full max-w-5xl">
                <CarouselContent>
                    {media.map(item => (
                        <CarouselItem key={item.id} className="flex flex-col items-center justify-center">
                            <div className="aspect-video w-full relative mb-4 rounded-lg overflow-hidden shadow-2xl">
                                {item.type === 'image' 
                                    ? <Image src={item.url} alt={item.title} layout="fill" objectFit="cover" data-ai-hint="event photo school"/>
                                    : <video src={item.url} className="w-full h-full object-cover" controls autoPlay muted loop data-ai-hint="event video school"/>
                                }
                            </div>
                            <h3 className="text-3xl font-bold">{item.title}</h3>
                            <p className="text-xl text-muted-foreground">{item.description}</p>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}

// --- Main Page Component ---
function KioskPage({ allSchoolData }: { allSchoolData: Record<string, SchoolData> }) {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const [api, setApi] = useState<CarouselApi>();

  const school = useMemo(() => allSchoolData?.[schoolId], [schoolId, allSchoolData]);
  const isGlobal = schoolId === 'global';

  // Standalone default config for the global kiosk.
  const globalKioskConfig = useMemo(() => ({
      showDashboard: true,
      showLeaderboard: true,
      showTeacherLeaderboard: true,
      showAllSchools: true,
      showShowcase: true, // For marketing slides
      showAttendance: false,
      showAcademics: false,
      showAwards: false,
      showPerformers: false,
      showAwardWinner: false,
  }), []);

  const slides = useMemo(() => {
    if (isGlobal) {
      if (!allSchoolData) return [];
      const globalSlides = [];
      if(globalKioskConfig.showShowcase) {
          globalSlides.push({ id: 'marketing-who', component: <KioskMarketingSlide title="Who We Are" description="EduManage is a catalyst for educational transformation, empowering schools with AI-driven tools to reduce administrative overhead and elevate academic standards." icon={Lightbulb} /> });
          globalSlides.push({ id: 'marketing-goal', component: <KioskMarketingSlide title="Our Goal & Mission" description="Our mission is to make modern educational technology accessible and affordable for institutions across Southern Africa, fostering a new era of data-driven, efficient, and impactful education." icon={Briefcase} /> });
      }
      if(globalKioskConfig.showDashboard) globalSlides.push({ id: 'dashboard', component: <KioskGlobalDashboardSlide allSchoolData={allSchoolData} /> });
      if(globalKioskConfig.showLeaderboard) {
          const topStudents = Object.values(allSchoolData).flatMap(s => s.students.map(student => {
            const avgGrade = s.grades.filter(g => g.studentId === student.id).reduce((sum, g) => sum + parseFloat(g.grade), 0) / (s.grades.filter(g => g.studentId === student.id).length || 1);
            return {...student, schoolName: s.profile.name, avgGrade: isNaN(avgGrade) ? 0 : avgGrade};
          })).sort((a,b)=>b.avgGrade - a.avgGrade).slice(0,10);
          globalSlides.push({ id: 'leaderboard', component: <KioskStudentLeaderboardSlide topStudents={topStudents} isGlobal={true} gradingSystem="20-Point" /> });
      }
      if(globalKioskConfig.showTeacherLeaderboard) globalSlides.push({ id: 'teacher-leaderboard', component: <KioskTeacherLeaderboardSlide allSchoolData={allSchoolData} /> });
      if(globalKioskConfig.showAllSchools) globalSlides.push({ id: 'all-schools', component: <AllSchoolsSlide allSchoolData={allSchoolData} /> });
      if(globalKioskConfig.showShowcase) {
          globalSlides.push({ id: 'marketing-connect', component: <KioskMarketingSlide title="Join the EduManage Family" description="Connect your school to a powerful, unified ecosystem. Boost efficiency, empower your teachers, and unlock data-driven insights for student success." icon={LinkIcon}><p className="text-2xl mt-8">Contact us at +258 845479481 to request a demo.</p></KioskMarketingSlide> });
      }
      return globalSlides;
    }
    
    if (school) {
        const kioskConfig = school.profile.kioskConfig;
        const schoolSlides = [];
        if(kioskConfig.showDashboard) schoolSlides.push({ id: 'dashboard', component: <SchoolDashboardSlide school={school} /> });
        if(kioskConfig.showPerformers) {
          const topStudents = school.students.map(s => {
            const avgGrade = school.grades.filter(g => g.studentId === s.id).reduce((sum, g) => sum + parseFloat(g.grade), 0) / (school.grades.filter(g => g.studentId === s.id).length || 1);
            return {...s, avgGrade: isNaN(avgGrade) ? 0 : avgGrade};
          }).sort((a,b)=>b.avgGrade - a.avgGrade).slice(0,5);
          
          const topTeachers = school.teachers.map(t => {
            const teacherCourses = school.courses.filter(c => c.teacherId === t.id);
            const studentIds = new Set(teacherCourses.flatMap(course => {
                const classInfo = school.classes.find(c => c.id === course.classId);
                return classInfo ? school.students.filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim()).map(s => s.id) : [];
            }));
            const teacherGrades = school.grades.filter(g => studentIds.has(g.studentId) && g.subject === t.subject).map(g => parseFloat(g.grade));
            const avgStudentGrade = teacherGrades.length > 0 ? teacherGrades.reduce((sum, g) => sum + g, 0) / teacherGrades.length : 0;
            return { ...t, avgGrade: avgStudentGrade };
          }).sort((a, b) => b.avgGrade - a.avgGrade).slice(0,5);
          schoolSlides.push({ id: 'performers', component: <KioskPerformersSlide topStudents={topStudents} topTeachers={topTeachers} schoolName={school.profile.name} gradingSystem={school.profile.gradingSystem} /> });
        }
        if(kioskConfig.showShowcase && school.kioskMedia.length > 0) schoolSlides.push({ id: 'showcase', component: <KioskShowcaseSlide media={school.kioskMedia} /> });
        return schoolSlides;
    }
    
    return [];
  }, [school, allSchoolData, isGlobal, globalKioskConfig]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.canScrollNext() ? api.scrollNext() : api.scrollTo(0), 15000);
    return () => clearInterval(interval);
  }, [api]);

  if (!isGlobal && !school) return <div className="flex h-screen items-center justify-center"><Card className="w-full max-w-lg"><CardHeader className="text-center"><CardTitle>Error: School Not Found</CardTitle><CardDescription>The requested school ID "{schoolId}" does not exist.</CardDescription></CardHeader></Card></div>;
  
  const kioskConfig = isGlobal ? globalKioskConfig : school?.profile.kioskConfig;
  const isConfigured = kioskConfig && Object.values(kioskConfig).some(v => v === true);

  if (!isConfigured) return <div className="flex h-screen items-center justify-center p-8"><Card className="w-full max-w-2xl text-center"><CardHeader><Tv className="mx-auto h-16 w-16 text-muted-foreground mb-4" /><CardTitle>Kiosk Mode is Not Configured</CardTitle><CardDescription>The administrator for {school?.profile.name || 'Pixel Digital Solutions HQ'} has not enabled any display slides for the public kiosk.</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Please go to Dashboard &gt; Kiosk Showcase to configure the kiosk slides.</p></CardContent></Card></div>;
  
  if (slides.length === 0) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;

  return (
    <Carousel setApi={setApi} className="w-full h-screen"><CarouselContent>{slides.map(slide => <CarouselItem key={slide.id}>{slide.component}</CarouselItem>)}</CarouselContent></Carousel>
  );
}

function KioskPageWrapper() {
  const { allSchoolData, isLoading } = useSchoolData();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!allSchoolData) {
     return <div className="flex h-screen items-center justify-center"><p>Could not load school data.</p></div>;
  }
  
  return <KioskPage allSchoolData={allSchoolData} />;
}

export default function KioskPageContainer() {
  return (<SchoolDataProvider><KioskPageWrapper /></SchoolDataProvider>);
}
