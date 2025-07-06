

'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, BookOpen, School, CalendarDays, TrendingUp, DollarSign, Hourglass, TrendingDown, BarChart2, AlertTriangle, Mail } from "lucide-react";
import { Line, LineChart, Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { useSchoolData, NewMessageData } from "@/context/school-data-context";
import { format, subDays } from "date-fns";
import { getLetterGrade, getGpaFromNumeric, formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';


const messageSchema = z.object({
  subject: z.string().min(3, "Subject is required."),
  body: z.string().min(10, "Message body must be at least 10 characters."),
});

type MessageFormValues = z.infer<typeof messageSchema>;

function ContactDeveloperDialog() {
  const { addMessage } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { subject: '', body: '' },
  });

  function onSubmit(values: MessageFormValues) {
    const messageData: NewMessageData = {
      to: 'Developer',
      ...values,
    };
    addMessage(messageData);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Contact Developer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Developer</DialogTitle>
          <DialogDescription>
            Send a message regarding system issues or feedback.
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

function AttendanceTrendChart() {
  const { attendance } = useSchoolData();
  const thirtyDaysAgo = subDays(new Date(), 30);
  const relevantAttendance = attendance.filter(a => new Date(a.date) >= thirtyDaysAgo);
  
  const dailyData = relevantAttendance.reduce((acc, record) => {
    const date = format(new Date(record.date), 'MMM d');
    if (!acc[date]) {
      acc[date] = { present: 0, total: 0 };
    }
    acc[date].total++;
    if (record.status === 'present' || record.status === 'late') {
      acc[date].present++;
    }
    return acc;
  }, {});

  const chartData = Object.keys(dailyData).map(date => ({
    date,
    percentage: dailyData[date].total > 0 ? Math.round((dailyData[date].present / dailyData[date].total) * 100) : 0
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  const chartConfig = {
    percentage: {
      label: 'Attendance %',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>Daily attendance percentage for the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={chartData} margin={{ left: -20, right: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[80, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="percentage" stroke="var(--color-percentage)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function AcademicPerformanceChart() {
    const { grades, schoolProfile } = useSchoolData();
    const gradingSystem = schoolProfile?.gradingSystem || '20-Point';

    const monthlyAvg = grades.reduce((acc, grade) => {
        const month = format(new Date(grade.date), 'MMM yyyy');
        if (!acc[month]) {
            acc[month] = { totalPoints: 0, count: 0 };
        }
        acc[month].totalPoints += parseFloat(grade.grade);
        acc[month].count++;
        return acc;
    }, {} as Record<string, { totalPoints: number, count: number }>);

    const chartData = Object.keys(monthlyAvg).map(month => ({
        month,
        avgNumeric: (monthlyAvg[month].totalPoints / monthlyAvg[month].count),
    })).sort((a,b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    let yAxisDomain: [number, number];
    let yAxisTickFormatter: (value: number) => string;
    let chartDescription: string;
    let tooltipFormatter: (value: number) => string;
    let dataKey: 'avgNumeric' | 'avgGpa' = 'avgNumeric';

    switch (gradingSystem) {
        case 'GPA':
            yAxisDomain = [2.5, 4.0];
            chartData.forEach(d => { d['avgGpa'] = getGpaFromNumeric(d.avgNumeric) });
            dataKey = 'avgGpa';
            yAxisTickFormatter = (value) => value.toFixed(1);
            chartDescription = "Monthly average GPA across all students";
            tooltipFormatter = (value) => value.toFixed(2);
            break;
        case 'Letter':
             yAxisDomain = [10, 20];
             yAxisTickFormatter = (value) => getLetterGrade(value);
             chartDescription = "Monthly average grade (letter equivalent) across all students";
             tooltipFormatter = (value) => getLetterGrade(value);
            break;
        case '20-Point':
        default:
            yAxisDomain = [10, 20];
            yAxisTickFormatter = (value) => `${Math.round(value)}`;
            chartDescription = "Monthly average grade (20-point scale) across all students";
            tooltipFormatter = (value) => `${value.toFixed(1)}/20`;
            break;
    }
    
    const chartConfig = {
      [dataKey]: {
        label: "Average",
        color: "hsl(var(--chart-1))",
      },
    } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Performance</CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <RechartsBarChart data={chartData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} />
                 <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                 <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={yAxisDomain}
                    tickFormatter={yAxisTickFormatter}
                 />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent formatter={(value) => tooltipFormatter(value as number)} />}
                />
                <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={8} />
            </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


export default function AdminDashboard() {
  const { studentsData, teachersData, classesData, financeData, events, schoolProfile, expensesData } = useSchoolData();
  const now = new Date();

  const totalRevenue = financeData.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalExpenses = expensesData.reduce((acc, e) => acc + e.amount, 0);
  
  const pendingFees = financeData
    .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) >= now)
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
  
  const overdueFees = financeData
    .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) < now)
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(totalRevenue, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{formatCurrency(pendingFees, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Fees</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(overdueFees, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">Action required</p>
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
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         <AttendanceTrendChart />
         <AcademicPerformanceChart />
      </div>
    </div>
  );
}
