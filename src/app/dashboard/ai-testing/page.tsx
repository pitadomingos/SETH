
'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, FlaskConical, ChevronRight, Save, History, BookOpen, Trash2, Calendar as CalendarIcon, FileCheck, BrainCircuit } from 'lucide-react';
import { generateTest, type GenerateTestOutput } from '@/ai/flows/generate-test';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSchoolData, NewSavedTest, SavedTest, NewDeployedTestData, DeployedTest } from '@/context/school-data-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FeatureLock } from '@/components/layout/feature-lock';
import { analyzeTestResults, AnalyzeTestResultsOutput } from '@/ai/flows/analyze-test-results';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatGradeDisplay } from '@/lib/utils';


const GenerateTestInputSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  topic: z.string().min(1, 'Topic is required.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
  numQuestions: z.coerce.number().int().min(1).max(10),
});
type GenerateTestFormValues = z.infer<typeof GenerateTestInputSchema>;

const deployTestSchema = z.object({
    classId: z.string({ required_error: "Please select a class." }),
    deadline: z.date({ required_error: "A deadline is required." }),
});
type DeployTestFormValues = z.infer<typeof deployTestSchema>;


function GeneratedTestViewer({ test, onSave }: { test: GenerateTestOutput, onSave: () => void }) {
  return (
     <Card className="min-h-[500px]">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>Generated Test Preview</CardTitle>
          <CardDescription>Review the questions below. You must save the test to deploy it later.</CardDescription>
        </div>
        <Button onClick={onSave}><Save className="mr-2 h-4 w-4"/> Save for Later</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {test.questions.map((q, index) => (
            <div key={index} className="space-y-3">
              <p className="font-semibold">{index + 1}. {q.questionText}</p>
                <RadioGroup value={q.correctAnswer} disabled>
                  {q.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                          <Label htmlFor={`q${index}-o${optionIndex}`} className={option === q.correctAnswer ? 'text-primary font-bold' : ''}>
                              {option}
                          </Label>
                          {option === q.correctAnswer && (
                            <Badge variant="secondary" className="ml-2">Correct Answer</Badge>
                          )}
                      </div>
                  ))}
                </RadioGroup>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


function DeployTestDialog({ test }: { test: SavedTest }) {
    const { toast } = useToast();
    const { addDeployedTest, classesData } = useSchoolData();
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<DeployTestFormValues>({
        resolver: zodResolver(deployTestSchema),
        defaultValues: {
            classId: '',
            deadline: new Date(),
        }
    });

    function onSubmit(values: DeployTestFormValues) {
        const newDeployment: NewDeployedTestData = {
            testId: test.id,
            classId: values.classId,
            deadline: values.deadline,
        };
        addDeployedTest(newDeployment);
        toast({
            title: 'Test Deployed!',
            description: `${test.topic} has been assigned and is now available to students.`,
        });
        setIsOpen(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><ChevronRight className="mr-2 h-4 w-4" /> Deploy Test</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Deploy "{test.topic}"</DialogTitle>
                    <DialogDescription>Assign this test to a class and set a completion deadline.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="classId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assign to Class</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a class..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {classesData.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="deadline" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Deadline</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter className="pt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit">Confirm & Deploy</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteTestDialog({ test, onDelete }: { test: SavedTest; onDelete: (testId: string) => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the test "{test.topic}" and all of its deployments and submissions. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(test.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, delete test
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ViewResultsDialog({ deployment, test }: { deployment: DeployedTest; test: SavedTest; }) {
  const { studentsData, schoolProfile } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeTestResultsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const submissions = deployment.submissions.map(sub => {
        const student = studentsData.find(s => s.id === sub.studentId);
        return {
          studentId: sub.studentId,
          studentName: student?.name || 'Unknown Student',
          score: sub.score,
          answers: sub.answers,
        };
      });

      const result = await analyzeTestResults({
        testTopic: test.topic,
        questions: test.questions,
        submissions,
      });
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not run the results analysis. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setAnalysisResult(null);
      setIsLoading(false);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><FileCheck className="mr-2 h-4 w-4" /> View Results</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Results for "{test.topic}"</DialogTitle>
          <DialogDescription>Submissions and AI-powered analysis for this test deployment.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div>
            <h4 className="font-semibold mb-2">Student Submissions</h4>
            {deployment.submissions.length > 0 ? (
              <Table>
                <TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader>
                <TableBody>
                  {deployment.submissions.map(sub => {
                    const student = studentsData.find(s => s.id === sub.studentId);
                    return (
                      <TableRow key={sub.studentId}>
                        <TableCell>{student?.name || 'Unknown'}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{formatGradeDisplay(sub.score, schoolProfile?.gradingSystem)}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : <p className="text-sm text-muted-foreground text-center py-4">No submissions yet.</p>}
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><BrainCircuit /> AI Analysis</h4>
            <div className="p-4 border rounded-lg min-h-[20rem]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                  <p>Analyzing submissions...</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-sm">Overall Summary</h5>
                    <p className="text-sm text-muted-foreground">{analysisResult.overallSummary}</p>
                  </div>
                  {analysisResult.strugglingStudents.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-sm mt-4">Revision Advice for Struggling Students</h5>
                      <Accordion type="single" collapsible className="w-full">
                        {analysisResult.strugglingStudents.map(s => (
                          <AccordionItem key={s.studentId} value={s.studentId}>
                            <AccordionTrigger>{s.studentName} ({formatGradeDisplay(s.score, schoolProfile?.gradingSystem)})</AccordionTrigger>
                            <AccordionContent className="space-y-2">
                              {s.revisionSuggestions.map((suggestion, i) => (
                                <div key={i} className="text-xs p-2 bg-muted rounded-md">
                                  <p className="font-semibold">{suggestion.topic}</p>
                                  <p className="text-muted-foreground">{suggestion.reasoning}</p>
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                  {analysisResult.strugglingStudents.length === 0 && (
                     <p className="text-sm text-green-600 font-medium text-center py-6">Great news! No students were identified as struggling in this test.</p>
                  )}
                </div>
              ) : (
                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p className="text-center">Click the button below to run the analysis.</p>
                 </div>
              )}
            </div>
            {!analysisResult && (
              <Button onClick={handleRunAnalysis} disabled={isLoading || deployment.submissions.length === 0} className="mt-4 w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                Analyze Results
              </Button>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button type="button">Close</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SavedTestsList() {
    const { savedTests, deleteSavedTest, deployedTests, classesData } = useSchoolData();

    if (savedTests.length === 0) {
        return (
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><History /> Saved Tests</CardTitle>
                    <CardDescription>Tests you save will appear here for review and deployment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">No tests saved yet.</p>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> Saved & Deployed Tests</CardTitle>
                <CardDescription>Review your saved tests, deploy them to classes, and analyze the results.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                {savedTests.map((test) => {
                    const deployments = deployedTests.filter(dt => dt.testId === test.id);
                    return (
                        <AccordionItem value={test.id} key={test.id}>
                        <AccordionTrigger>
                            <div>
                                <p className="font-semibold text-left">{test.topic}</p>
                                <p className="text-sm text-muted-foreground text-left">{test.subject} - {test.gradeLevel} ({format(test.createdAt, 'PPP')})</p>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-6 p-4">
                           <div>
                                <h4 className="font-semibold mb-2">Deployments</h4>
                                {deployments.length > 0 ? (
                                <div className="space-y-2">
                                {deployments.map(dep => {
                                    const className = classesData.find(c => c.id === dep.classId)?.name || 'N/A';
                                    return (
                                        <div key={dep.id} className="flex justify-between items-center bg-muted p-2 rounded-md">
                                            <div>
                                                <p className="font-medium">{className}</p>
                                                <p className="text-xs text-muted-foreground">Due: {format(dep.deadline, 'PPP')}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge>{dep.submissions.length} Submissions</Badge>
                                                <ViewResultsDialog deployment={dep} test={test} />
                                            </div>
                                        </div>
                                    )
                                })}
                                </div>
                                ) : <p className="text-sm text-muted-foreground">This test has not been deployed yet.</p>}
                           </div>
                           <div className="flex justify-end gap-2 mt-4">
                                <DeleteTestDialog test={test} onDelete={deleteSavedTest} />
                                <DeployTestDialog test={test} />
                           </div>
                        </AccordionContent>
                        </AccordionItem>
                    );
                })}
                </Accordion>
            </CardContent>
        </Card>
    )
}


export default function AiTestingPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { addSavedTest, schoolProfile, isLoading: schoolLoading } = useSchoolData();
  const [generatedTest, setGeneratedTest] = useState<GenerateTestOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<GenerateTestFormValues | null>(null);

  const isLoading = authLoading || schoolLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Teacher') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const form = useForm<GenerateTestFormValues>({
    resolver: zodResolver(GenerateTestInputSchema),
    defaultValues: {
      subject: '',
      topic: '',
      gradeLevel: '',
      numQuestions: 5,
    },
  });
  
  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (role !== 'Teacher') {
     return <div className="flex h-full items-center justify-center"><p>Access Denied</p></div>;
  }

  if (schoolProfile?.tier === 'Starter') {
    return <FeatureLock featureName="AI Test Generator" />;
  }


  async function onSubmit(values: GenerateTestFormValues) {
    setIsSubmitting(true);
    setGeneratedTest(null);
    try {
      const result = await generateTest(values);
      setGeneratedTest(result);
      setLastSubmission(values); // Store form values on successful generation
      toast({
        title: 'Test Generated!',
        description: 'Review the generated test preview.',
      });
    } catch (error) {
      console.error('Failed to generate test:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate test. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSaveTest() {
    if (generatedTest && lastSubmission) {
      addSavedTest({
        ...lastSubmission,
        questions: generatedTest.questions,
      });
      toast({
        title: "Test Saved",
        description: `"${lastSubmission.topic}" has been added to your library.`,
      });
      setGeneratedTest(null);
      setLastSubmission(null);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">AI Test Generator</h2>
        <p className="text-muted-foreground">
          Generate, save, and deploy ad-hoc tests for your classes.
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BookOpen /> Test Parameters</CardTitle>
                  <CardDescription>Define the test you want to create.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Biology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cell Mitosis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gradeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Level</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10th Grade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="numQuestions"
                    render={({ field }) => (
                       <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={String(field.value)}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select number of questions" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {[...Array(10)].map((_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Test
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-2">
          {generatedTest ? (
            <GeneratedTestViewer test={generatedTest} onSave={handleSaveTest} />
          ) : (
             <Card className="min-h-[500px]">
              <CardHeader>
                  <CardTitle>Generated Test Preview</CardTitle>
                  <CardDescription>Your generated test will appear here after creation.</CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitting ? (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                    <p>Our AI is crafting your test questions...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <FlaskConical className="h-10 w-10 mb-4" />
                    <p>Configure your test parameters and click "Generate Test".</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <SavedTestsList />
    </div>
  );
}
