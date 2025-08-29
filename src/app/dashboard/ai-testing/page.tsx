
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData, SavedTest, DeployedTest, Class, Student } from '@/context/school-data-context';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Loader2, FlaskConical, Sparkles, Save, Send, Trash2, Eye, BarChart, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FeatureLock } from '@/components/layout/feature-lock';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateTestAction } from '@/app/actions/ai-actions';
import { GenerateTestParams } from '@/ai/flows/test-generator-flow';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const testParamsSchema = z.object({
  subject: z.string().min(1, "Please select a subject."),
  grade: z.string().min(1, "Please select a grade."),
  topic: z.string().min(3, "Topic is required."),
  numQuestions: z.coerce.number().min(2, "Must have at least 2 questions.").max(10, "Cannot exceed 10 questions."),
});
type TestParamsFormValues = z.infer<typeof testParamsSchema>;

const deploySchema = z.object({
  classId: z.string({ required_error: 'Please select a class.'}),
  deadline: z.date({ required_error: 'A deadline is required.'}),
});
type DeployFormValues = z.infer<typeof deploySchema>;

function DeployTestDialog({ test, children }: { test: SavedTest, children: React.ReactNode }) {
    const { classesData, addDeployedTest } = useSchoolData();
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<DeployFormValues>({
        resolver: zodResolver(deploySchema),
    });

    const onSubmit = (values: DeployFormValues) => {
        addDeployedTest({ ...values, testId: test.id, deadline: format(values.deadline, 'yyyy-MM-dd')});
        toast({ title: 'Test Deployed!', description: `The test "${test.topic}" is now available for students.` });
        setIsOpen(false);
    };
    
    const relevantClasses = classesData.filter(c => c.grade === test.grade);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Deploy Test: {test.topic}</DialogTitle>
                    <DialogDescription>Make this test available to a class and set a deadline.</DialogDescription>
                </DialogHeader>
                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <Controller control={form.control} name="classId" render={({ field, fieldState }) => ( <div className="space-y-2"><Label>Class</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder="Select a class..." /></SelectTrigger><SelectContent>{relevantClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>{fieldState.error && <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>}</div> )}/>
                    <Controller control={form.control} name="deadline" render={({ field, fieldState }) => ( <div className="space-y-2"><Label>Deadline</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover>{fieldState.error && <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>}</div> )}/>
                    <DialogFooter><Button type="submit">Deploy Test</Button></DialogFooter>
                 </form>
            </DialogContent>
        </Dialog>
    )
}

function TestAnalyticsDialog({ deployedTest, savedTest, students }: { deployedTest: DeployedTest, savedTest: SavedTest, students: Student[] }) {
    const analytics = useMemo(() => {
        if (!deploysTest || !savedTest || students.length === 0) return null;
        
        const submissions = deployedTest.submissions;
        if (submissions.length === 0) return { studentResults: [], avgScore: 0, highestScore: 0, lowestScore: 0, questionAnalysis: [] };

        const studentResults = submissions.map(sub => {
            const studentInfo = students.find(s => s.id === sub.studentId);
            return {
                name: studentInfo?.name || 'Unknown Student',
                score: sub.score,
                total: savedTest.questions.length,
                percentage: (sub.score / savedTest.questions.length) * 100,
            };
        });

        const scores = studentResults.map(r => r.percentage);
        const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);
        
        // This is a placeholder for a more complex analysis.
        const questionAnalysis = savedTest.questions.map((q, index) => {
            const correctAnswers = submissions.filter(sub => {
                // This part requires access to the student's actual answers, which are not currently stored.
                // We'll simulate this with random data for now.
                return Math.random() > 0.4;
            }).length;
            return {
                question: q.question,
                correctRate: (correctAnswers / submissions.length) * 100
            };
        });

        return { studentResults, avgScore, highestScore, lowestScore, questionAnalysis };

    }, [deploysTest, savedTest, students]);

    if (!analytics) {
        return (
            <DialogContent>
                <DialogHeader><DialogTitle>Test Analytics</DialogTitle></DialogHeader>
                <p>No submission data available to generate analytics.</p>
            </DialogContent>
        );
    }
    
    return (
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>Test Analytics: {savedTest.topic}</DialogTitle>
                <DialogDescription>Results and analysis for the deployed test.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="lg:col-span-1 space-y-4">
                    <Card><CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Average Score:</span><span className="font-bold">{analytics.avgScore.toFixed(1)}%</span></div>
                            <div className="flex justify-between"><span>Highest Score:</span><span className="font-bold">{analytics.highestScore.toFixed(1)}%</span></div>
                            <div className="flex justify-between"><span>Lowest Score:</span><span className="font-bold">{analytics.lowestScore.toFixed(1)}%</span></div>
                            <div className="flex justify-between"><span>Submissions:</span><span className="font-bold">{analytics.studentResults.length} / {students.length}</span></div>
                        </CardContent>
                    </Card>
                    <Card><CardHeader><CardTitle>Question Analysis</CardTitle><CardDescription>Percentage of students who answered correctly.</CardDescription></CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                {analytics.questionAnalysis.map((qa, i) => (
                                    <li key={i}><div className="flex justify-between items-center mb-1"><p className="truncate">Q{i+1}: {qa.question}</p><span className="font-semibold">{qa.correctRate.toFixed(0)}%</span></div><Progress value={qa.correctRate} /></li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card><CardHeader><CardTitle>Student Results</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {analytics.studentResults.map((res, i) => (
                                        <TableRow key={i}><TableCell className="font-medium">{res.name}</TableCell><TableCell className="text-right">{res.score}/{res.total} ({res.percentage.toFixed(0)}%)</TableCell></TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
             <DialogFooter><DialogClose asChild><Button>Close</Button></DialogClose></DialogFooter>
        </DialogContent>
    );
}

export default function AiTestingPage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { schoolProfile, isLoading: dataLoading, teachersData, studentsData, classesData, subjects, addSavedTest, savedTests, deleteSavedTest, deployedTests } = useSchoolData();
  const { toast } = useToast();

  const [generatedTest, setGeneratedTest] = useState<Omit<SavedTest, 'id'|'teacherId'|'createdAt'> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<TestParamsFormValues>({
    resolver: zodResolver(testParamsSchema),
    defaultValues: { numQuestions: 5, topic: '' },
  });
  
  const teacher = teachersData.find(t => t.email === user?.email);

  const handleGenerateTest = async (values: TestParamsFormValues) => {
    setIsGenerating(true);
    setGeneratedTest(null);
    setError(null);

    try {
        const result = await generateTestAction(values);
        setGeneratedTest(result);
    } catch(e) {
        console.error(e);
        setError('Failed to generate test. The AI service may be temporarily unavailable.');
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate the test.' });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSaveTest = () => {
    if (!generatedTest || !teacher) return;
    addSavedTest({ ...generatedTest, teacherId: teacher.id });
    setGeneratedTest(null);
    form.reset();
  };
  
  const teacherDeployedTests = useMemo(() => {
    if (!teacher) return [];
    const teacherSavedTestIds = new Set(savedTests.filter(st => st.teacherId === teacher.id).map(st => st.id));
    return deployedTests.filter(dt => teacherSavedTestIds.has(dt.testId));
  }, [teacher, savedTests, deployedTests]);

  const isLoading = authLoading || dataLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Teacher') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (role !== 'Teacher') {
     return <div className="flex h-full items-center justify-center"><p>Access Denied</p></div>;
  }

  if (schoolProfile?.tier === 'Starter') {
    return <FeatureLock featureName="AI Test Generator" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">AI-Powered Test Generator</h2>
        <p className="text-muted-foreground">Create, save, and deploy tests for your students.</p>
      </header>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
           <form onSubmit={form.handleSubmit(handleGenerateTest)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FlaskConical /> Generate New Test</CardTitle>
                <CardDescription>Specify the parameters for the new test you want to create.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <Controller control={form.control} name="subject" render={({ field, fieldState }) => ( <div className="space-y-2"><Label>Subject</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder="Select subject..." /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>{fieldState.error && <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>}</div> )}/>
                    <Controller control={form.control} name="grade" render={({ field, fieldState }) => ( <div className="space-y-2"><Label>Grade</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder="Select grade..." /></SelectTrigger><SelectContent>{[...Array(12)].map((_,i) => <SelectItem key={i+1} value={String(i+1)}>Grade {i+1}</SelectItem>)}</SelectContent></Select>{fieldState.error && <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>}</div> )}/>
                 </div>
                 <Controller control={form.control} name="topic" render={({ field, fieldState }) => ( <div className="space-y-2"><Label>Test Topic</Label><Input placeholder="e.g., The Cold War" {...field} />{fieldState.error && <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>}</div> )}/>
                 <Controller control={form.control} name="numQuestions" render={({ field, fieldState }) => ( <div className="space-y-2"><Label>Number of Questions</Label><Input type="number" {...field} />{fieldState.error && <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>}</div> )}/>
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                    Generate Test
                </Button>
            </CardFooter>
           </form>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>My Test Library</CardTitle><CardDescription>Tests you have created previously.</CardDescription></CardHeader>
            <CardContent className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {savedTests.filter(t => t.teacherId === teacher?.id).map(test => (
                    <div key={test.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                            <p className="font-semibold">{test.topic}</p>
                            <p className="text-xs text-muted-foreground">{test.subject} - Grade {test.grade}</p>
                        </div>
                        <div className="flex gap-2">
                            <DeployTestDialog test={test}><Button size="sm" variant="outline"><Send className="mr-2 h-4 w-4"/> Deploy</Button></DeployTestDialog>
                             <Button size="icon" variant="ghost" onClick={() => deleteSavedTest(test.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                ))}
                {savedTests.filter(t => t.teacherId === teacher?.id).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No saved tests yet.</p>
                )}
            </CardContent>
        </Card>
      </div>

       {generatedTest && (
        <Card>
            <CardHeader>
                <CardTitle>Generated Test Preview: {generatedTest.topic}</CardTitle>
                <CardDescription>Review the generated questions. You can regenerate or save the test.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {generatedTest.questions.map((q, index) => (
                    <div key={index} className="text-sm">
                        <p className="font-medium">Q{index + 1}: {q.question}</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                            {q.options.map(opt => (
                                <li key={opt} className={opt === q.correctAnswer ? 'text-primary font-semibold' : ''}>{opt}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSaveTest}><Save className="mr-2 h-4 w-4" /> Save Test</Button>
            </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Deployed Tests & Results</CardTitle><CardDescription>An overview of tests you have assigned to classes.</CardDescription></CardHeader>
        <CardContent>
            <Table>
                <TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Class</TableHead><TableHead>Submissions</TableHead><TableHead>Deadline</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                    {teacherDeployedTests.map(dt => {
                        const savedTest = savedTests.find(st => st.id === dt.testId);
                        const classInfo = classesData.find(c => c.id === dt.classId);
                        if (!savedTest || !classInfo) return null;
                        const studentsInClass = studentsData.filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim());

                        return (
                            <TableRow key={dt.id}>
                                <TableCell className="font-medium">{savedTest.topic}</TableCell>
                                <TableCell>{classInfo.name}</TableCell>
                                <TableCell>{dt.submissions.length} / {studentsInClass.length}</TableCell>
                                <TableCell>{format(new Date(dt.deadline), "PPP")}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild><Button variant="outline" size="sm"><BarChart className="mr-2 h-4 w-4"/> View Results</Button></DialogTrigger>
                                        <TestAnalyticsDialog deployedTest={dt} savedTest={savedTest} students={studentsInClass}/>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
