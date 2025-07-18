
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData, SavedTest, DeployedTest, NewSavedTest, NewDeployedTestData } from '@/context/school-data-context';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, PlusCircle, FlaskConical, Send, Trash2, GitCompareArrows } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateTest, GenerateTestInput } from '@/ai/flows/generate-test';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FeatureLock } from '@/components/layout/feature-lock';
import Link from 'next/link';

const testGenerationSchema = z.object({
  subject: z.string().min(1, "Please select a subject."),
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  gradeLevel: z.string().min(1, "Please select a grade level."),
  numQuestions: z.coerce.number().min(3, "Must have at least 3 questions.").max(10, "Cannot exceed 10 questions."),
});
type TestGenerationFormValues = z.infer<typeof testGenerationSchema>;

const deploySchema = z.object({
  classId: z.string({ required_error: "Please select a class."}),
  deadline: z.date({ required_error: "A deadline is required." }),
});
type DeployFormValues = z.infer<typeof deploySchema>;


function TestGeneratorDialog() {
  const { subjects, addSavedTest } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<TestGenerationFormValues>({
    resolver: zodResolver(testGenerationSchema),
  });

  async function onSubmit(values: TestGenerationFormValues) {
    setIsGenerating(true);
    try {
        const generatedTest = await generateTest(values);
        if (generatedTest && generatedTest.questions) {
            const newTest: NewSavedTest = {
                ...generatedTest,
                subject: values.subject,
                topic: values.topic,
                gradeLevel: values.gradeLevel,
            };
            addSavedTest(newTest);
            toast({
                title: "Test Generated!",
                description: `An ${generatedTest.questions.length}-question test for "${values.topic}" has been saved.`
            });
            form.reset();
            setIsOpen(false);
        } else {
            throw new Error("AI did not return a valid test structure.");
        }
    } catch (error) {
        console.error("Failed to generate test:", error);
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "Could not generate the test. The AI service may be unavailable. Please try again later."
        });
    } finally {
        setIsGenerating(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> New Test</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate New Test</DialogTitle>
          <DialogDescription>
            Use AI to create a new test based on a subject and topic.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="topic" render={({ field }) => ( <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g., Photosynthesis" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="gradeLevel" render={({ field }) => ( <FormItem><FormLabel>Grade Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger></FormControl><SelectContent>{Array.from({ length: 12 }, (_, i) => i + 1).map(g => <SelectItem key={g} value={`Grade ${g}`}>Grade {g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="numQuestions" render={({ field }) => ( <FormItem><FormLabel>Number of Questions</FormLabel><FormControl><Input type="number" placeholder="3-10" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeployTestDialog({ test }: { test: SavedTest }) {
    const { classesData, addDeployedTest } = useSchoolData();
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<DeployFormValues>({
        resolver: zodResolver(deploySchema),
    });

    const relevantClasses = useMemo(() => {
        const gradeNumber = test.gradeLevel.replace('Grade ', '');
        return classesData.filter(c => c.grade === gradeNumber);
    }, [classesData, test.gradeLevel]);
    
    function onSubmit(values: DeployFormValues) {
        const deployData: NewDeployedTestData = {
            testId: test.id,
            classId: values.classId,
            deadline: values.deadline,
        };
        addDeployedTest(deployData);
        toast({
            title: "Test Deployed!",
            description: `The test "${test.topic}" has been assigned.`,
        });
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm"><Send className="mr-2 h-4 w-4" /> Deploy</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Deploy Test: {test.topic}</DialogTitle>
                    <DialogDescription>Assign this test to a class and set a deadline.</DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="classId" render={({ field }) => ( <FormItem><FormLabel>Assign to Class</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger></FormControl><SelectContent>{relevantClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="deadline" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Submission Deadline</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )} />
                        <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Deploy Test</Button></DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function ViewSubmissionsDialog({ deployment, test }: { deployment: DeployedTest, test: SavedTest }) {
    const { studentsData } = useSchoolData();

    return (
        <Dialog>
            <DialogTrigger asChild><Button variant="outline" size="sm">View Submissions</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submissions for: {test.topic}</DialogTitle>
                    <DialogDescription>
                        {deployment.submissions.length} / {studentsData.filter(s => s.grade === test.gradeLevel.replace('Grade ','')).length} students have submitted.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto pr-4">
                    {deployment.submissions.length > 0 ? (
                        <ul className="space-y-2 py-4">
                            {deployment.submissions.map(sub => {
                                const student = studentsData.find(s => s.id === sub.studentId);
                                return (
                                    <li key={sub.studentId} className="flex justify-between items-center p-2 border rounded-md">
                                        <div>
                                            <p className="font-medium">{student?.name || 'Unknown Student'}</p>
                                            <p className="text-xs text-muted-foreground">Submitted: {formatDistanceToNow(sub.submittedAt, { addSuffix: true })}</p>
                                        </div>
                                        <Badge>Score: {sub.score.toFixed(1)}/20</Badge>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="py-8 text-center text-muted-foreground">No submissions yet.</p>
                    )}
                </div>
                 <DialogFooter><DialogClose asChild><Button type="button">Close</Button></DialogClose></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function AiTestingPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { schoolProfile, isLoading: dataLoading, savedTests, deleteSavedTest, deployedTests, classesData } = useSchoolData();

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

  const sortedSavedTests = [...savedTests].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const sortedDeployedTests = [...deployedTests].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap gap-2 justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">AI Test Generator</h2>
            <p className="text-muted-foreground">
            Generate, save, and deploy ad-hoc tests for your classes.
            </p>
        </div>
        <TestGeneratorDialog />
      </header>
       
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Saved Tests</CardTitle>
                <CardDescription>Tests you have generated but not yet deployed.</CardDescription>
            </CardHeader>
            <CardContent>
                {sortedSavedTests.length > 0 ? (
                    <Accordion type="multiple" className="w-full space-y-2">
                        {sortedSavedTests.map(test => (
                            <Card key={test.id} className="overflow-hidden">
                                <AccordionItem value={test.id} className="border-b-0">
                                    <AccordionTrigger className="p-4 hover:no-underline bg-muted">
                                        <div className="flex-1 text-left">
                                            <p className="font-semibold">{test.topic}</p>
                                            <p className="text-sm text-muted-foreground">{test.subject} - {test.gradeLevel}</p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4">
                                        <div className="space-y-4">
                                            <ul className="space-y-2">
                                                {test.questions.map((q, i) => <li key={i} className="text-sm text-muted-foreground">{i + 1}. {q.questionText}</li>)}
                                            </ul>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => deleteSavedTest(test.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                                                <DeployTestDialog test={test} />
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Card>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-16 text-muted-foreground"><FlaskConical className="mx-auto h-12 w-12 mb-4" /><p>No saved tests.</p><p>Click "New Test" to generate one.</p></div>
                )}
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Deployed Tests</CardTitle>
                <CardDescription>Tests that have been assigned to classes.</CardDescription>
            </CardHeader>
            <CardContent>
                {sortedDeployedTests.length > 0 ? (
                   <div className="space-y-3">
                    {sortedDeployedTests.map(deployment => {
                        const test = savedTests.find(t => t.id === deployment.testId);
                        const assignedClass = classesData.find(c => c.id === deployment.classId);
                        if (!test) return null;

                        return (
                            <Card key={deployment.id}>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg">{test.topic}</CardTitle>
                                    <CardDescription>
                                        Deployed to <span className="font-semibold">{assignedClass?.name || 'N/A'}</span>, due {format(new Date(deployment.deadline), 'MMM d, yyyy')}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="p-4 flex justify-between items-center border-t">
                                   <Link href={`/dashboard/test/${deployment.id}`} passHref>
                                    <Button variant="link" className="p-0 h-auto">View Test</Button>
                                   </Link>
                                    <ViewSubmissionsDialog deployment={deployment} test={test} />
                                </CardFooter>
                            </Card>
                        )
                    })}
                   </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground"><Send className="mx-auto h-12 w-12 mb-4" /><p>No deployed tests.</p><p>Deploy a saved test to a class.</p></div>
                )}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
