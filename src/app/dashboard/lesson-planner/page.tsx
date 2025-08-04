
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData, Class, Course, Syllabus, Grade, Student } from '@/context/school-data-context';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Loader2, PenSquare, Sparkles, Printer, AlertTriangle, Book, FlaskConical, Target, ClipboardCheck, List } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FeatureLock } from '@/components/layout/feature-lock';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useReactToPrint } from 'react-to-print';
import { generateLessonPlanAction } from '@/app/actions/ai-actions';
import { GenerateLessonPlanParams, LessonPlan } from '@/ai/flows/lesson-planner-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

export default function LessonPlannerPage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { schoolProfile, isLoading: dataLoading, coursesData, classesData, teachersData, syllabi, grades, studentsData } = useSchoolData();
  const { toast } = useToast();
  
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: generatedPlan?.title || 'Lesson Plan',
  });

  const isLoading = authLoading || dataLoading;

  const teacher = useMemo(() => {
    if (!user) return null;
    return teachersData.find(t => t.email === user.email);
  }, [user, teachersData]);
  
  const teacherCourses = useMemo(() => {
    if (!teacher) return [];
    return coursesData.filter(c => c.teacherId === teacher.id);
  }, [teacher, coursesData]);
  
  const teacherClasses = useMemo(() => {
    if (!teacherCourses.length) return [];
    const classIds = new Set(teacherCourses.map(c => c.classId));
    return classesData.filter(c => classIds.has(c.id));
  }, [teacherCourses, classesData]);

  const selectedCourse = teacherCourses.find(c => c.id === selectedCourseId);
  const selectedClass = classesData.find(c => c.id === selectedCourse?.classId);

  useEffect(() => {
    if (!isLoading && role !== 'Teacher') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  const handleGeneratePlan = async () => {
    if (!selectedCourse || !selectedClass) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a valid course and class.' });
        return;
    }
    setIsGenerating(true);
    setGeneratedPlan(null);
    setError(null);
    
    const relevantSyllabus = syllabi.find(s => s.subject === selectedCourse.subject && s.grade === selectedClass.grade);
    const classStudents = studentsData.filter(s => s.grade === selectedClass.grade && s.class === selectedClass.name.split('-')[1].trim());
    const studentIds = classStudents.map(s => s.id);

    const recentGrades = grades
        .filter(g => studentIds.includes(g.studentId) && g.subject === selectedCourse.subject)
        .sort((a,b) => {
            const dateA = a.date.toDate ? a.date.toDate() : new Date(a.date);
            const dateB = b.date.toDate ? b.date.toDate() : new Date(b.date);
            return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 20); 

    const performanceSummary = recentGrades.map(g => {
        const studentName = studentsData.find(s => s.id === g.studentId)?.name || 'Unknown Student';
        return { studentName, grade: g.grade, description: g.description };
    });

    const params: GenerateLessonPlanParams = {
        subject: selectedCourse.subject,
        grade: selectedClass.grade,
        syllabusTopics: relevantSyllabus?.topics.map(t => `Week ${t.week}: ${t.topic}`) || [],
        recentStudentPerformance: performanceSummary
    };

    try {
        const plan = await generateLessonPlanAction(params);
        setGeneratedPlan(plan);
    } catch(e) {
        console.error(e);
        setError('Failed to generate lesson plan. The AI service may be temporarily unavailable.');
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate the lesson plan.' });
    } finally {
        setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (role !== 'Teacher') {
     return <div className="flex h-full items-center justify-center"><p>Access Denied</p></div>;
  }

  if (schoolProfile?.tier === 'Starter') {
    return <FeatureLock featureName="AI Lesson Planner" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">AI-Powered Weekly Lesson Planner</h2>
        <p className="text-muted-foreground">Generate, save, and print performance-aware weekly lesson plans for your classes.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PenSquare /> Generate a New Plan</CardTitle>
          <CardDescription>
            Select a course to generate a tailored lesson plan. The AI will consider the syllabus and recent student performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-wrap items-center gap-4">
            <Select onValueChange={setSelectedCourseId} value={selectedCourseId}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a course..." />
              </SelectTrigger>
              <SelectContent>
                {teacherCourses.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                        {classesData.find(cls => cls.id === c.classId)?.name} - {c.subject}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGeneratePlan} disabled={isGenerating || !selectedCourseId}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                Generate Lesson Plan
            </Button>
           </div>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedPlan && (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                        <CardTitle className="text-2xl">{generatedPlan.title}</CardTitle>
                        <CardDescription>
                            A week-long plan for {selectedClass?.name} ({selectedCourse?.subject}).
                        </CardDescription>
                    </div>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print Plan
                    </Button>
                </div>
            </CardHeader>
            <CardContent ref={componentRef} className="space-y-6 print:p-0">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-muted/30">
                        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Target/> Weekly Objectives</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                {generatedPlan.weeklyObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                     <Card className="bg-muted/30">
                        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><List/> Materials Needed</CardTitle></CardHeader>
                        <CardContent>
                           <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                {generatedPlan.materialsNeeded.map((mat, i) => <li key={i}>{mat}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <Separator/>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Daily Breakdown</h3>
                  <Accordion type="multiple" defaultValue={['item-0']} className="w-full space-y-2">
                    {generatedPlan.dailyPlans.map((dayPlan, i) => (
                      <AccordionItem value={`item-${i}`} key={i} className="border-b-0 rounded-lg bg-background border">
                        <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">
                           Day {i+1}: {dayPlan.day} - {dayPlan.topic}
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0 space-y-4">
                          <div className="p-3 bg-muted/50 rounded-md">
                            <p className="font-semibold text-sm flex items-center gap-2"><Book className="h-4 w-4"/>Objective</p>
                            <p className="text-sm text-muted-foreground mt-1">{dayPlan.objective}</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-md">
                            <p className="font-semibold text-sm flex items-center gap-2"><FlaskConical className="h-4 w-4"/>Activities</p>
                             <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground mt-2">
                                {dayPlan.activities.map((act, j) => <li key={j}>{act}</li>)}
                            </ol>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-md">
                            <p className="font-semibold text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4"/>Assessment</p>
                             <p className="text-sm text-muted-foreground mt-1">{dayPlan.assessment}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
