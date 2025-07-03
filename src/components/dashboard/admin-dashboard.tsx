
'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, BookOpen, School, CalendarDays, TrendingUp, DollarSign, Hourglass, TrendingDown } from "lucide-react";
import { Line, LineChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { useSchoolData } from "@/context/school-data-context";
import { format, subDays } from "date-fns";

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
  })).sort((a, b) => new Date(a.date) - new Date(b.date));


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
    const { grades } = useSchoolData();
    const gpaMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };
    
    const calculateGpaFromGrade = (grade: string): number => {
        const numericGrade = parseFloat(grade);
        if (!isNaN(numericGrade) && isFinite(numericGrade)) {
            return (numericGrade / 5.0);
        }
        return gpaMap[grade] || 0;
    }

    const monthlyGpa = grades.reduce((acc, grade) => {
        const month = format(new Date(grade.date), 'MMM yyyy');
        if (!acc[month]) {
            acc[month] = { totalPoints: 0, count: 0 };
        }
        acc[month].totalPoints += calculateGpaFromGrade(grade.grade);
        acc[month].count++;
        return acc;
    }, {});

    const chartData = Object.keys(monthlyGpa).map(month => ({
        month,
        avgGpa: (monthlyGpa[month].totalPoints / monthlyGpa[month].count).toFixed(2),
    })).sort((a,b) => new Date(a.month) - new Date(b.month));

    const chartConfig = {
      avgGpa: {
        label: "Average GPA",
        color: "hsl(var(--chart-1))",
      },
    } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Performance</CardTitle>
        <CardDescription>Monthly average GPA across all students</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={chartData} margin={{ left: -20, right: 10 }}>
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
                    domain={[2.5, 4.0]}
                 />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgGpa" fill="var(--color-avgGpa)" radius={8} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


export default function AdminDashboard() {
  const { studentsData, teachersData, classesData, financeData, events } = useSchoolData();
  const now = new Date();

  const totalRevenue = financeData.reduce((acc, f) => acc + f.amountPaid, 0);
  
  const pendingFees = financeData
    .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) >= now)
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
  
  const overdueFees = financeData
    .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) < now)
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);

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
            <div className="text-2xl font-bold">{studentsData.length}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachersData.length}</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
         <AttendanceTrendChart />
         <AcademicPerformanceChart />
      </div>
    </div>
  );
}
