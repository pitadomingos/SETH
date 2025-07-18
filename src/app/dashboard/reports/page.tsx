
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2, User, GitCompareArrows } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSchoolData, SavedReport } from '@/context/school-data-context';
import { analyzeSchoolPerformance } from '@/ai/flows/analyze-school-performance';
import { analyzeClassPerformance } from '@/ai/flows/analyze-class-performance';
import { identifyStrugglingStudents } from '@/ai/flows/identify-struggling-students';
import { analyzeTeacherPerformance } from '@/ai/flows/analyze-teacher-performance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { getLetterGrade } from '@/lib/utils';
import { format as formatDate } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { FeatureLock } from '@/components/layout/feature-lock';


// School-Wide Analysis Component
function SchoolWideAnalysis() {
    const { studentsData, teachersData, financeData, addSavedReport } = useSchoolData();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);

    const handleAnalysis = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const analysis = await analyzeSchoolPerformance({
                studentCount: studentsData.length,
                teacherCount: teachersData.length,
                annualRevenue: financeData.reduce((acc, f) => acc + f.amountPaid, 0),
            });
            setResult(analysis);
            addSavedReport({ type: 'SchoolPerformance', targetId: 'school-wide', targetName: 'School-Wide Analysis', result: analysis });
        } catch (error) {
            console.error("Failed to analyze school performance:", error);
            toast({ variant: 'destructive', title: 'Analysis Failed' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>School-Wide Holistic Analysis</CardTitle>
                <CardDescription>Generate a comprehensive report on the school's overall academic and financial health.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={handleAnalysis} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Analyze School Performance</Button>
                {result && (
                    <div className="p-4 border rounded-md">
                        <p className="whitespace-pre-wrap">{result.analysis}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Class Analysis Component
function ClassAnalysis() {
  const { classesData, subjects, grades, studentsData, addSavedReport } = useSchoolData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const gradeDistribution = useMemo(() => {
    if (!result || !result.gradeDistribution) return [];
    return Object.entries(result.gradeDistribution).map(([grade, count]) => ({ grade, count }));
  }, [result]);

  const handleAnalysis = async () => {
    if (!selectedClassId || !selectedSubject) {
      toast({ variant: 'destructive', title: 'Please select a class and subject' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const selectedClass = classesData.find(c => c.id === selectedClassId);
      if (!selectedClass) throw new Error("Class not found");

      const studentIdsInClass = studentsData.filter(s => s.grade === selectedClass.grade && s.class === selectedClass.name.split('-')[1].trim()).map(s => s.id);
      const relevantGrades = grades.filter(g => g.subject === selectedSubject && studentIdsInClass.includes(g.studentId)).map(g => g.grade);
      
      const analysis = await analyzeClassPerformance({ className: selectedClass.name, subject: selectedSubject, grades: relevantGrades });
      setResult(analysis);
      addSavedReport({ type: 'ClassPerformance', targetId: `${selectedClassId}-${selectedSubject}`, targetName: `${selectedClass.name} - ${selectedSubject}`, result: analysis });
    } catch (error) {
      console.error("Failed to analyze class performance:", error);
      toast({ variant: 'destructive', title: 'Analysis Failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig: ChartConfig = {
    count: { label: 'Students' },
    A: { label: 'A', color: '#22c55e' },
    B: { label: 'B', color: '#84cc16' },
    C: { label: 'C', color: '#facc15' },
    D: { label: 'D', color: '#f97316' },
    F: { label: 'F', color: '#ef4444' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Performance Analysis</CardTitle>
        <CardDescription>Select a class and subject to get a performance analysis and grade distribution chart.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Class" /></SelectTrigger><SelectContent>{classesData.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Subject" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          <Button onClick={handleAnalysis} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Analyze</Button>
        </div>
        {result && (
          <div className="grid gap-6 md:grid-cols-2 pt-4">
            <div className="p-4 border rounded-md space-y-4">
              <div><h4 className="font-semibold">AI Analysis</h4><p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.analysis}</p></div>
              <div><h4 className="font-semibold">Recommendation</h4><p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.recommendation}</p></div>
            </div>
             <ChartContainer config={chartConfig} className="w-full h-[300px]">
                <BarChart data={gradeDistribution} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="grade" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="count" radius={4}>
                    {gradeDistribution.map((entry) => (<Cell key={entry.grade} fill={chartConfig[entry.grade]?.color} />))}
                  </Bar>
                </BarChart>
              </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Struggling Students Component
function StrugglingStudents() {
  const { studentsData, grades, addSavedReport } = useSchoolData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const allGrades = grades.map(g => ({ studentId: g.studentId, grade: parseFloat(g.grade) }));
      const analysis = await identifyStrugglingStudents({ grades: allGrades });
      setResult(analysis);
      addSavedReport({ type: 'StrugglingStudents', targetId: 'school-wide', targetName: 'Struggling Students Report', result: analysis });
    } catch (error) {
      console.error("Failed to identify struggling students:", error);
      toast({ variant: 'destructive', title: 'Analysis Failed' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStudentName = (id: string) => studentsData.find(s => s.id === id)?.name || id;
  const getStudentClass = (id: string) => {
    const student = studentsData.find(s => s.id === id);
    return student ? `Grade ${student.grade}-${student.class}` : 'N/A';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identify Struggling Students</CardTitle>
        <CardDescription>Run an analysis across the school to identify students who may need academic intervention.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalysis} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Identify Students</Button>
        {result && (
          <div className="p-4 border rounded-md">
            <h4 className="font-semibold mb-2">Students Recommended for Intervention:</h4>
            {result.strugglingStudents.length > 0 ? (
                <ul>
                    {result.strugglingStudents.map((student: any) => (
                        <li key={student.studentId} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                            <div>
                                <p className="font-medium">{getStudentName(student.studentId)} <span className="text-xs text-muted-foreground">({getStudentClass(student.studentId)})</span></p>
                                <p className="text-sm text-muted-foreground">{student.reason}</p>
                            </div>
                             <Badge variant="destructive">Avg: {student.averageGrade.toFixed(1)}</Badge>
                        </li>
                    ))}
                </ul>
            ) : <p className="text-muted-foreground">No students identified for intervention at this time.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Teacher Performance Component
function TeacherPerformance() {
  const { teachersData, coursesData, classesData, studentsData, grades, addSavedReport } = useSchoolData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  
  const handleAnalysis = async () => {
    if (!selectedTeacherId) {
      toast({ variant: 'destructive', title: 'Please select a teacher' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const teacher = teachersData.find(t => t.id === selectedTeacherId);
      if (!teacher) throw new Error("Teacher not found");
      
      const teacherCourses = coursesData.filter(c => c.teacherId === teacher.id);
      const studentIds = new Set<string>();
      teacherCourses.forEach(course => {
        const classInfo = classesData.find(c => c.id === course.classId);
        if (classInfo) {
          studentsData
            .filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim())
            .forEach(s => studentIds.add(s.id));
        }
      });

      const relevantGrades = grades
        .filter(g => studentIds.has(g.studentId) && teacherCourses.some(c => c.subject === g.subject))
        .map(g => parseFloat(g.grade));

      const analysis = await analyzeTeacherPerformance({ teacherName: teacher.name, grades: relevantGrades });
      setResult(analysis);
      addSavedReport({ type: 'TeacherPerformance', targetId: selectedTeacherId, targetName: teacher.name, result: analysis });
    } catch (error) {
      console.error("Failed to analyze teacher performance:", error);
      toast({ variant: 'destructive', title: 'Analysis Failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Performance Analysis</CardTitle>
        <CardDescription>Select a teacher to analyze their students' performance across classes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Teacher" /></SelectTrigger><SelectContent>{teachersData.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
          <Button onClick={handleAnalysis} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Analyze</Button>
        </div>
        {result && (
          <div className="p-4 border rounded-md space-y-4">
            <div><h4 className="font-semibold">Overall Performance Score</h4><p className="text-3xl font-bold text-primary">{result.performanceScore}<span className="text-sm text-muted-foreground">/100</span></p></div>
            <div><h4 className="font-semibold">Analysis</h4><p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.analysis}</p></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Saved Reports Component
function SavedReports() {
    const { savedReports } = useSchoolData();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>A log of previously generated AI analysis reports.</CardDescription>
            </CardHeader>
            <CardContent>
                {savedReports.length > 0 ? (
                    <ul className="space-y-3">
                        {savedReports.map(report => (
                            <li key={report.id} className="flex justify-between items-center p-3 border rounded-lg">
                                <div>
                                    <p className="font-semibold">{report.targetName}</p>
                                    <p className="text-xs text-muted-foreground">{report.type} - {formatDate(new Date(report.generatedAt), 'PPP p')}</p>
                                </div>
                                <Button variant="outline" size="sm">View</Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No reports saved yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function ReportsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { schoolProfile, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();

  const isLoading = authLoading || schoolLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (role !== 'Admin') {
     return <div className="flex h-full items-center justify-center"><p>Access Denied</p></div>;
  }

  if (schoolProfile?.tier === 'Starter') {
    return <FeatureLock featureName="AI Reports" />;
  }
  
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Academic Reports</h2>
        <p className="text-muted-foreground">Generate on-demand academic analysis for your classes, students, and teachers.</p>
      </header>
      
      <Tabs defaultValue="school-wide-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="school-wide-analysis">School-Wide</TabsTrigger>
          <TabsTrigger value="class-analysis">Class Analysis</TabsTrigger>
          <TabsTrigger value="struggling-students">Struggling Students</TabsTrigger>
          <TabsTrigger value="teacher-performance">Teacher Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="school-wide-analysis">
          <SchoolWideAnalysis />
        </TabsContent>
        <TabsContent value="class-analysis">
          <ClassAnalysis />
        </TabsContent>
        <TabsContent value="struggling-students">
          <StrugglingStudents />
        </TabsContent>
        <TabsContent value="teacher-performance">
          <TeacherPerformance />
        </TabsContent>
      </Tabs>

      <SavedReports />
    </div>
  );
}
