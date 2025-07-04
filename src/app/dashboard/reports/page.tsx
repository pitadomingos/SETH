
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSchoolData } from '@/context/school-data-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzeClassPerformance, AnalyzeClassPerformanceOutput } from '@/ai/flows/analyze-class-performance';
import { identifyStrugglingStudents, IdentifyStrugglingStudentsOutput } from '@/ai/flows/identify-struggling-students';
import { analyzeTeacherPerformance, AnalyzeTeacherPerformanceOutput } from '@/ai/flows/analyze-teacher-performance';

// Class Analysis Component
function ClassAnalysis() {
  const { classesData, subjects, studentsData, grades } = useSchoolData();
  const { toast } = useToast();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeClassPerformanceOutput | null>(null);

  const handleAnalysis = async () => {
    if (!selectedClassId || !selectedSubject) {
      toast({ variant: 'destructive', title: 'Please select a class and a subject.' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const selectedClass = classesData.find(c => c.id === selectedClassId);
      if (!selectedClass) throw new Error('Class not found');
      
      const studentsInClass = studentsData.filter(s => s.grade === selectedClass.grade && s.class === selectedClass.name.split('-')[1].trim()).map(s => s.id);
      const relevantGrades = grades.filter(g => studentsInClass.includes(g.studentId) && g.subject === selectedSubject).map(g => g.grade);

      const analysisResult = await analyzeClassPerformance({
        className: selectedClass.name,
        subject: selectedSubject,
        grades: relevantGrades,
      });
      setResult(analysisResult);
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
        <CardDescription>Select a class and subject to get an AI-powered performance analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Class" /></SelectTrigger><SelectContent>{classesData.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Subject" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          <Button onClick={handleAnalysis} disabled={isLoading || !selectedClassId || !selectedSubject}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Analyze'}</Button>
        </div>
        {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {result && (
          <div className="space-y-4 pt-4 text-sm animate-in fade-in-50">
             <div className={`p-4 rounded-md ${result.interventionNeeded ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted'}`}><h4 className="font-semibold mb-1">Analysis:</h4><p className="text-muted-foreground">{result.analysis}</p></div>
             <div className={`p-4 rounded-md ${result.interventionNeeded ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted'}`}><h4 className="font-semibold mb-1">Recommendation:</h4><p className="text-muted-foreground">{result.recommendation}</p></div>
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

  const handleAnalysis = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const studentGradeInfo = studentsData.map(student => ({
        studentId: student.id,
        studentName: student.name,
        grades: grades.filter(g => g.studentId === student.id).map(g => ({ subject: g.subject, grade: g.grade })),
      }));
      const analysisResult = await identifyStrugglingStudents({ students: studentGradeInfo });
      setResult(analysisResult);
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
        <CardDescription>Run an analysis across the entire school to identify students who may need academic intervention.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalysis} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Identify Students'}</Button>
        {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {result && (
          <div className="pt-4 animate-in fade-in-50">
            {result.strugglingStudents.length > 0 ? (
              <ul className="space-y-3">
                {result.strugglingStudents.map(student => (
                  <li key={student.studentId} className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="bg-destructive/10 p-2 rounded-full"><User className="h-5 w-5 text-destructive" /></div>
                      <span className="font-semibold">{student.studentName}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm"><span className="font-semibold">Reason:</span> {student.reason}</p>
                      <p className="text-sm text-muted-foreground"><span className="font-semibold">Suggestion:</span> {student.suggestedAction}</p>
                    </div>
                  </li>
                ))}
              </ul>
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
  const { teachersData, coursesData, classesData, grades, studentsData } = useSchoolData();
  const { toast } = useToast();
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeTeacherPerformanceOutput | null>(null);

  const handleAnalysis = async () => {
    if (!selectedTeacherId) {
      toast({ variant: 'destructive', title: 'Please select a teacher.' });
      return;
    }
    setIsLoading(true);
    setResult(null);
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

      const analysisResult = await analyzeTeacherPerformance({ teacherName: teacher.name, subject: teacher.subject, classPerformances });
      setResult(analysisResult);
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
        <CardDescription>Select a teacher to analyze their students' performance across their classes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Teacher" /></SelectTrigger><SelectContent>{teachersData.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
          <Button onClick={handleAnalysis} disabled={isLoading || !selectedTeacherId}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Analyze'}</Button>
        </div>
        {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {result && (
          <div className="space-y-4 pt-4 text-sm animate-in fade-in-50">
            <div className="p-4 rounded-md bg-muted"><h4 className="font-semibold mb-1">Overall Assessment:</h4><p className="text-muted-foreground">{result.overallAssessment}</p></div>
            <div className="p-4 rounded-md bg-muted"><h4 className="font-semibold mb-1">Strengths:</h4><p className="text-muted-foreground whitespace-pre-wrap">{result.strengths}</p></div>
            <div className="p-4 rounded-md bg-muted"><h4 className="font-semibold mb-1">Areas for Improvement:</h4><p className="text-muted-foreground whitespace-pre-wrap">{result.areasForImprovement}</p></div>
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
      
      <Tabs defaultValue="class-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="class-analysis">Class Analysis</TabsTrigger>
          <TabsTrigger value="struggling-students">Struggling Students</TabsTrigger>
          <TabsTrigger value="teacher-performance">Teacher Performance</TabsTrigger>
        </TabsList>
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
