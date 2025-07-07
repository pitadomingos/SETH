
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2, User, GitCompareArrows } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSchoolData, SavedReport } from '@/context/school-data-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzeSchoolPerformance, AnalyzeSchoolPerformanceOutput } from '@/ai/flows/analyze-school-performance';
import { analyzeClassPerformance, AnalyzeClassPerformanceOutput } from '@/ai/flows/analyze-class-performance';
import { identifyStrugglingStudents, IdentifyStrugglingStudentsOutput } from '@/ai/flows/identify-struggling-students';
import { analyzeTeacherPerformance, AnalyzeTeacherPerformanceOutput } from '@/ai/flows/analyze-teacher-performance';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { getLetterGrade } from '@/lib/utils';
import { format as formatDate } from 'date-fns';
import { Badge } from '@/components/ui/badge';


// School-Wide Analysis Component
function SchoolWideAnalysis() {
    const { 
        schoolProfile, 
        teachersData, 
        studentsData, 
        grades, 
        financeData, 
        coursesData, 
        subjects,
        classesData,
        savedReports,
        addSavedReport,
    } = useSchoolData();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalyzeSchoolPerformanceOutput | null>(null);

    const chartConfig = {
      value: { label: 'Value', color: 'hsl(var(--chart-1))' },
    } satisfies ChartConfig;

    const handleAnalysis = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            if (!schoolProfile || !teachersData.length || !studentsData.length || !grades.length) {
                throw new Error("Insufficient data for analysis.");
            }

            // Financials
            const totalFees = financeData.reduce((sum, f) => sum + f.totalAmount, 0);
            const totalRevenue = financeData.reduce((acc, f) => acc + f.amountPaid, 0);
            const collectionRate = totalFees > 0 ? (totalRevenue / totalFees) * 100 : 100;
            const overdueAmount = financeData
                .filter(f => new Date(f.dueDate) < new Date() && f.totalAmount > f.amountPaid)
                .reduce((sum, f) => sum + (f.totalAmount - f.amountPaid), 0);
            const financials = { totalFees, totalRevenue, collectionRate: parseFloat(collectionRate.toFixed(2)), overdueAmount };

            // Subjects
            const subjectMetrics = subjects.map(subject => {
                const subjectGrades = grades.filter(g => g.subject === subject).map(g => parseFloat(g.grade));
                if (subjectGrades.length === 0) return { name: subject, averageGrade: 0, failureRate: 0 };
                const averageGrade = subjectGrades.reduce((sum, g) => sum + g, 0) / subjectGrades.length;
                const failureRate = (subjectGrades.filter(g => g < 10).length / subjectGrades.length) * 100;
                return { name: subject, averageGrade: parseFloat(averageGrade.toFixed(2)), failureRate: parseFloat(failureRate.toFixed(2)) };
            });

            // Teachers
            const teacherMetrics = teachersData.map(teacher => {
                const teacherCourses = coursesData.filter(c => c.teacherId === teacher.id);
                const studentIds = new Set<string>();
                teacherCourses.forEach(course => {
                    const classInfo = classesData.find(c => c.id === course.classId);
                    if(classInfo) {
                        studentsData
                            .filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim())
                            .forEach(s => studentIds.add(s.id));
                    }
                });
                const teacherGrades = grades
                    .filter(g => studentIds.has(g.studentId) && g.subject === teacher.subject)
                    .map(g => parseFloat(g.grade));
                
                const averageGrade = teacherGrades.length > 0
                    ? teacherGrades.reduce((sum, g) => sum + g, 0) / teacherGrades.length
                    : 0;
                
                return { name: teacher.name, subject: teacher.subject, studentCount: studentIds.size, averageGrade: parseFloat(averageGrade.toFixed(2)) };
            });

            // Overall
            const allNumericGrades = grades.map(g => parseFloat(g.grade));
            const overallAverageGrade = allNumericGrades.length > 0
                ? allNumericGrades.reduce((sum, g) => sum + g, 0) / allNumericGrades.length
                : 0;

            const previousAnalysis = savedReports
                .filter(r => r.type === 'SchoolPerformance' && r.targetId === schoolProfile.id)
                .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())[0];

            const analysisInput = {
                schoolName: schoolProfile.name,
                teachers: teacherMetrics,
                subjects: subjectMetrics,
                financials,
                overallStudentCount: studentsData.length,
                overallAverageGrade: parseFloat(overallAverageGrade.toFixed(2)),
                previousAnalysis: previousAnalysis ? {
                    generatedAt: previousAnalysis.generatedAt.toISOString(),
                    result: previousAnalysis.result,
                } : undefined,
            };

            const res = await analyzeSchoolPerformance(analysisInput);
            setResult(res);

            addSavedReport({
                type: 'SchoolPerformance',
                targetId: schoolProfile.id,
                targetName: schoolProfile.name,
                result: res,
            });

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Analysis Failed', description: error instanceof Error ? error.message : "An unknown error occurred." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>School-Wide Holistic Analysis</CardTitle>
                <CardDescription>Generate a comprehensive AI-powered report on the school's overall academic and financial health.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={handleAnalysis} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Analyze School Performance'}</Button>
                {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                {result && (
                  <div className="pt-4 animate-in fade-in-50 grid gap-6 md:grid-cols-2">
                      <div className="space-y-4 text-sm">
                           <div className="p-4 rounded-md bg-muted max-h-[20rem] overflow-y-auto">
                              <h4 className="font-semibold mb-1">Holistic AI Analysis:</h4>
                              <p className="text-muted-foreground whitespace-pre-wrap">{result.holisticAnalysis}</p>
                          </div>
                           {result.comparisonAnalysis && (
                            <div className="p-4 rounded-md bg-blue-500/10 border border-blue-500/20">
                                <h4 className="font-semibold text-blue-600 flex items-center gap-2"><GitCompareArrows /> Comparison to Last Report</h4>
                                <p className="text-sm text-muted-foreground mt-1">{result.comparisonAnalysis}</p>
                            </div>
                          )}
                      </div>
                      <div className="space-y-4">
                            <div className="flex justify-between items-center bg-muted p-3 rounded-md">
                                <h4 className="font-semibold">Overall Performance Score</h4>
                                <Badge variant="outline" className="text-lg">{result.performanceScore.toFixed(1)} / 100</Badge>
                            </div>
                          {result.keyMetrics.length > 0 && (
                              <div>
                                  <h4 className="font-semibold mb-2 text-sm">Key Performance Indicators</h4>
                                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                      <BarChart data={result.keyMetrics} layout="vertical" margin={{ left: 10, right: 30 }}>
                                          <CartesianGrid horizontal={false} />
                                          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={120} />
                                          <XAxis type="number" hide />
                                          <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value, name, item) => `${value.toFixed(1)}${item.payload.unit || ''}`} />} />
                                          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                                      </BarChart>
                                  </ChartContainer>
                              </div>
                          )}
                      </div>
                  </div>
                )}
            </CardContent>
        </Card>
    );
}

// Class Analysis Component
function ClassAnalysis() {
  const { classesData, subjects, studentsData, grades, savedReports, addSavedReport } = useSchoolData();
  const { toast } = useToast();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeClassPerformanceOutput | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const chartConfig = {
    count: { label: 'Students', color: 'hsl(var(--chart-1))' },
  } satisfies ChartConfig;

  const handleAnalysis = async () => {
    if (!selectedClassId || !selectedSubject) {
      toast({ variant: 'destructive', title: 'Please select a class and a subject.' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    setChartData([]);
    try {
      const selectedClass = classesData.find(c => c.id === selectedClassId);
      if (!selectedClass) throw new Error('Class not found');
      
      const studentsInClass = studentsData.filter(s => s.grade === selectedClass.grade && s.class === selectedClass.name.split('-')[1].trim()).map(s => s.id);
      const relevantGrades = grades.filter(g => studentsInClass.includes(g.studentId) && g.subject === selectedSubject).map(g => g.grade);

      const targetId = `${selectedClassId}-${selectedSubject}`;
      const previousAnalysis = savedReports
          .filter(r => r.type === 'ClassPerformance' && r.targetId === targetId)
          .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())[0];

      const analysisResult = await analyzeClassPerformance({
        className: selectedClass.name,
        subject: selectedSubject,
        grades: relevantGrades,
        previousAnalysis: previousAnalysis ? {
            generatedAt: previousAnalysis.generatedAt.toISOString(),
            result: previousAnalysis.result,
        } : undefined,
      });
      setResult(analysisResult);
      
      addSavedReport({
        type: 'ClassPerformance',
        targetId,
        targetName: `${selectedClass.name} - ${selectedSubject}`,
        result: analysisResult,
      });

      if (relevantGrades.length > 0) {
        const gradeCounts = relevantGrades.reduce((acc, grade) => {
            const letterGrade = getLetterGrade(parseFloat(grade)).charAt(0);
            acc[letterGrade] = (acc[letterGrade] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const preparedChartData = ['A', 'B', 'C', 'D', 'F'].map(letter => ({
            grade: letter,
            count: gradeCounts[letter] || 0,
        }));
        setChartData(preparedChartData);
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Analysis Failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Performance Analysis</CardTitle>
        <CardDescription>Select a class and subject to get an AI-powered performance analysis and grade distribution chart.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Class" /></SelectTrigger><SelectContent>{classesData.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Subject" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          <Button onClick={handleAnalysis} disabled={isLoading || !selectedClassId || !selectedSubject}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Analyze'}</Button>
        </div>
        {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {result && (
          <div className="pt-4 animate-in fade-in-50 grid gap-6 md:grid-cols-2">
            <div className="space-y-4 text-sm">
                <div className={`p-4 rounded-md ${result.interventionNeeded ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted'}`}><h4 className="font-semibold mb-1">Analysis:</h4><p className="text-muted-foreground">{result.analysis}</p></div>
                <div className={`p-4 rounded-md ${result.interventionNeeded ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted'}`}><h4 className="font-semibold mb-1">Recommendation:</h4><p className="text-muted-foreground">{result.recommendation}</p></div>
                 {result.comparisonAnalysis && (
                    <div className="mt-4 p-4 rounded-md bg-blue-500/10 border border-blue-500/20">
                        <h4 className="font-semibold text-blue-600 flex items-center gap-2"><GitCompareArrows /> Comparison to Last Report</h4>
                        <p className="text-sm text-muted-foreground mt-1">{result.comparisonAnalysis}</p>
                    </div>
                )}
            </div>
            {chartData.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2 text-sm">Grade Distribution</h4>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="grade" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Struggling Students Component
function StrugglingStudents() {
  const { studentsData, grades } = useSchoolData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyStrugglingStudentsOutput | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const chartConfig = {
    count: { label: 'Struggling Students', color: 'hsl(var(--destructive))' },
  } satisfies ChartConfig;


  const handleAnalysis = async () => {
    setIsLoading(true);
    setResult(null);
    setChartData([]);
    try {
      const studentGradeInfo = studentsData.map(student => ({
        studentId: student.id,
        studentName: student.name,
        grades: grades.filter(g => g.studentId === student.id).map(g => ({ subject: g.subject, grade: g.grade })),
      }));
      const analysisResult = await identifyStrugglingStudents({ students: studentGradeInfo });
      setResult(analysisResult);

      if (analysisResult.strugglingStudents.length > 0) {
        const countsByGrade = analysisResult.strugglingStudents.reduce((acc, strugglingStudent) => {
          const studentInfo = studentsData.find(s => s.id === strugglingStudent.studentId);
          if (studentInfo) {
            const gradeKey = `Grade ${studentInfo.grade}`;
            acc[gradeKey] = (acc[gradeKey] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        const preparedChartData = Object.entries(countsByGrade).map(([grade, count]) => ({ grade, count }));
        setChartData(preparedChartData);
      }

    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Analysis Failed' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identify Struggling Students</CardTitle>
        <CardDescription>Run an analysis across the school to identify students who may need academic intervention, with a summary chart.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalysis} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Identify Students'}</Button>
        {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {result && (
          <div className="pt-4 animate-in fade-in-50">
            {result.strugglingStudents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                 <div className="max-h-96 overflow-y-auto pr-2">
                    <ul className="space-y-3">
                        {result.strugglingStudents.map(student => (
                        <li key={student.studentId} className="flex items-start gap-4 p-4 border rounded-lg">
                            <div className="flex items-center gap-3 flex-shrink-0 pt-1">
                                <User className="h-5 w-5 text-destructive" />
                                <span className="font-semibold">{student.studentName}</span>
                            </div>
                            <div className="flex-grow">
                            <p className="text-sm"><span className="font-semibold text-destructive">Reason:</span> {student.reason}</p>
                            <p className="text-sm text-muted-foreground"><span className="font-semibold">Suggestion:</span> {student.suggestedAction}</p>
                            </div>
                        </li>
                        ))}
                    </ul>
                 </div>
                 <div>
                    <h4 className="font-semibold mb-2 text-sm">Struggling Students by Grade Level</h4>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="grade" type="category" tickLine={false} axisLine={false} tickMargin={8} width={80} />
                            <XAxis type="number" hide />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                 </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Great news! No students were identified as struggling based on the criteria.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Teacher Performance Component
function TeacherPerformance() {
  const { teachersData, coursesData, classesData, grades, studentsData, savedReports, addSavedReport } = useSchoolData();
  const { toast } = useToast();
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeTeacherPerformanceOutput | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  const chartConfig = {
    avgGrade: { label: 'Avg Grade', color: 'hsl(var(--chart-1))' },
    passRate: { label: 'Pass Rate (%)', color: 'hsl(var(--chart-2))' },
  } satisfies ChartConfig;

  const handleAnalysis = async () => {
    if (!selectedTeacherId) {
      toast({ variant: 'destructive', title: 'Please select a teacher.' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    setChartData([]);
    try {
      const teacher = teachersData.find(t => t.id === selectedTeacherId);
      if (!teacher) throw new Error('Teacher not found');
      
      const teacherCourses = coursesData.filter(c => c.teacherId === teacher.id);
      const classPerformances = teacherCourses.map(course => {
        const classInfo = classesData.find(c => c.id === course.classId);
        if (!classInfo) return null;
        
        const studentsInClass = studentsData.filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim()).map(s => s.id);
        const classGrades = grades.filter(g => studentsInClass.includes(g.studentId) && g.subject === course.subject).map(g => parseFloat(g.grade));
        
        if (classGrades.length === 0) return { className: classInfo.name, averageGrade: 0, passingRate: 0 };
        
        const averageGrade = classGrades.reduce((sum, g) => sum + g, 0) / classGrades.length;
        const passingRate = (classGrades.filter(g => g >= 10).length / classGrades.length) * 100;

        return { className: classInfo.name, averageGrade: parseFloat(averageGrade.toFixed(2)), passingRate: parseFloat(passingRate.toFixed(2)) };
      }).filter(Boolean) as any[];

      const previousAnalysis = savedReports
          .filter(r => r.type === 'TeacherPerformance' && r.targetId === selectedTeacherId)
          .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())[0];

      const analysisResult = await analyzeTeacherPerformance({
        teacherName: teacher.name,
        subject: teacher.subject,
        classPerformances,
        previousAnalysis: previousAnalysis ? {
            generatedAt: previousAnalysis.generatedAt.toISOString(),
            result: previousAnalysis.result,
        } : undefined,
      });

      setResult(analysisResult);

      addSavedReport({
        type: 'TeacherPerformance',
        targetId: selectedTeacherId,
        targetName: teacher.name,
        result: analysisResult,
      });

      if (classPerformances.length > 0) {
        setChartData(classPerformances.map(cp => ({
            name: cp.className,
            avgGrade: cp.averageGrade,
            passRate: cp.passingRate,
        })));
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Analysis Failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Performance Analysis</CardTitle>
        <CardDescription>Select a teacher to analyze their students' performance across classes, supported by visual charts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Teacher" /></SelectTrigger><SelectContent>{teachersData.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
          <Button onClick={handleAnalysis} disabled={isLoading || !selectedTeacherId}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Analyze'}</Button>
        </div>
        {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {result && (
          <div className="pt-4 animate-in fade-in-50 grid gap-6 md:grid-cols-2">
            <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center bg-muted p-3 rounded-md">
                    <h4 className="font-semibold">Overall Performance Score</h4>
                    <Badge variant="outline" className="text-lg">{result.performanceScore.toFixed(1)} / 100</Badge>
                </div>
                <div className="p-4 rounded-md bg-muted"><h4 className="font-semibold mb-1">Overall Assessment:</h4><p className="text-muted-foreground">{result.overallAssessment}</p></div>
                <div className="p-4 rounded-md bg-muted"><h4 className="font-semibold mb-1">Strengths:</h4><p className="text-muted-foreground whitespace-pre-wrap">{result.strengths}</p></div>
                <div className="p-4 rounded-md bg-muted"><h4 className="font-semibold mb-1">Areas for Improvement:</h4><p className="text-muted-foreground whitespace-pre-wrap">{result.areasForImprovement}</p></div>
                 {result.comparisonAnalysis && (
                    <div className="mt-4 p-4 rounded-md bg-blue-500/10 border border-blue-500/20">
                        <h4 className="font-semibold text-blue-600 flex items-center gap-2"><GitCompareArrows /> Comparison to Last Report</h4>
                        <p className="text-sm text-muted-foreground mt-1">{result.comparisonAnalysis}</p>
                    </div>
                )}
            </div>
            {chartData.length > 0 && (
                <div>
                     <h4 className="font-semibold mb-2 text-sm">Class Performance Comparison</h4>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                       <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" allowDecimals={false} domain={[0, 20]}/>
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" allowDecimals={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="avgGrade" fill="var(--color-avgGrade)" radius={4} />
                            <Bar yAxisId="right" dataKey="passRate" fill="var(--color-passRate)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">AI Academic Reports</h2>
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
    </div>
  );
}
