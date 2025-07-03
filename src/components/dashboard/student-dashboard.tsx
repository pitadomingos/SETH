'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Award } from "lucide-react";
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
import { format } from "date-fns";

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
  const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'overdue').sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const recentGrades = grades.filter(g => g.studentId === 'S001').slice(0, 4);

  return (
    <div className="space-y-6">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </header>
       <div className="grid gap-6 lg:grid-cols-2">
          <SubjectPerformanceChart />
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
                {recentGrades.map((grade, index) => (
                    <li key={index} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
                    <p className="font-medium">{grade.subject}</p>
                    <Badge variant={grade.grade.includes('A') ? 'secondary' : 'outline'}>{grade.grade}</Badge>
                    </li>
                ))}
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
