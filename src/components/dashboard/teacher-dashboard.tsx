

'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { PenSquare, BookMarked, Bell, BrainCircuit, Loader2, X, Mail, CalendarCheck, FileCheck, FlaskConical } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useSchoolData } from "@/context/school-data-context";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { addDays, format } from 'date-fns';
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { analyzeClassPerformance, AnalyzeClassPerformanceOutput } from "@/ai/flows/analyze-class-performance";
import { useToast } from "@/hooks/use-toast";
import { getLetterGrade } from "@/lib/utils";

// Helper to standardize grades for the chart
const getStandardLetterGrade = (grade: string): string => {
  const numericGrade = parseFloat(grade);
  if (!isNaN(numericGrade) && isFinite(numericGrade)) {
    return getLetterGrade(numericGrade).replace(/[+-]/, '');
  }
  const letter = grade.charAt(0).toUpperCase();
  if (['A', 'B', 'C', 'D', 'F'].includes(letter)) {
    return letter;
  }
  return 'N/A'; // Fallback for any unexpected grade formats
};

function GradeDistributionChart() {
  const { grades } = useSchoolData();
  
  const chartData = useMemo(() => {
    const counts = grades.reduce((acc, gradeItem) => {
      const standardGrade = getStandardLetterGrade(gradeItem.grade);
      if (standardGrade !== 'N/A') {
        acc[standardGrade] = (acc[standardGrade] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const orderedGrades = ['A', 'B', 'C', 'D', 'F'];
    return orderedGrades.map(g => ({
      grade: g,
      count: counts[g] || 0,
    }));
  }, [grades]);

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>Overview of grades assigned this semester</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <RechartsBarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="grade" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={8} />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function UpcomingDeadlinesChart() {
  const { assignments, events } = useSchoolData();
  const today = new Date();
  const nextWeek = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  
  const deadlines = assignments
    .map(a => ({ date: new Date(a.dueDate), type: 'Assignment' }))
    .concat(events.map(e => ({ date: e.date, type: 'Event' })));

  const chartData = nextWeek.map(day => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    return {
      date: format(day, 'MMM d'),
      count: deadlines.filter(d => format(d.date, 'yyyy-MM-dd') === formattedDay).length,
    };
  });

  const chartConfig = {
    count: {
      label: 'Deadlines',
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>Assignments and events due in the next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <RechartsLineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={false} />
          </RechartsLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function AIClassPerformanceAnalyzer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { classesData, teachersData, studentsData, grades } = useSchoolData();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeClassPerformanceOutput | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const teacherInfo = useMemo(() => {
    return teachersData.find(t => t.name === user?.name);
  }, [teachersData, user]);

  const teacherClasses = useMemo(() => {
    if (!teacherInfo) return [];
    return classesData.filter(c => c.teacher === teacherInfo.name);
  }, [classesData, teacherInfo]);

  const handleAnalysis = async (classId: string) => {
    if (!classId) return;
    setSelectedClassId(classId);
    setIsLoading(true);
    setResult(null);

    try {
      const selectedClass = classesData.find(c => c.id === classId);
      if (!selectedClass || !teacherInfo) {
        throw new Error('Could not find class or teacher information.');
      }

      // Find students in the selected class
      const studentsInClass = studentsData.filter(s => 
        s.grade === selectedClass.grade &&
        s.class === selectedClass.name.split('-')[1].trim()
      ).map(s => s.id);
      
      // Get grades for those students in the teacher's subject
      const relevantGrades = grades
        .filter(g => studentsInClass.includes(g.studentId) && g.subject === teacherInfo.subject)
        .map(g => g.grade);

      const analysisResult = await analyzeClassPerformance({
        className: selectedClass.name,
        subject: teacherInfo.subject,
        grades: relevantGrades,
      });

      setResult(analysisResult);

      if (analysisResult.interventionNeeded) {
        toast({
          title: 'AI Recommendation',
          description: `Intervention suggested for ${selectedClass.name}.`,
        });
      }

    } catch (error) {
      console.error("Failed to analyze class performance:", error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not get AI-powered analysis. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsLoading(false);
    setResult(null);
    setSelectedClassId('');
  };

  if (teacherClasses.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BrainCircuit /> AI Performance Analyst</CardTitle>
        <CardDescription>Select a class to get an AI-powered performance analysis and recommendations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
            <Select onValueChange={handleAnalysis} value={selectedClassId}>
            <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a class to analyze..." />
            </SelectTrigger>
            <SelectContent>
                {teacherClasses.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name} - {teacherInfo?.subject}</SelectItem>
                ))}
            </SelectContent>
            </Select>
            {(isLoading || result) && (
                <Button variant="ghost" onClick={handleReset}>
                    <X className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2"/>
            <p>Analyzing performance data...</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-4 text-sm">
            <div className={`p-4 rounded-md ${result.interventionNeeded ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted'}`}>
                <h4 className="font-semibold mb-1">Analysis:</h4>
                <p className="text-muted-foreground">{result.analysis}</p>
            </div>
             <div className={`p-4 rounded-md ${result.interventionNeeded ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted'}`}>
                <h4 className="font-semibold mb-1">Recommendation:</h4>
                <p className="text-muted-foreground">{result.recommendation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default function TeacherDashboard() {
  const { user } = useAuth();
  const { coursesData, events, teachersData, classesData } = useSchoolData();

  const teacherInfo = useMemo(() => {
    return teachersData.find(t => t.name === user?.name);
  }, [teachersData, user]);
  
  const teacherCourses = useMemo(() => {
    if (!teacherInfo) return [];
    return coursesData.filter(c => c.teacherId === teacherInfo.id);
  }, [coursesData, teacherInfo]);
  
  const totalStudentsTaught = useMemo(() => {
    if (!teacherCourses.length) return 0;
    const uniqueClassIds = [...new Set(teacherCourses.map(c => c.classId))];
    return uniqueClassIds.reduce((acc, classId) => {
        const classInfo = classesData.find(c => c.id === classId);
        return acc + (classInfo?.students || 0);
    }, 0);
  }, [teacherCourses, classesData]);

  const nextEvent = events.filter(e => e.date >= new Date()).sort((a,b) => a.date.getTime() - b.date.getTime())[0];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access your most common tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <Link href="/dashboard/lesson-planner" passHref><Button variant="outline" className="w-full h-full justify-start p-4 flex-col items-start gap-2"><PenSquare className="h-6 w-6 text-primary" /><div><p className="font-semibold">Lesson Planner</p><p className="text-xs text-muted-foreground text-left">Generate weekly plans</p></div></Button></Link>
                <Link href="/dashboard/attendance" passHref><Button variant="outline" className="w-full h-full justify-start p-4 flex-col items-start gap-2"><CalendarCheck className="h-6 w-6 text-primary" /><div><p className="font-semibold">Attendance</p><p className="text-xs text-muted-foreground text-left">Mark student attendance</p></div></Button></Link>
                <Link href="/dashboard/grading" passHref><Button variant="outline" className="w-full h-full justify-start p-4 flex-col items-start gap-2"><FileCheck className="h-6 w-6 text-primary" /><div><p className="font-semibold">Gradebook</p><p className="text-xs text-muted-foreground text-left">Enter student grades</p></div></Button></Link>
                <Link href="/dashboard/ai-testing" passHref><Button variant="outline" className="w-full h-full justify-start p-4 flex-col items-start gap-2"><FlaskConical className="h-6 w-6 text-primary" /><div><p className="font-semibold">AI Test Generator</p><p className="text-xs text-muted-foreground text-left">Create ad-hoc tests</p></div></Button></Link>
            </CardContent>
        </Card>
        
        <div className="space-y-6">
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><BookMarked className="h-6 w-6 text-primary" /> Your Courses</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{teacherCourses.length} Courses</div>
                <p className="text-sm text-muted-foreground">Teaching {totalStudentsTaught} students this semester.</p>
                <div className="flex gap-2 pt-2">
                    <Link href="/dashboard/schedule" passHref className="flex-1">
                    <Button variant="secondary" className="w-full">View Schedule</Button>
                    </Link>
                    <Link href="/dashboard/leaderboards" passHref className="flex-1">
                    <Button variant="outline" className="w-full">Rankings</Button>
                    </Link>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Bell className="h-6 w-6 text-primary" /> Upcoming Event</CardTitle>
            </CardHeader>
            <CardContent>
                {nextEvent ? (
                <>
                    <p className="text-lg font-semibold">{nextEvent.title}</p>
                    <p className="text-sm text-muted-foreground">{nextEvent.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </>
                ) : (
                <p className="text-muted-foreground">No upcoming events.</p>
                )}
            </CardContent>
            </Card>
        </div>
      </div>
      <AIClassPerformanceAnalyzer />
      <div className="grid gap-6 lg:grid-cols-2">
        <GradeDistributionChart />
        <UpcomingDeadlinesChart />
      </div>
    </div>
  );
}
