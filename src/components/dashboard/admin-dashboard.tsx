'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, BookOpen, School, CalendarDays, Activity, TrendingUp, DollarSign, Hourglass, TrendingDown } from "lucide-react";
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { studentsData, teachersData, financeData } from "@/lib/mock-data";


const attendanceChartData = [
  { status: 'present', value: 1150, fill: 'var(--color-present)' },
  { status: 'absent', value: 87, fill: 'var(--color-absent)' },
  { status: 'late', value: 20, fill: 'var(--color-late)' },
];

const attendanceChartConfig = {
  present: {
    label: 'Present',
    color: 'hsl(var(--chart-2))',
  },
  absent: {
    label: 'Absent',
    color: 'hsl(var(--destructive))',
  },
  late: {
    label: 'Late',
    color: 'hsl(var(--chart-4))',
  },
};

function AttendanceChart() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Attendance Overview</CardTitle>
        <CardDescription>Today's student attendance</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={attendanceChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={attendanceChartData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
                {attendanceChartData.map((entry) => (
                    <Cell key={`cell-${entry.status}`} fill={`var(--color-${entry.status})`} />
                ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="status" />} className="flex-wrap" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          92% Overall Attendance Rate
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Trending up by 5% this month
        </div>
      </CardFooter>
    </Card>
  );
}


export default function AdminDashboard() {
  const totalRevenue = financeData.filter(f => f.status === 'Paid').reduce((acc, f) => acc + f.amountDue, 0);
  const pendingFees = financeData.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.amountDue, 0);
  const overdueFees = financeData.filter(f => f.status === 'Overdue').reduce((acc, f) => acc + f.amountDue, 0);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">School Dashboard</h2>
        <p className="text-muted-foreground">Overview of school operations and statistics.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,257</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54</div>
            <p className="text-xs text-muted-foreground">4 new classes this semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
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
            <div className="text-2xl font-bold text-green-500">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">${pendingFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Fees</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${overdueFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Action required</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,200</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
         <div className="lg:col-span-3">
             <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of recent system events and actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Users className="h-5 w-5"/>
                            </div>
                            <div>
                                <p className="font-medium">New Student Added</p>
                                <p className="text-sm text-muted-foreground">{studentsData[0].name} was enrolled in Grade {studentsData[0].grade}.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Activity className="h-5 w-5"/>
                            </div>
                            <div>
                                <p className="font-medium">New Teacher Onboarded</p>
                                <p className="text-sm text-muted-foreground">{teachersData[0].name} has joined as a {teachersData[0].subject} teacher.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CalendarDays className="h-5 w-5"/>
                            </div>
                            <div>
                                <p className="font-medium">Event Scheduled</p>
                                <p className="text-sm text-muted-foreground">The annual Science Fair has been scheduled.</p>
                            </div>
                        </li>
                    </ul>
                </CardContent>
            </Card>
         </div>
         <div className="lg:col-span-2">
            <AttendanceChart />
         </div>
      </div>
    </div>
  );
}
