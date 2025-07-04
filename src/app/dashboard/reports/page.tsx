
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { BarChart3, GraduationCap, Users, DollarSign, Download, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

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
                <p className="text-3xl font-bold text-primary">95%</p>
                <p className="text-sm text-muted-foreground">Average Attendance</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-primary">3.6</p>
                <p className="text-sm text-muted-foreground">Average GPA</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-primary">24</p>
                <p className="text-sm text-muted-foreground">Active Events</p>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
