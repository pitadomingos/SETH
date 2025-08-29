'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, School, CalendarDays, TrendingUp, DollarSign, Hourglass, TrendingDown, BarChart2, AlertTriangle, Mail, Radio } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, LabelList, Legend, Dot } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { useSchoolData, NewMessageData } from "@/context/school-data-context";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useMemo, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { formatGradeDisplay } from "@/lib/utils";
import { useWebSocket } from '@/components/layout/app-providers';
import type { WebSocketMessage } from '@/lib/websocketClient';


const messageSchema = z.object({
  subject: z.string().min(3, "Subject is required."),
  body: z.string().min(10, "Message body must be at least 10 characters."),
});

type MessageFormValues = z.infer<typeof messageSchema>;

function ContactDeveloperDialog() {
  const { addMessage, schoolProfile } = useSchoolData();
  const { wsClient } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { subject: '', body: '' },
  });

  function onSubmit(values: MessageFormValues) {
    const developerEmail = 'dev@edudmanage.com';
    const messageData: NewMessageData = {
      recipientUsername: developerEmail,
      subject: values.subject,
      body: values.body,
    };
    addMessage(messageData);
    form.reset();
    setIsOpen(false);
  }
  
  const handleBroadcast = (values: MessageFormValues) => {
    if (wsClient && schoolProfile) {
        wsClient.send({
            role: 'all',
            type: 'announcement',
            payload: {
                title: values.subject,
                message: values.body,
                schoolName: schoolProfile.name,
            }
        });
        alert('Broadcast sent to all connected parents and teachers!');
    }
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Contact & Broadcast</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Developer / Broadcast</DialogTitle>
          <DialogDescription>
            Send a message to the developer or broadcast an announcement to all parents and teachers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4 py-4">
            <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="body" render={({ field }) => ( <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem> )} />
            <DialogFooter className="flex flex-row justify-between w-full">
              <Button type="button" onClick={form.handleSubmit(handleBroadcast)} variant="secondary" disabled={form.formState.isSubmitting}>Broadcast</Button>
              <div className="flex gap-2">
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Send to Developer
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function TeacherPerformanceChart() {
    const { teachersData, coursesData, classesData, studentsData, grades } = useSchoolData();

    const chartData = useMemo(() => {
        return teachersData.map(teacher => {
            const teacherCourses = coursesData.filter(c => c.teacherId === teacher.id);
            if (teacherCourses.length === 0) {
                return { name: teacher.name, avgGrade: 0 };
            }

            const studentIds = new Set<string>();
            teacherCourses.forEach(course => {
                const classInfo = classesData.find(c => c.id === course.classId);
                if (classInfo) {
                    studentsData
                        .filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim())
                        .forEach(s => studentIds.add(s.id));
                }
            });

            const teacherGrades = grades
                .filter(g => studentIds.has(g.studentId) && g.subject === teacher.subject)
                .map(g => parseFloat(g.grade));
            
            const avgGrade = teacherGrades.length > 0
                ? teacherGrades.reduce((sum, g) => sum + g, 0) / teacherGrades.length
                : 0;

            return { name: teacher.name, avgGrade: parseFloat(avgGrade.toFixed(2)) };
        }).sort((a,b) => b.avgGrade - a.avgGrade);
    }, [teachersData, coursesData, classesData, studentsData, grades]);

    const chartConfig = {
        avgGrade: {
            label: "Avg. Grade",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Teacher Performance</CardTitle>
                <CardDescription>Average student grade by teacher</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} />
                        <XAxis type="number" domain={[10, 20]} hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => (value as number).toFixed(2)}/>} />
                        <Bar dataKey="avgGrade" fill="var(--color-avgGrade)" radius={4}>
                           <LabelList dataKey="avgGrade" position="right" offset={8} className="fill-foreground" fontSize={12} formatter={(value: number) => value.toFixed(2)} />
                        </Bar>
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

function SubjectPerformanceChart() {
    const { subjects, grades } = useSchoolData();

    const chartData = useMemo(() => {
        return subjects.map(subject => {
            const subjectGrades = grades.filter(g => g.subject === subject).map(g => parseFloat(g.grade));
            const avgGrade = subjectGrades.length > 0
                ? subjectGrades.reduce((sum, grade) => sum + grade, 0) / subjectGrades.length
                : 0;
            return { name: subject, avgGrade: parseFloat(avgGrade.toFixed(2)) };
        }).sort((a, b) => b.avgGrade - a.avgGrade);
    }, [subjects, grades]);

    const chartConfig = {
        avgGrade: {
            label: "Avg. Grade",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average grade across all students by subject</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} />
                        <XAxis type="number" domain={[10, 20]} hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => (value as number).toFixed(2)}/>} />
                        <Bar dataKey="avgGrade" fill="var(--color-avgGrade)" radius={4}>
                             <LabelList dataKey="avgGrade" position="right" offset={8} className="fill-foreground" fontSize={12} formatter={(value: number) => value.toFixed(2)} />
                        </Bar>
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload.isHoliday) {
    return <Dot cx={cx} cy={cy} r={4} fill="hsl(var(--destructive))" />;
  }
  if (payload.isWeekend) {
    return <Dot cx={cx} cy={cy} r={3} fill="hsl(var(--muted-foreground))" opacity={0.5} />;
  }
  return null;
};

function AttendanceTrendChart() {
    const { attendance, holidays } = useSchoolData();

    const chartData = useMemo(() => {
        const attendanceByDate = attendance.reduce((acc, record) => {
            const date = record.date.toDate ? record.date.toDate().toISOString().split('T')[0] : new Date(record.date).toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { present: 0, late: 0, absent: 0, sick: 0 };
            }
            if (record.status.toLowerCase() in acc[date]) {
               acc[date][record.status.toLowerCase()]++;
            }
            return acc;
        }, {} as Record<string, { present: number; late: number; absent: number; sick: number; }>);

        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d;
        });
        
        const holidayDateStrings = holidays.map(h => format(new Date(h.date), 'yyyy-MM-dd'));

        return last30Days.map(d => {
            const dateStr = format(d, 'yyyy-MM-dd');
            const dayOfWeek = d.getDay();
            
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isHoliday = holidayDateStrings.includes(dateStr);

            const dayData = attendanceByDate[dateStr];
            const total = dayData ? dayData.present + dayData.late + dayData.absent + dayData.sick : 0;
            const rate = total > 0 ? ((dayData.present + dayData.late) / total) * 100 : 0;
            
            return {
                date: format(d, 'MMM d'),
                attendanceRate: parseFloat(rate.toFixed(1)),
                isWeekend,
                isHoliday,
            };
        });
    }, [attendance, holidays]);

    const chartConfig = {
        attendanceRate: { label: 'Attendance %', color: 'hsl(var(--chart-1))' },
        holiday: { label: 'Holiday', color: 'hsl(var(--destructive))' },
        weekend: { label: 'Weekend', color: 'hsl(var(--muted-foreground))' },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
                <CardDescription>Overall student attendance rate over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                     <RechartsLineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 6)}
                        />
                        <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                        <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value.toFixed(1)}%`}/>} />
                        <Legend verticalAlign="bottom" height={36} />
                        <Line
                          type="monotone"
                          dataKey="attendanceRate"
                          stroke="var(--color-attendanceRate)"
                          strokeWidth={2}
                          dot={<CustomizedDot />}
                        />
                         <Line type="monotone" name="Holiday" dataKey="dummyHoliday" stroke="hsl(var(--destructive))" dot={{r: 4}} activeDot={false} strokeWidth={0} />
                         <Line type="monotone" name="Weekend" dataKey="dummyWeekend" stroke="hsl(var(--muted-foreground))" dot={{r: 3, opacity: 0.5}} activeDot={false} strokeWidth={0} />
                    </RechartsLineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

function GradePerformanceChart() {
    const { grades } = useSchoolData();

    const chartData = useMemo(() => {
        const gradesByMonth = grades.reduce((acc, grade) => {
            const gradeDate = grade.date.toDate ? grade.date.toDate() : new Date(grade.date);
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

    }, [grades]);

    const chartConfig = {
        avgGrade: {
            label: "Avg. Grade",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>School-wide average grade over the last few months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <RechartsLineChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis dataKey="avgGrade" domain={[10, 20]} />
                        <ChartTooltip content={<ChartTooltipContent formatter={(value) => (value as number).toFixed(2)}/>} />
                        <Line type="monotone" dataKey="avgGrade" stroke="var(--color-avgGrade)" strokeWidth={2} dot={false} />
                    </RechartsLineChart>
                </ChartContainer>
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
            const newAlert = { ...msg, receivedAt: new Date() };
            setAlerts(prev => [newAlert, ...prev].slice(0, 5));
        });

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


export default function AdminDashboard() {
  const { studentsData, teachersData, classesData, financeData, events, schoolProfile, expensesData } = useSchoolData();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Overall stats
  const totalRevenue = financeData.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalExpenses = expensesData.reduce((acc, e) => acc + e.amount, 0);
  
  const pendingFees = financeData
    .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) >= now)
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
  
  const overdueFees = financeData
    .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) < now)
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);

  // Monthly stats
  const monthlyFinanceData = financeData.filter(f => {
    const dueDate = new Date(f.dueDate);
    return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
  });

  const monthlyExpensesData = expensesData.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const monthlyTotalRevenue = monthlyFinanceData.reduce((acc, f) => acc + f.amountPaid, 0);
  
  const monthlyPendingFees = monthlyFinanceData
    .filter(f => new Date(f.dueDate) >= now && (f.totalAmount - f.amountPaid > 0))
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);

  const monthlyOverdueFees = monthlyFinanceData
    .filter(f => new Date(f.dueDate) < now && (f.totalAmount - f.amountPaid > 0))
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
    
  const monthlyTotalExpenses = monthlyExpensesData.reduce((acc, e) => acc + e.amount, 0);

  const studentGenderCount = studentsData.reduce((acc, student) => {
    acc[student.sex] = (acc[student.sex] || 0) + 1;
    return acc;
  }, { Male: 0, Female: 0 });

  const teacherGenderCount = teachersData.reduce((acc, teacher) => {
    acc[teacher.sex] = (acc[teacher.sex] || 0) + 1;
    return acc;
  }, { Male: 0, Female: 0 });

  return (
    <div className="space-y-6">
      {schoolProfile && schoolProfile.status !== 'Active' && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Account is {schoolProfile.status}</AlertTitle>
            <AlertDescription>
                Your school's account is currently {schoolProfile.status}. Most features are disabled. Please check your school profile for details or contact support.
            </AlertDescription>
        </Alert>
      )}
      <header className="flex flex-wrap gap-2 justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">School Dashboard</h2>
          <p className="text-muted-foreground">Overview of school operations and statistics.</p>
        </div>
        <ContactDeveloperDialog />
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsData.length}</div>
            <p className="text-xs text-muted-foreground">{studentGenderCount.Male} Male, {studentGenderCount.Female} Female</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachersData.length}</div>
            <p className="text-xs text-muted-foreground">{teacherGenderCount.Male} Male, {teacherGenderCount.Female} Female</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classesData.length}</div>
            <p className="text-xs text-muted-foreground">4 new classes this semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">Science fair next week</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
            <p className="text-xs text-muted-foreground pt-1">{formatCurrency(monthlyTotalRevenue, schoolProfile?.currency)} this month</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(pendingFees, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
            <p className="text-xs text-muted-foreground pt-1">{formatCurrency(monthlyPendingFees, schoolProfile?.currency)} this month</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Fees</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(overdueFees, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">Action required</p>
            <p className="text-xs text-muted-foreground pt-1">{formatCurrency(monthlyOverdueFees, schoolProfile?.currency)} this month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
            <p className="text-xs text-muted-foreground pt-1">{formatCurrency(monthlyTotalExpenses, schoolProfile?.currency)} this month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <LiveAlertsCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AttendanceTrendChart />
        <GradePerformanceChart />
        <TeacherPerformanceChart />
        <SubjectPerformanceChart />
      </div>
    </div>
  );
}
