import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { PenSquare, BookMarked, Bell, BarChart, LineChart } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useSchoolData } from "@/context/school-data-context";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { addDays, format } from 'date-fns';

function GradeDistributionChart() {
  const { grades } = useSchoolData();
  const gradeCounts = grades.reduce((acc, grade) => {
    const gradeLetter = grade.grade.replace(/[\+\-]/, '');
    acc[gradeLetter] = (acc[gradeLetter] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(gradeCounts).map(grade => ({
    grade,
    count: gradeCounts[grade],
  }));

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
            <YAxis />
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


export default function TeacherDashboard() {
  const { user } = useAuth();
  const { courses, events } = useSchoolData();
  const teacherCourses = courses.teacher;
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><BookMarked className="h-6 w-6 text-primary" /> Your Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold">{teacherCourses.length} Courses</div>
            <p className="text-sm text-muted-foreground">You are currently teaching {teacherCourses.reduce((acc, c) => acc + c.students, 0)} students this semester.</p>
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
          <CardFooter>
             <Link href="/dashboard/events" passHref className="w-full">
              <Button variant="outline" className="w-full">View All Events</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <GradeDistributionChart />
        <UpcomingDeadlinesChart />
      </div>
    </div>
  );
}
