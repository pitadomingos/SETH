'use client';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { useSchoolData } from '@/context/school-data-context';
import { generateParentAdvice, GenerateParentAdviceOutput } from '@/ai/flows/generate-parent-advice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, User, GraduationCap, DollarSign, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function ChildSummaryCard({ child, allGrades, allAttendance, allFinance }) {
  const { toast } = useToast();
  const [advice, setAdvice] = useState<GenerateParentAdviceOutput | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(true);

  const childGrades = useMemo(() => allGrades.filter(g => g.studentId === child.id), [allGrades, child.id]);
  
  const childAttendanceSummary = useMemo(() => {
    const records = allAttendance.filter(a => a.studentId === child.id);
    return records.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, { present: 0, late: 0, absent: 0 });
  }, [allAttendance, child.id]);

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      try {
        const gradesForAdvice = childGrades.map(g => ({ subject: g.subject, grade: g.grade }));
        
        if (gradesForAdvice.length === 0) {
          setAdvice({
            summary: `${child.name} doesn't have any grades recorded yet. Check back soon for AI-powered insights!`,
            strengths: 'No data available.',
            recommendations: 'Encourage regular study habits and participation in class.'
          });
          return;
        }

        const result = await generateParentAdvice({
          studentName: child.name,
          grades: gradesForAdvice,
          attendanceSummary: childAttendanceSummary,
        });
        setAdvice(result);
      } catch (error) {
        console.error('Failed to generate parent advice:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Could not load AI advice for ${child.name}. Please try again later.`,
        });
      } finally {
        setIsLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [child, childGrades, childAttendanceSummary, toast]);
  
  const childFinance = allFinance.find(f => f.studentId === child.id);
  const recentGrades = childGrades.slice(0, 5);
  
  const getFinanceBadgeVariant = (status?: string) => {
    switch (status) {
      case 'Paid': return 'secondary';
      case 'Pending': return 'outline';
      case 'Overdue': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{child.name}</CardTitle>
        <CardDescription>{child.schoolName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> AI-Powered Insights</CardTitle>
                <CardDescription>A summary of {child.name}'s progress and recommendations for you.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoadingAdvice ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                        <p>Generating personalized advice...</p>
                    </div>
                ) : advice ? (
                    <div className="space-y-4 text-sm">
                        <p className="italic">{advice.summary}</p>
                        <div>
                            <h4 className="font-semibold mb-1">Strengths:</h4>
                            <p className="whitespace-pre-wrap text-muted-foreground">{advice.strengths}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold mb-1">Recommendations:</h4>
                            <p className="whitespace-pre-wrap text-muted-foreground">{advice.recommendations}</p>
                        </div>
                    </div>
                ) : (
                    <p>Could not load advice.</p>
                )}
            </CardContent>
        </Card>
        
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2"><DollarSign /> Fee Status</CardTitle>
                </CardHeader>
                <CardContent>
                {childFinance ? (
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg">${childFinance.amountDue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Due: {childFinance.dueDate}</p>
                        </div>
                        <Badge variant={getFinanceBadgeVariant(childFinance.status)}>{childFinance.status}</Badge>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">No fee information available.</p>
                )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2"><GraduationCap /> Recent Grades</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {recentGrades.length > 0 ? recentGrades.map((grade, index) => (
                            <li key={index} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{grade.subject}</span>
                                <Badge variant={grade.grade.includes('A') ? 'secondary' : 'outline'}>{grade.grade}</Badge>
                            </li>
                        )) : <p className="text-muted-foreground text-sm">No recent grades.</p>}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
      </CardContent>
    </Card>
  )
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const { studentsData, grades, attendance, financeData, isLoading: schoolDataLoading } = useSchoolData();
  
  if (schoolDataLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!studentsData || studentsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Student Data Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No student information is linked to your account. Please contact school administration.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Parent Dashboard</h2>
        <p className="text-muted-foreground">Welcome, {user?.name}. Here is an overview for your children.</p>
      </header>
      <div className="space-y-8">
        {studentsData.map(child => (
          <ChildSummaryCard 
            key={child.id} 
            child={child} 
            allGrades={grades} 
            allAttendance={attendance}
            allFinance={financeData}
          />
        ))}
      </div>
    </div>
  );
}
