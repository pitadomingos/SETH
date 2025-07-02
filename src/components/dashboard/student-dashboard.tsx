'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookCopy, Clock, Star, FileText, Award, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { assignments, grades, studentCourses, attendance } from "@/lib/mock-data";
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from '@/components/ui/chart';

function SubjectPerformanceChart() {
  const chartData = studentCourses.map(course => ({
    subject: course.name.split(' ')[0],
    progress: course.progress,
    fill: `hsl(var(--chart-${Math.floor(Math.random() * 5) + 1}))`
  }));

  const chartConfig = {
    progress: {
      label: "Progress",
    },
    ...studentCourses.reduce((acc, course) => {
        const subject = course.name.split(' ')[0];
        acc[subject] = {
            label: subject,
            color: `hsl(var(--chart-${Math.floor(Math.random() * 5) + 1}))`
        }
        return acc;
    }, {})
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
        <CardDescription>Your progress in each course</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="subject"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="progress" radius={8}>
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.subject}`} fill={entry.fill} />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function AttendanceBreakdownChart() {
  const studentAttendance = attendance.filter(a => a.studentId === 'S001');
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
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.status}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


export default function StudentDashboard() {
  const { user } = useAuth();
  const pendingAssignments = assignments.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Mid-terms are next week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
            <p className="text-xs text-muted-foreground">{assignments.filter(a => a.status === 'overdue').length} overdue</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8</div>
            <p className="text-xs text-muted-foreground">Up from 3.7 last semester</p>
          </CardContent>
        </Card>
      </div>
       <div className="grid gap-6 lg:grid-cols-2">
          <SubjectPerformanceChart />
          <AttendanceBreakdownChart />
      </div>
    </div>
  );
}
