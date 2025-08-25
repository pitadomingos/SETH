
'use client';
import { useMemo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { FileText as FileTextIcon, Trophy, CheckCircle, Download, XCircle, AlertTriangle, Loader2, ListChecks, HeartPulse, Sparkles, BookOpen, User, Check, Lightbulb, TrendingUp, BrainCircuit } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useSchoolData, Grade, Student } from "@/context/school-data-context";
import { useToast } from '@/hooks/use-toast';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from '@/components/ui/chart';
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import { formatGradeDisplay } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EndOfTermReportDialog } from '@/components/dashboard/end-of-term-report';
import { analyzeStudentPerformanceAction } from '@/app/actions/ai-actions';
import { StudentAnalysis } from '@/ai/flows/student-analysis-flow';
import { FeatureLock } from '../layout/feature-lock';

const calculateAverageNumericGrade = (studentId: string, grades: Grade[], subject?: string) => {
    if (!studentId || !grades) return 0;
    const studentGrades = subject 
        ? grades.filter(g => g.studentId === studentId && g.subject === subject)
        : grades.filter(g => g.studentId === studentId);
        
    if (studentGrades.length === 0) return 0;
    const totalPoints = studentGrades.reduce((acc, g) => acc + parseFloat(g.grade), 0);
    return (totalPoints / studentGrades.length);
};

function MyCourses({ student, studentCourses, grades, schoolProfile, teachersData }) {
    if (studentCourses.length === 0) {
        return (
            <Card>
                <CardHeader><CardTitle>My Courses</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">You are not enrolled in any courses yet.</p></CardContent>
            </Card>
        );
    }
    
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studentCourses.map(course => {
                const teacher = teachersData.find(t => t.id === course.teacherId);
                const avgGrade = calculateAverageNumericGrade(student.id, grades, course.subject);
                return (
                    <Card key={course.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl"><BookOpen className="text-primary"/> {course.subject}</CardTitle>
                            {teacher && <CardDescription className="flex items-center gap-2"><User className="h-4 w-4"/> {teacher.name}</CardDescription>}
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Your Average Grade</p>
                            <p className="text-4xl font-bold">{formatGradeDisplay(avgGrade, schoolProfile?.gradingSystem)}</p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

function StudentAIAdvisor({ student, grades, attendanceSummary }) {
    const [analysis, setAnalysis] = useState<StudentAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleAnalysis = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const gradeData = grades.map(g => ({
                subject: g.subject,
                grade: g.grade,
                type: g.type,
                description: g.description,
            }));

            const attendanceData = Object.entries(attendanceSummary).map(([status, count]) => ({ status, count: count as number }));

            const result = await analyzeStudentPerformanceAction({
                studentName: student.name,
                grades: gradeData,
                attendance: attendanceData,
            });
            setAnalysis(result);
        } catch (e) {
            console.error("AI Analysis failed:", e);
            toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not get AI-powered recommendations.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> Your AI Academic Advisor</CardTitle>
                <CardDescription>Get personalized insights and recommendations based on your performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!analysis && (
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-4">Click the button below to analyze your recent grades and attendance.</p>
                        <Button onClick={handleAnalysis} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                            Analyze My Performance
                        </Button>
                    </div>
                )}
                {analysis && (
                    <div className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-2"><Check className="text-green-500"/> Strengths</h3>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    {analysis.strengths.map((s,i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-2"><TrendingUp className="text-orange-500"/> Areas for Improvement</h3>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    {analysis.areasForImprovement.map((a,i) => <li key={i}>{a}</li>)}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="text-yellow-500"/> Recommendations</h3>
                             <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {analysis.recommendations.map((r,i) => <li key={i}>{r}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
            {analysis && (
                <CardFooter>
                    <Button variant="outline" onClick={() => setAnalysis(null)}>
                        Start a New Analysis
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

function RankCard({ studentId }) {
    const { studentsData, grades } = useSchoolData();
  
    const allStudentsWithAvg = useMemo(() => studentsData.map(student => ({
        ...student,
        avgNumeric: calculateAverageNumericGrade(student.id, grades),
    })).sort((a, b) => b.avgNumeric - a.avgNumeric), [studentsData, grades]);

    const studentRank = useMemo(() => {
        if (!studentId) return -1;
        return allStudentsWithAvg.findIndex(s => s.id === studentId) + 1;
    }, [allStudentsWithAvg, studentId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy /> School Rank</CardTitle>
                <CardDescription>Your overall academic position.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-6xl font-bold text-primary">{studentRank > 0 ? studentRank : 'N/A'}</p>
                <p className="text-muted-foreground">out of {allStudentsWithAvg.length} students</p>
            </CardContent>
            <CardFooter>
                 <Link href="/dashboard/leaderboards" passHref className="w-full">
                    <Button variant="outline" className="w-full">View Leaderboards</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

function AttendanceBreakdownChart({ studentId }) {
  const { attendance } = useSchoolData();
  const studentAttendance = attendance.filter(a => a.studentId === studentId);
  
  const breakdown = studentAttendance.reduce((acc, record) => {
    const statusKey = record.status.toLowerCase();
    acc[statusKey] = (acc[statusKey] || 0) + 1;
    return acc;
  }, { present: 0, late: 0, absent: 0, sick: 0});

  const chartData = [
    { status: 'present', value: breakdown.present, fill: 'var(--color-present)' },
    { status: 'late', value: breakdown.late, fill: 'var(--color-late)' },
    { status: 'absent', value: breakdown.absent, fill: 'var(--color-absent)' },
    { status: 'sick', value: breakdown.sick, fill: 'var(--color-sick)' },
  ];

  const chartConfig = {
    present: { label: 'Present', color: 'hsl(var(--chart-2))' },
    late: { label: 'Late', color: 'hsl(var(--chart-4))' },
    absent: { label: 'Absent', color: 'hsl(var(--destructive))' },
    sick: { label: 'Sick', icon: HeartPulse, color: 'hsl(var(--chart-3))' },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Attendance</CardTitle>
        <CardDescription>Your attendance this semester</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" nameKey="status" innerRadius={30} strokeWidth={5}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CompletionStatusAlert({ hasPassed, areAllFeesPaid }) {
  if (hasPassed && areAllFeesPaid) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Congratulations!</AlertTitle>
        <AlertDescription>
          You have met all academic and financial requirements for completion. You can now preview and download your official documents below.
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasPassed) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Academic Requirements Not Met</AlertTitle>
        <AlertDescription>Your average grade is below the passing requirement. Please use the AI Advisor below for recommendations on how to improve. You cannot download official documents at this time.</AlertDescription>
      </Alert>
    );
  }
  
  if (!areAllFeesPaid) {
    return (
      <Alert className="border-amber-500/50 text-amber-600 dark:border-amber-500 [&>svg]:text-amber-600">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Outstanding Balance</AlertTitle>
        <AlertDescription>
           You have an outstanding balance on your account. Please clear all pending fees to enable document previews and downloads.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

function AssignedTests({ student, studentClass }) {
    const { deployedTests, savedTests } = useSchoolData();

    const assigned = useMemo(() => {
        if (!student || !studentClass) return [];
        return deployedTests
            .filter(dt => dt.classId === studentClass.id && !dt.submissions.some(s => s.studentId === student.id))
            .map(dt => {
                const testDetails = savedTests.find(st => st.id === dt.testId);
                const deadlineDate = dt.deadline instanceof Date ? dt.deadline : new Date(dt.deadline);
                return { ...dt, ...testDetails, deadline: deadlineDate };
            })
            .sort((a,b) => a.deadline.getTime() - b.deadline.getTime());
    }, [student, studentClass, deployedTests, savedTests]);

    if (assigned.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListChecks /> Assigned Tests</CardTitle>
                <CardDescription>Tests you need to complete.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                {assigned.slice(0, 4).map(test => (
                    <li key={test.id} className="flex justify-between items-center text-sm p-3 bg-muted rounded-md">
                        <div>
                            <p className="font-semibold">{test.topic}</p>
                            <p className="text-xs text-muted-foreground">{test.subject}</p>
                        </div>
                        <div className="text-right">
                           <Link href={`/dashboard/test/${test.id}`} passHref>
                             <Button size="sm">Take Test</Button>
                           </Link>
                           <p className="text-xs text-muted-foreground mt-1">
                                Due {format(test.deadline, 'MMM d, yyyy')}
                           </p>
                        </div>
                    </li>
                ))}
                </ul>
            </CardContent>
        </Card>
    );
}


export default function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    grades,
    financeData,
    studentsData,
    attendance,
    schoolProfile,
    classesData,
    coursesData,
    teachersData
  } = useSchoolData();
  
  const student = useMemo(() => {
    if (!user?.email) return null;
    return studentsData.find(s => s.email === user.email);
  }, [studentsData, user]);

  const studentId = student?.id;

  const studentClass = useMemo(() => {
    if (!student) return null;
    return classesData.find(c => c.grade === student.grade && c.name.split('-')[1].trim() === student.class);
  }, [student, classesData]);

  const studentCourses = useMemo(() => {
    if (!studentClass) return [];
    return coursesData.filter(c => c.classId === studentClass.id);
  }, [studentClass, coursesData]);
  
  const studentGrades = useMemo(() => {
    if (!studentId) return [];
    return grades.filter(g => g.studentId === studentId);
  }, [grades, studentId]);

  const studentAttendanceSummary = useMemo(() => {
    if (!studentId) return { present: 0, late: 0, absent: 0, sick: 0 };
    const records = attendance.filter(a => a.studentId === studentId);
    return records.reduce((acc, record) => {
      const statusKey = record.status.toLowerCase();
      acc[statusKey] = (acc[statusKey] || 0) + 1;
      return acc;
    }, { present: 0, late: 0, absent: 0, sick: 0 });
  }, [attendance, studentId]);

  const hasPassed = useMemo(() => {
    if (!studentId) return false;
    const avg = calculateAverageNumericGrade(studentId, grades);
    return avg >= 12; // Passing grade is 12/20
  }, [studentId, grades]);

  const areAllFeesPaid = useMemo(() => {
    if (!studentId) return false;
    const studentFees = financeData.filter(f => f.studentId === studentId);
    if (studentFees.length === 0) return true;
    return studentFees.every(fee => (fee.totalAmount - fee.amountPaid) <= 0);
  }, [studentId, financeData]);
  
  const isEligibleForCompletion = hasPassed && areAllFeesPaid;

  const handleDownloadCertificate = () => {
    toast({
      title: "Certificate Download Started",
      description: "Your completion certificate is being prepared. (This is a demo feature)",
    });
  };

  const handleDownloadTranscript = () => {
    toast({
      title: "Transcript Download Started",
      description: "Your official transcript is being prepared. (This is a demo feature)",
    });
  };
  
  if (!student) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </header>
      
       <CompletionStatusAlert 
          hasPassed={hasPassed}
          areAllFeesPaid={areAllFeesPaid}
       />
      
       <div className="grid gap-6 lg:grid-cols-3">
          {schoolProfile?.tier !== 'Starter' 
              ? <StudentAIAdvisor student={student} grades={studentGrades} attendanceSummary={studentAttendanceSummary} />
              : <div className="lg:col-span-2"><FeatureLock featureName="AI Academic Advisor" /></div>
          }
          <RankCard studentId={studentId} />
       </div>
       <div className="grid gap-6 lg:grid-cols-2">
          <AssignedTests student={student} studentClass={studentClass} />
          <AttendanceBreakdownChart studentId={studentId} />
        </div>

       <Card>
            <CardHeader>
                <CardTitle>My Courses & Progress</CardTitle>
                <CardDescription>An overview of your performance in each subject.</CardDescription>
            </CardHeader>
            <CardContent>
                <MyCourses student={student} studentCourses={studentCourses} grades={grades} schoolProfile={schoolProfile} teachersData={teachersData} />
            </CardContent>
            <CardFooter>
                <EndOfTermReportDialog student={student} />
            </CardFooter>
        </Card>

       <Card>
            <CardHeader>
                <CardTitle>Completion Documents</CardTitle>
                <CardDescription>
                    Your official certificate and academic transcript. Access is granted once all academic and financial requirements are met.
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex w-full gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button disabled={!isEligibleForCompletion} className="w-full">
                                <FileTextIcon className="mr-2 h-4 w-4" />
                                Preview Certificate
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Official Certificate of Completion</DialogTitle>
                                <DialogDescription>
                                    This is a preview of your official certificate from {schoolProfile?.name}.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="p-4 bg-muted rounded-md flex justify-center">
                                <Image
                                    src={schoolProfile?.certificateTemplateUrl || "https://placehold.co/800x600.png"}
                                    alt="Certificate Preview"
                                    width={800}
                                    height={600}
                                    className="rounded-md border shadow-lg"
                                    data-ai-hint="certificate document"
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Close</Button>
                                </DialogClose>
                                <Button onClick={handleDownloadCertificate}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary" disabled={!isEligibleForCompletion} className="w-full">
                                <FileTextIcon className="mr-2 h-4 w-4" />
                                Preview Transcript
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Official Academic Transcript</DialogTitle>
                                <DialogDescription>
                                   This is a preview of your official academic transcript from {schoolProfile?.name}.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="p-4 bg-muted rounded-md flex justify-center max-h-[70vh] overflow-y-auto">
                                <Image
                                    src={schoolProfile?.transcriptTemplateUrl || "https://placehold.co/600x800.png"}
                                    alt="Transcript Preview"
                                    width={600}
                                    height={800}
                                    className="rounded-md border shadow-lg"
                                    data-ai-hint="transcript document"
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Close</Button>
                                </DialogClose>
                                <Button onClick={handleDownloadTranscript}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <p className="text-xs text-muted-foreground self-center">
                    Document by Pixel Digital Solutions {new Date().getFullYear()}
                </p>
            </CardFooter>
        </Card>
    </div>
  );
}
