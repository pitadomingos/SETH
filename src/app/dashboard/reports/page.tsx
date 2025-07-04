
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { BarChart3, GraduationCap, Users, DollarSign, Download, Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSchoolData } from '@/context/school-data-context';

export default function ReportsPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { attendance, grades, events } = useSchoolData();

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const quickStats = useMemo(() => {
    // Calc 1: Average Attendance
    const totalAttendance = attendance.length;
    const attendedRecords = attendance.filter(r => r.status === 'present' || r.status === 'late').length;
    const averageAttendance = totalAttendance > 0 ? Math.round((attendedRecords / totalAttendance) * 100) : 0;

    // Calc 2: Average GPA
    const studentIdsWithGrades = [...new Set(grades.map(g => g.studentId))];
    let averageGpa = 0;
    if (studentIdsWithGrades.length > 0) {
        const totalGpaPoints = studentIdsWithGrades.reduce((acc, studentId) => {
            const studentGrades = grades.filter(g => g.studentId === studentId);
            if (studentGrades.length === 0) return acc;
            const totalPoints = studentGrades.reduce((sum, g) => sum + parseFloat(g.grade), 0);
            const avgNumericForStudent = totalPoints / studentGrades.length;
            const studentGpa = avgNumericForStudent / 5.0; // Convert 20-point to 4.0 GPA scale
            return acc + studentGpa;
        }, 0);
        averageGpa = totalGpaPoints / studentIdsWithGrades.length;
    }

    // Calc 3: Pass Rate
    const totalGrades = grades.length;
    const passingGrades = grades.filter(g => parseFloat(g.grade) >= 10).length; // 10/20 is passing
    const passRate = totalGrades > 0 ? Math.round((passingGrades / totalGrades) * 100) : 0;
    
    // Calc 4: Active Events
    const activeEvents = events.filter(e => e.date >= new Date()).length;

    return {
      averageAttendance: `${averageAttendance}%`,
      averageGpa: averageGpa.toFixed(1),
      passRate: `${passRate}%`,
      activeEvents: activeEvents.toString(),
    };
  }, [attendance, grades, events]);


  const handleGenerateReport = (reportName: string) => {
    toast({
        title: "Report Generation Started",
        description: `Your ${reportName} is being generated and will be downloaded shortly.`
    })
  };

  if (isLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">Generate and view school performance reports.</p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
            <CardDescription>Select a report type to download. (This is a demo feature)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg text-center space-y-3">
                <GraduationCap className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Student Performance</h3>
                <p className="text-sm text-muted-foreground">Academic results and progress reports.</p>
                <Button onClick={() => handleGenerateReport('Student Performance Report')}><Download className="mr-2 h-4 w-4" />Generate</Button>
            </div>
             <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg text-center space-y-3">
                <BarChart3 className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Attendance Summary</h3>
                <p className="text-sm text-muted-foreground">Overall attendance rates and records.</p>
                <Button onClick={() => handleGenerateReport('Attendance Summary Report')}><Download className="mr-2 h-4 w-4" />Generate</Button>
            </div>
             <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg text-center space-y-3">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Enrollment Statistics</h3>
                <p className="text-sm text-muted-foreground">Student enrollment and demographics.</p>
                <Button onClick={() => handleGenerateReport('Enrollment Statistics Report')}><Download className="mr-2 h-4 w-4" />Generate</Button>
            </div>
             <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg text-center space-y-3">
                <DollarSign className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Financial Report</h3>
                <p className="text-sm text-muted-foreground">Revenue, expenses, and fee collection.</p>
                <Button onClick={() => handleGenerateReport('Financial Report')}><Download className="mr-2 h-4 w-4" />Generate</Button>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>A real-time snapshot of key school metrics.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
                <p className="text-3xl font-bold text-primary">{quickStats.averageAttendance}</p>
                <p className="text-sm text-muted-foreground">Average Attendance</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-primary">{quickStats.averageGpa}</p>
                <p className="text-sm text-muted-foreground">Average GPA</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-primary">{quickStats.passRate}</p>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-primary">{quickStats.activeEvents}</p>
                <p className="text-sm text-muted-foreground">Active Events</p>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
