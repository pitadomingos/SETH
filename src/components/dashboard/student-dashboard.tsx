'use client';
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { FileText, Award, Trophy } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { assignments, grades, studentCourses, attendance, studentsData } from "@/lib/mock-data";
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


const gpaMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };

const calculateAverageGpa = (studentId: string) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    const totalPoints = studentGrades.reduce((acc, g) => acc + (gpaMap[g.grade] || 0), 0);
    return (totalPoints / studentGrades.length);
};

function RankCard() {
    const studentId = 'S001'; // hardcoded for demo
  
    const allStudentsWithGpa = useMemo(() => studentsData.map(student => ({
        ...student,
        calculatedGpa: parseFloat(calculateAverageGpa(student.id).toFixed(2)),
    })).sort((a, b) => b.calculatedGpa - a.calculatedGpa), []);

    const studentRank = useMemo(() => allStudentsWithGpa.findIndex(s => s.id === studentId) + 1, [allStudentsWithGpa, studentId]);

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
