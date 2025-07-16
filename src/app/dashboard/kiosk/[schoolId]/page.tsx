
'use client';
import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSchoolData } from '@/context/school-data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, School, Users, Presentation, TrendingUp, Trophy, Award, BarChart2, Briefcase, Lightbulb, Link as LinkIcon, Tv, Medal, Camera } from 'lucide-react';
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

// --- Kiosk-specific Slides ---

function KioskDashboardSlide({ school, allSchoolData }) {
    const isGlobal = school.profile.id === 'global';
    
    const summaryStats = useMemo(() => {
        if (isGlobal) {
            const schools = Object.values(allSchoolData);
            const totalStudents = schools.reduce((sum, school) => sum + school.students.length, 0);
            const totalTeachers = schools.reduce((sum, school) => sum + school.teachers.length, 0);
            return {
                totalSchools: schools.length,
                totalStudents,
                totalTeachers,
            };
        } else {
             const genderCounts = school.students.reduce((acc, student) => {
                acc[student.sex] = (acc[student.sex] || 0) + 1;
                return acc;
            }, { Male: 0, Female: 0 });
            return {
                totalStudents: school.students.length,
                totalTeachers: school.teachers.length,
                ...genderCounts
            };
        }
    }, [school, allSchoolData, isGlobal]);
    
    const chartData = useMemo(() => {
        if (isGlobal) {
             const schools = Object.values(allSchoolData);
             return schools.map(s => ({
                name: s.profile.name,
                students: s.students.length,
             })).sort((a,b) => b.students - a.students).slice(0, 10);
        } else {
            const gradeCounts = school.students.reduce((acc, student) => {
                const gradeKey = `Grade ${student.grade}`;
                acc[gradeKey] = (acc[gradeKey] || 0) + 1;
                return acc;
            }, {});
            return Object.entries(gradeCounts)
                .map(([name, students]) => ({ name, students }))
                .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
        }
    }, [school, allSchoolData, isGlobal]);

    const chartConfig = {
        students: { label: "Students", color: "hsl(var(--chart-1))" },
    } satisfies ChartConfig;

    return (
        <div className="p-8 h-full flex flex-col">
            <header className="flex items-center gap-4">
                 <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
                    <Image src={school.profile.logoUrl} alt={`${school.profile.name} Logo`} width={80} height={80} className="object-cover" data-ai-hint="school logo"/>
                </div>
                <div>
                    <h2 className="text-5xl font-bold">{school.profile.name}</h2>
                    <p className="text-2xl text-muted-foreground">{school.profile.motto}</p>
                </div>
            </header>
            <div className="flex-1 grid grid-cols-3 gap-8 mt-12">
                <div className="col-span-1 space-y-8">
                   <Card className="h-full">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">{isGlobal ? <School/> : <Users/>} {isGlobal ? 'Total Schools' : 'Total Students'}</CardTitle>
                     </CardHeader>
                     <CardContent className="text-center">
                        <p className="text-8xl font-bold text-primary">{isGlobal ? summaryStats.totalSchools : summaryStats.totalStudents}</p>
                        {!isGlobal && <p className="text-xl text-muted-foreground">{summaryStats.Male} Male, {summaryStats.Female} Female</p>}
                     </CardContent>
                   </Card>
                   <Card className="h-full">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">{isGlobal ? <Users/> : <Presentation/>} {isGlobal ? 'Total Students' : 'Total Teachers'}</CardTitle>
                     </CardHeader>
                     <CardContent className="text-center">
                        <p className="text-8xl font-bold text-primary">{isGlobal ? summaryStats.totalStudents?.toLocaleString() : summaryStats.totalTeachers}</p>
                        {isGlobal && <p className="text-xl text-muted-foreground">Across the network</p>}
                     </CardContent>
                   </Card>
                </div>
                <div className="col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-2xl">{isGlobal ? 'Top Schools by Enrollment' : 'Students by Grade'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={chartConfig} className="h-[400px] w-full">
                                <RechartsBarChart data={chartData} margin={{ top: 30 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 14 }}/>
                                    <YAxis tick={{ fontSize: 14 }} allowDecimals={false}/>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="students" fill="var(--color-students)" radius={5}>
                                        <LabelList dataKey="students" position="top" offset={8} className="fill-foreground" fontSize={16} />
                                    </Bar>
                                </RechartsBarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function KioskLeaderboardSlide({ school, allSchoolData }) {
    const isGlobal = school.profile.id === 'global';

    const topStudents = useMemo(() => {
        const studentList = isGlobal
            ? Object.values(allSchoolData).flatMap(s => s.students.map(student => ({...student, schoolName: s.profile.name})))
            : school.students;
        
        const gradeList = isGlobal
            ? Object.values(allSchoolData).flatMap(s => s.grades)
            : school.grades;

        return studentList.map(student => {
            const studentGrades = gradeList.filter(g => g.studentId === student.id).map(g => parseFloat(g.grade));
            const avgGrade = studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g, 0) / studentGrades.length : 0;
            return { ...student, avgGrade };
        })
        .sort((a,b) => b.avgGrade - a.avgGrade)
        .slice(0, 10);
    }, [school, allSchoolData, isGlobal]);

    const gradingSystem = isGlobal ? '20-Point' : school.profile.gradingSystem;

    return (
        <div className="p-8 h-full flex flex-col">
            <h2 className="text-5xl font-bold text-center mb-8 flex items-center justify-center gap-4"><Trophy /> {isGlobal ? 'Network' : 'School'} Leaderboard</h2>
            <Table className="text-2xl">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-3xl">Rank</TableHead>
                        <TableHead className="text-3xl">Student</TableHead>
                        {isGlobal && <TableHead className="text-3xl">School</TableHead>}
                        <TableHead className="text-right text-3xl">Average</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {topStudents.map((student, index) => (
                    <TableRow key={student.id}>
                        <TableCell className="font-bold text-4xl text-primary">{index + 1}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={`https://placehold.co/100x100.png`} alt={student.name} data-ai-hint="profile picture"/>
                                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-3xl">{student.name}</span>
                            </div>
                        </TableCell>
                        {isGlobal && <TableCell className="text-2xl">{student.schoolName}</TableCell>}
                        <TableCell className="text-right">
                             <Badge variant="secondary" className="text-3xl p-3">
                                {formatGradeDisplay(student.avgGrade, gradingSystem)}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
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

// --- Main Page Component ---
function KioskPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const { allSchoolData, isLoading } = useSchoolData();
  const [api, setApi] = useState<CarouselApi>();

  const school = useMemo(() => {
    if (!allSchoolData) return null;
    if (schoolId === 'global') {
        const anySchoolProfile = Object.values(allSchoolData)[0].profile;
        return { 
          profile: { 
            ...anySchoolProfile,
            id: 'global', 
            name: 'EduManage Network', 
            motto: 'Showcasing Excellence Across All Schools', 
            logoUrl: 'https://placehold.co/100x100.png',
            kioskConfig: { showDashboard: true, showLeaderboard: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false },
          },
          ...Object.values(allSchoolData)[0], // Provide some default data to prevent crashes, although it won't be used for global slides
          students: [], teachers: [], grades: []
        };
    }
    return allSchoolData[schoolId];
  }, [schoolId, allSchoolData]);
  
  const slides = useMemo(() => {
    if (!school) return [];
    
    const kioskConfig = school.profile.kioskConfig;
    const allPossibleSlides = [];
    const isGlobal = schoolId === 'global';

    // Define the full order of potential slides
    if (isGlobal) {
        allPossibleSlides.push({ id: 'marketing-who', enabled: true, component: <KioskMarketingSlide title="Who We Are" description="EduManage is a catalyst for educational transformation, empowering schools with AI-driven tools to reduce administrative overhead and elevate academic standards." icon={Lightbulb} /> });
        allPossibleSlides.push({ id: 'marketing-goal', enabled: true, component: <KioskMarketingSlide title="Our Goal & Mission" description="Our mission is to make modern educational technology accessible and affordable for institutions across Southern Africa, starting with Mozambique, fostering a new era of data-driven, efficient, and impactful education." icon={Briefcase} /> });
    }
    
    allPossibleSlides.push({ id: 'dashboard', enabled: kioskConfig?.showDashboard || isGlobal, component: <KioskDashboardSlide school={school} allSchoolData={allSchoolData} /> });
    allPossibleSlides.push({ id: 'leaderboard', enabled: kioskConfig?.showLeaderboard || isGlobal, component: <KioskLeaderboardSlide school={school} allSchoolData={allSchoolData} /> });
    
    if (isGlobal) {
         allPossibleSlides.push({ id: 'marketing-connect', enabled: true, component: <KioskMarketingSlide title="Join the EduManage Family" description="Connect your school to a powerful, unified ecosystem. Boost efficiency, empower your teachers, and unlock data-driven insights for student success." icon={LinkIcon}>
            <p className="text-2xl mt-8">Contact us at +258 845479481 to request a demo.</p>
         </KioskMarketingSlide> });
    }

    // Filter to get only the enabled slides
    return allPossibleSlides.filter(slide => slide.enabled);
  }, [school, allSchoolData, schoolId]);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 15000); // Cycle every 15 seconds

    return () => clearInterval(interval);
  }, [api]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (!school) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle>Error: School Not Found</CardTitle>
            <CardDescription>The requested school ID "{schoolId}" does not exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  if (slides.length === 0) {
    return (
        <div className="flex h-screen items-center justify-center p-8">
            <Card className="w-full max-w-2xl text-center">
                 <CardHeader>
                    <Tv className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <CardTitle>Kiosk Mode is Not Configured</CardTitle>
                    <CardDescription>The administrator for {school.profile.name} has not enabled any display slides for the public kiosk.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Please go to Dashboard &gt; Settings to configure the kiosk slides.</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <Carousel setApi={setApi} className="w-full h-screen">
      <CarouselContent>
        {slides.map(slide => (
            <CarouselItem key={slide.id}>{slide.component}</CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default function KioskPageWrapper() {
  // The Kiosk page needs access to the SchoolDataProvider but not authentication.
  // We can wrap it in a simplified provider setup.
  return (
      <SchoolDataProvider>
        <KioskPage />
      </SchoolDataProvider>
  );
}
