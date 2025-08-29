'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { PenSquare, BookMarked, Bell, BrainCircuit, Loader2, X, Mail, CalendarCheck, FileCheck, FlaskConical, TrendingUp, Radio } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useSchoolData, NewMessageData } from "@/context/school-data-context";
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { addDays, format, formatDistanceToNow } from 'date-fns';
import { useMemo, useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatGradeDisplay } from "@/lib/utils";
import { useWebSocket } from '@/components/layout/app-providers';
import type { WebSocketMessage } from '@/lib/websocketClient';

const messageSchema = z.object({
  subject: z.string().min(3, "Subject is required."),
  body: z.string().min(10, "Message body must be at least 10 characters."),
});

type MessageFormValues = z.infer<typeof messageSchema>;

function ContactAdminDialog() {
  const { addMessage, schoolProfile } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { subject: '', body: '' },
  });
  
  const adminEmail = useMemo(() => {
    return schoolProfile?.email || '';
  }, [schoolProfile]);

  function onSubmit(values: MessageFormValues) {
    if (!adminEmail) return;

    const messageData: NewMessageData = {
      recipientUsername: adminEmail,
      subject: values.subject,
      body: values.body,
    };
    addMessage(messageData);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Contact Admin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact School Administrator</DialogTitle>
          <DialogDescription>
            Send a message regarding school matters.
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


function ClassPerformanceTrendChart({ teacherCourses }) {
  const { grades, studentsData, classesData, schoolProfile } = useSchoolData();

  const chartData = useMemo(() => {
    if (!teacherCourses || teacherCourses.length === 0) return [];
    
    const teacherStudentIds = new Set<string>();
    teacherCourses.forEach(course => {
      const classInfo = classesData.find(c => c.id === course.classId);
      if (classInfo) {
        studentsData
          .filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim())
          .forEach(s => teacherStudentIds.add(s.id));
      }
    });

    const relevantGrades = grades.filter(g => teacherStudentIds.has(g.studentId));
    
    const gradesByMonth = relevantGrades.reduce((acc, grade) => {
        const gradeDate = grade.date?.toDate ? grade.date.toDate() : new Date(grade.date);
        const month = format(gradeDate, 'yyyy-MM');
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(parseFloat(grade.grade));
        return acc;
    }, {});

    return Object.entries(gradesByMonth)
        .map(([month, monthGrades]) => ({
            month: format(new Date(month), 'MMM yy'),
            avgGrade: (monthGrades as number[]).reduce((sum, g) => sum + g, 0) / (monthGrades as number[]).length,
        }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  }, [teacherCourses, grades, studentsData, classesData]);

  const chartConfig = {
    avgGrade: { label: 'Average Grade', color: 'hsl(var(--chart-1))' },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><TrendingUp /> Class Performance Trend</CardTitle>
        <CardDescription>Average grade of your students over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
           <RechartsLineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[10, 20]} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => `${formatGradeDisplay(value as any, schoolProfile?.gradingSystem)}`}/>} />
            <Line type="monotone" dataKey="avgGrade" stroke="var(--color-avgGrade)" strokeWidth={2} dot={false} />
          </RechartsLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


function AIClassPerformanceAnalyzer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { classesData, teachersData, studentsData, grades, savedReports, addSavedReport, coursesData } = useSchoolData();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const teacherInfo = useMemo(() => {
    return teachersData.find(t => t.name === user?.name);
  }, [teachersData, user]);

  const teacherCourses = useMemo(() => {
    if (!teacherInfo) return [];
    return coursesData.filter(c => c.teacherId === teacherInfo.id);
  }, [coursesData, teacherInfo]);
  
  const teacherClassIds = useMemo(() => teacherCourses.map(c => c.classId), [teacherCourses]);
  
  const teacherClasses = useMemo(() => {
    if (!teacherInfo) return [];
    return classesData.filter(c => teacherClassIds.includes(c.id));
  }, [classesData, teacherInfo, teacherClassIds]);

  const handleAnalysis = async (classId: string) => {
    // This feature is temporarily disabled
    toast({
      variant: 'destructive',
      title: 'Feature Unavailable',
      description: 'The AI Performance Analyst is temporarily disabled.',
    });
  };

  const handleReset = () => {
    setIsLoading(false);
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
            {(isLoading) && (
                <Button variant="ghost" onClick={handleReset}>
                    <X className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            )}
        </div>

        <div className="flex items-center justify-center p-8 text-muted-foreground">
            <p>AI features are temporarily disabled.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LiveAlertsCard() {
    const { wsClient } = useWebSocket();
    const [alerts, setAlerts] = useState<WebSocketMessage[]>([]);

    useEffect(() => {
        if (!wsClient) return;

        const unsubscribe = wsClient.subscribe((msg) => {
            // Add a timestamp to the message for display
            const newAlert = { ...msg, receivedAt: new Date() };
            setAlerts(prev => [newAlert, ...prev].slice(0, 5)); // Keep only the latest 5 alerts
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, [wsClient]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Radio className="h-6 w-6 text-primary animate-pulse" /> Live School Alerts
                </CardTitle>
                <CardDescription>Real-time notifications and announcements.</CardDescription>
            </CardHeader>
            <CardContent>
                {alerts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No new alerts.</p>
                ) : (
                    <ul className="space-y-3">
                        {alerts.map((alert, index) => (
                            <li key={index} className="text-sm">
                                <p className="font-semibold">{alert.payload.title || alert.type}</p>
                                <p className="text-muted-foreground">{alert.payload.message}</p>
                                <p className="text-xs text-muted-foreground/70 mt-1">{formatDistanceToNow(alert.receivedAt as Date, { addSuffix: true })}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { coursesData, teachersData, classesData } = useSchoolData();

  const teacherInfo = useMemo(() => {
    return teachersData.find(t => t.name === user?.name);
  }, [teachersData, user]);
  
  const teacherCourses = useMemo(() => {
    if (!teacherInfo) return [];
    return coursesData
      .filter(c => c.teacherId === teacherInfo.id)
      .map(course => {
        const classInfo = classesData.find(c => c.id === course.classId);
        return {
          ...course,
          grade: classInfo?.grade || 'N/A',
        };
      });
  }, [coursesData, teacherInfo, classesData]);
  
  const totalStudentsTaught = useMemo(() => {
    if (!teacherCourses.length) return 0;
    const uniqueClassIds = [...new Set(teacherCourses.map(c => c.classId))];
    return uniqueClassIds.reduce((acc, classId) => {
        const classInfo = classesData.find(c => c.id === classId);
        return acc + (classInfo?.students || 0);
    }, 0);
  }, [teacherCourses, classesData]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap gap-2 justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <ContactAdminDialog />
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
            <LiveAlertsCard />
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
        </div>
      </div>
      <AIClassPerformanceAnalyzer />
      <div className="grid gap-6 lg:grid-cols-2">
        <ClassPerformanceTrendChart teacherCourses={teacherCourses} />
      </div>
    </div>
  );
}
