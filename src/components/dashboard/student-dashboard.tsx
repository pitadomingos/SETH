
'use client';
import { useMemo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { FileText, Award, Trophy, CheckCircle, Download, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useSchoolData } from "@/context/school-data-context";
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
import { analyzeStudentFailure, AnalyzeStudentFailureOutput } from '@/ai/flows/analyze-student-failure';


const gpaMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };

const calculateGpaFromGrade = (grade: string): number => {
    const numericGrade = parseFloat(grade);
    if (!isNaN(numericGrade) && isFinite(numericGrade)) {
        return (numericGrade / 5.0);
    }
    return gpaMap[grade] || 0;
}

const calculateAverageGpa = (studentId: string, grades) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    const totalPoints = studentGrades.reduce((acc, g) => acc + calculateGpaFromGrade(g.grade), 0);
    return (totalPoints / studentGrades.length);
};

function AIFailureAnalysis({ student, grades, attendanceSummary }) {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<AnalyzeStudentFailureOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const gradesForAnalysis = grades.map(g => ({ subject: g.subject, grade: g.grade }));
        const result = await analyzeStudentFailure({
          studentName: student.name,
          grades: gradesForAnalysis,
          attendanceSummary,
        });
        setAnalysis(result);
      } catch (error) {
        console.error("Failed to fetch failure analysis:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load AI-powered academic advice.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (student) {
        fetchAnalysis();
    }
  }, [student, grades, attendanceSummary, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p>AI is analyzing academic record...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
        <p className="text-sm text-destructive p-4">
            Could not load academic analysis at this time. Please speak with your advisor.
        </p>
    );
  }

  return (
    <div className="space-y-4 p-4 text-sm bg-destructive/5 border border-destructive/20 rounded-md">
       <div>
         <h4 className="font-semibold text-destructive mb-1">AI-Powered Academic Analysis</h4>
         <p className="text-muted-foreground">{analysis.failureAnalysis}</p>
       </div>
       <div>
         <h4 className="font-semibold text-destructive mb-1">Suggestions for Success</h4>
         <p className="whitespace-pre-wrap text-muted-foreground">{analysis.resitSuggestions}</p>
       </div>
    </div>
  );
}


function RankCard() {
    const { user } = useAuth();
    const { studentsData, grades } = useSchoolData();

    // This logic needs to find the student's ID from the user object.
    // For the demo, we map usernames to student IDs.
    const studentIdMap = {
        student1: 'S001',
        student2: 'S101',
        student3: 'S201',
        student4: 'S010',
    };
    const studentId = user?.username ? studentIdMap[user.username] : null;
  
    const allStudentsWithGpa = useMemo(() => studentsData.map(student => ({
        ...student,
        calculatedGpa: parseFloat(calculateAverageGpa(student.id, grades).toFixed(2)),
    })).sort((a, b) => b.calculatedGpa - a.calculatedGpa), [studentsData, grades]);

    const studentRank = useMemo(() => {
        if (!studentId) return -1;
        return allStudentsWithGpa.findIndex(s => s.id === studentId) + 1;
    }, [allStudentsWithGpa, studentId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy /> School Rank</CardTitle>
                <CardDescription>Your overall academic position.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-6xl font-bold text-primary">{studentRank > 0 ? studentRank : 'N/A'}</p>
                <p className="text-muted-foreground">out of {allStudentsWithGpa.length} students</p>
            </CardContent>
            <CardFooter>
                 <Link href="/dashboard/leaderboards" passHref className="w-full">
                    <Button variant="outline" className="w-full">View Leaderboards</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

function AttendanceBreakdownChart() {
  const { user } = useAuth();
  const { attendance } = useSchoolData();
  const studentIdMap = {
        student1: 'S001',
        student2: 'S101',
        student3: 'S201',
        student4: 'S010',
    };
  const studentId = user?.username ? studentIdMap[user.username] : null;
  const studentAttendance = attendance.filter(a => a.studentId === studentId);
  const breakdown = studentAttendance.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, { present: 0, late: 0, absent: 0});

  const chartData = [
    { status: 'Present', value: breakdown.present, fill: 'var(--color-present)' },
    { status: 'Late', value: breakdown.late, fill: 'var(--color-late)' },
    { status: 'Absent', value: breakdown.absent, fill: 'var(--color-absent)' },
  ];

  const chartConfig = {
    present: { label: 'Present', color: 'hsl(var(--chart-2))' },
    late: { label: 'Late', color: 'hsl(var(--chart-4))' },
    absent: { label: 'Absent', color: 'hsl(var(--destructive))' },
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

function CompletionStatusContent({ student, hasPassed, areAllFeesPaid, grades, attendanceSummary }) {
  if (!hasPassed) {
    return <AIFailureAnalysis student={student} grades={grades} attendanceSummary={attendanceSummary} />;
  }

  if (!areAllFeesPaid) {
    return (
      <p className="text-sm text-amber-600 dark:text-amber-500">
        You have an outstanding balance on your account. Please clear all pending fees to enable document previews and downloads.
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Congratulations! You have met all requirements for completion. You can now preview and download your official documents.
    </p>
  );
}


export default function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { assignments, grades, financeData, studentsData, attendance } = useSchoolData();
  const studentIdMap = {
        student1: 'S001',
        student2: 'S101',
        student3: 'S201',
        student4: 'S010',
    };
  const studentId = user?.username ? studentIdMap[user.username] : null;
  const student = useMemo(() => studentsData.find(s => s.id === studentId), [studentsData, studentId]);

  const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'overdue').sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const studentGrades = useMemo(() => {
    if (!studentId) return [];
    return grades.filter(g => g.studentId === studentId);
  }, [grades, studentId]);

  const studentAttendanceSummary = useMemo(() => {
    if (!studentId) return { present: 0, late: 0, absent: 0 };
    const records = attendance.filter(a => a.studentId === studentId);
    return records.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, { present: 0, late: 0, absent: 0 });
  }, [attendance, studentId]);

  const studentGpa = useMemo(() => {
    if (!studentId) return 0;
    return calculateAverageGpa(studentId, grades);
  }, [studentId, grades]);

  const hasPassed = useMemo(() => studentGpa >= 2.0, [studentGpa]);

  const areAllFeesPaid = useMemo(() => {
    if (!studentId) return false;
    const studentFees = financeData.filter(f => f.studentId === studentId);
    if (studentFees.length === 0) return true; // No fees means they are considered paid up
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

  return (
    <div className="space-y-6">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </header>
       <div className="grid gap-6 lg:grid-cols-2">
          <RankCard />
          <AttendanceBreakdownChart />
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> Upcoming Assignments</CardTitle>
                <CardDescription>You have {pendingAssignments.length} assignments due.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                {pendingAssignments.slice(0, 4).map(assignment => (
                    <li key={assignment.id} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
                    <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                    </div>
                    <Badge variant={new Date(assignment.dueDate) < new Date() ? 'destructive' : 'outline'}>
                        Due {format(new Date(assignment.dueDate), 'MMM d')}
                    </Badge>
                    </li>
                ))}
                </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award /> Recent Grades</CardTitle>
                <CardDescription>Your latest academic results.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                {studentGrades.slice(0, 4).map((grade, index) => (
                    <li key={index} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
                    <p className="font-medium">{grade.subject}</p>
                    <Badge variant={grade.grade.startsWith('A') || parseFloat(grade.grade) >= 18 ? 'secondary' : 'outline'}>{grade.grade}</Badge>
                    </li>
                ))}
                </ul>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {isEligibleForCompletion ? (
                        <CheckCircle className="text-green-500"/>
                    ) : !hasPassed ? (
                         <XCircle className="text-destructive"/>
                    ) : (
                        <AlertTriangle className="text-amber-500" />
                    )}
                    Completion Documents
                </CardTitle>
                <CardDescription>
                    Your official certificate and academic transcript.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <CompletionStatusContent 
                    student={student}
                    hasPassed={hasPassed}
                    areAllFeesPaid={areAllFeesPaid} 
                    grades={studentGrades}
                    attendanceSummary={studentAttendanceSummary}
                 />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex w-full gap-2">
                    {/* Certificate Dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button disabled={!isEligibleForCompletion} className="w-full">
                                <FileText className="mr-2 h-4 w-4" />
                                Preview Certificate
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Official Certificate of Completion</DialogTitle>
                                <DialogDescription>
                                    This is a preview of your official certificate.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="p-4 bg-muted rounded-md flex justify-center">
                                <Image
                                    src="https://placehold.co/800x600.png"
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

                    {/* Transcript Dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary" disabled={!isEligibleForCompletion} className="w-full">
                                <FileText className="mr-2 h-4 w-4" />
                                Preview Transcript
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Official Academic Transcript</DialogTitle>
                                <DialogDescription>
                                    This is a preview of your official academic transcript.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="p-4 bg-muted rounded-md flex justify-center max-h-[70vh] overflow-y-auto">
                                <Image
                                    src="https://placehold.co/600x800.png"
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
                    Documents created by EduManage System {new Date().getFullYear()}
                </p>
            </CardFooter>
        </Card>
    </div>
  );
}

    