
'use client';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { useSchoolData, FinanceRecord } from '@/context/school-data-context';
import { generateParentAdvice, GenerateParentAdviceOutput } from '@/ai/flows/generate-parent-advice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, User, GraduationCap, DollarSign, ListChecks, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart } from 'recharts';

function AIGeneratedAdvice({ child, childGrades, childAttendanceSummary }) {
  const { toast } = useToast();
  const [advice, setAdvice] = useState<GenerateParentAdviceOutput | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(true);

  useEffect(() => {
    if (!child) return;
    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      setAdvice(null);
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

  return (
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
  )
}

const gpaMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };
const getLetterGrade = (numericGrade: number): string => {
  if (numericGrade >= 19) return 'A+';
  if (numericGrade >= 17) return 'A';
  if (numericGrade >= 16) return 'A-';
  if (numericGrade >= 15) return 'B+';
  if (numericGrade >= 14) return 'B';
  if (numericGrade >= 13) return 'B-';
  if (numericGrade >= 12) return 'C+';
  if (numericGrade >= 11) return 'C';
  if (numericGrade >= 10) return 'C-';
  if (numericGrade >= 8) return 'D';
  return 'F';
};

const formatGrade = (grade: string): string => {
  const numericGrade = parseFloat(grade);
  if (!isNaN(numericGrade) && isFinite(numericGrade)) {
    return `${numericGrade} (${getLetterGrade(numericGrade)})`;
  }
  return grade;
};

const calculateGpaFromGrade = (grade: string): number => {
    const numericGrade = parseFloat(grade);
    if (!isNaN(numericGrade) && isFinite(numericGrade)) {
        return (numericGrade / 5.0);
    }
    return gpaMap[grade] || 0;
}

function GradeDistribution({ grades }) {
  const chartData = useMemo(() => {
    return grades.map(grade => ({
      subject: grade.subject,
      gpa: calculateGpaFromGrade(grade.grade)
    }));
  }, [grades]);

  const chartConfig = {
    gpa: {
      label: 'GPA',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart2 /> Grade Distribution</CardTitle>
        <CardDescription>Performance by subject based on GPA.</CardDescription>
      </CardHeader>
      <CardContent>
        {grades.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <BarChart data={chartData} margin={{ top: 20 }}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="gpa" fill="var(--color-gpa)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>No grade data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const getStatusInfo = (fee: FinanceRecord) => {
    const balance = fee.totalAmount - fee.amountPaid;
    const isOverdue = new Date(fee.dueDate) < new Date() && balance > 0;

    if (balance <= 0) {
        return { text: 'Paid', variant: 'secondary' as const };
    }
    if (isOverdue) {
        return { text: 'Overdue', variant: 'destructive' as const };
    }
     if (fee.amountPaid > 0) {
        return { text: 'Partially Paid', variant: 'outline' as const };
    }
    return { text: 'Pending', variant: 'outline' as const };
};

export default function ParentDashboard() {
  const { user } = useAuth();
  const { studentsData, grades, attendance, financeData, isLoading: schoolDataLoading } = useSchoolData();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedChildId && studentsData.length > 0) {
      setSelectedChildId(studentsData[0].id);
    }
  }, [studentsData, selectedChildId]);

  const selectedChild = useMemo(() => studentsData.find(c => c.id === selectedChildId), [selectedChildId, studentsData]);

  const childGrades = useMemo(() => {
    if (!selectedChildId) return [];
    return grades.filter(g => g.studentId === selectedChildId);
  }, [grades, selectedChildId]);
  
  const childAttendanceSummary = useMemo(() => {
    if (!selectedChildId) return { present: 0, late: 0, absent: 0 };
    const records = attendance.filter(a => a.studentId === selectedChildId);
    return records.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, { present: 0, late: 0, absent: 0 });
  }, [attendance, selectedChildId]);

  const childFinanceSummary = useMemo(() => {
    if (!selectedChildId) return null;
    const childFees = financeData.filter(f => f.studentId === selectedChildId);
    if (childFees.length === 0) return null;
    // Prioritize showing an overdue fee, then a partially paid/pending one.
    const overdue = childFees.find(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) < new Date());
    if (overdue) return overdue;
    const pending = childFees.find(f => f.totalAmount - f.amountPaid > 0);
    if (pending) return pending;
    return childFees[0]; // Otherwise show the first one (likely a paid one)
  }, [financeData, selectedChildId]);

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

      <div>
        <h3 className="text-lg font-medium mb-2">Select a Child</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentsData.map(child => (
            <Card 
              key={child.id} 
              onClick={() => setSelectedChildId(child.id)}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
                selectedChildId === child.id ? 'border-primary ring-2 ring-primary/50' : 'border-border'
              )}
            >
              <CardHeader>
                <CardTitle>{child.name}</CardTitle>
                <CardDescription>{child.schoolName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Grade {child.grade} - {child.class}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {selectedChild ? (
        <div className="space-y-6 animate-in fade-in-25">
           <div className="grid gap-6 lg:grid-cols-3">
            {selectedChild && (
              <AIGeneratedAdvice
                child={selectedChild}
                childGrades={childGrades}
                childAttendanceSummary={childAttendanceSummary}
              />
            )}
             <div className="space-y-6">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2"><DollarSign /> Fee Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                    {childFinanceSummary ? (
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Balance: <span className="font-bold text-lg">${(childFinanceSummary.totalAmount - childFinanceSummary.amountPaid).toLocaleString()}</span></p>
                                <p className="text-xs text-muted-foreground">Due: {new Date(childFinanceSummary.dueDate).toLocaleDateString()}</p>
                            </div>
                            <Badge variant={getStatusInfo(childFinanceSummary).variant}>{getStatusInfo(childFinanceSummary).text}</Badge>
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
                            {childGrades.length > 0 ? childGrades.slice(0, 3).map((grade, index) => {
                              const gpa = calculateGpaFromGrade(grade.grade);
                              return (
                                <li key={index} className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{grade.subject}</span>
                                    <Badge variant={gpa >= 3.7 ? 'secondary' : 'outline'}>{formatGrade(grade.grade)}</Badge>
                                </li>
                              )
                            }) : <p className="text-muted-foreground text-sm">No recent grades.</p>}
                        </ul>
                    </CardContent>
                </Card>
              </div>
          </div>
          <GradeDistribution grades={childGrades} />
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>Please select a child to view their details.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
