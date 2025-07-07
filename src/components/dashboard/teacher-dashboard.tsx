

'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { PenSquare, BookMarked, Bell, BrainCircuit, Loader2, X, Mail, CalendarCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useSchoolData, NewMessageData } from "@/context/school-data-context";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';


const messageSchema = z.object({
  subject: z.string().min(3, "Subject is required."),
  body: z.string().min(10, "Message body must be at least 10 characters."),
});

type MessageFormValues = z.infer<typeof messageSchema>;

function ContactAdminDialog() {
  const { addMessage } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { subject: '', body: '' },
  });

  function onSubmit(values: MessageFormValues) {
    const messageData: NewMessageData = {
      to: 'Admin',
      ...values,
    };
    addMessage(messageData);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full"><Mail className="mr-2 h-4 w-4" /> Contact Admin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact School Administrator</DialogTitle>
          <DialogDescription>
            Send a message regarding administrative matters or general queries.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="body" render={({ field }) => ( <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem> )} />
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Send Message
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


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
      color: "hsl(var(--chart-2))",
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
      color: 'hsl(var(--chart-1))',
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
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><PenSquare className="h-6 w-6 text-primary" /> Create Lesson Plan</CardTitle>
            <CardDescription className="pt-2">Use our AI-powered tool to generate detailed lesson plans for your classes quickly and efficiently.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/lesson-planner" passHref className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>
         <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><CalendarCheck className="h-6 w-6 text-primary" /> Take Attendance</CardTitle>
            <CardDescription className="pt-2">A dedicated interface to mark attendance for each of your lessons.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/attendance" passHref className="w-full">
              <Button className="w-full">Take Attendance</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><BookMarked className="h-6 w-6 text-primary" /> Your Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teacherCourses.length} Courses</div>
            <p className="text-sm text-muted-foreground">You are currently teaching {totalStudentsTaught} students this semester.</p>
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
        
        <div className="md:col-span-2 lg:col-span-1">
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
                <div className="mt-4">
                    <ContactAdminDialog />
                </div>
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
