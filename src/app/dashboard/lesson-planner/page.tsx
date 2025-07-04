'use client';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createLessonPlan, CreateLessonPlanOutput } from '@/ai/flows/create-lesson-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Hammer, FlaskConical, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useSchoolData } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  classId: z.string().min(1, { message: 'Please select a class.' }),
  weeklySyllabus: z.string().min(10, { message: 'Syllabus must be at least 10 characters long.' }),
});

export default function LessonPlannerPage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { classesData, teachersData, studentsData, grades, isLoading: dataLoading } = useSchoolData();

  const [lessonPlan, setLessonPlan] = useState<CreateLessonPlanOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teacherInfo = useMemo(() => {
    return teachersData.find(t => t.name === user?.name);
  }, [teachersData, user]);

  const teacherClasses = useMemo(() => {
    if (!teacherInfo) return [];
    // Assuming a teacher can be a homeroom teacher for multiple classes
    return classesData.filter(c => c.teacher === teacherInfo.name);
  }, [classesData, teacherInfo]);


  useEffect(() => {
    if (!authLoading && role !== 'Teacher') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: '',
      weeklySyllabus: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!teacherInfo) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not find teacher information.' });
      return;
    }

    setIsSubmitting(true);
    setLessonPlan(null);

    const selectedClass = classesData.find(c => c.id === values.classId);
    if (!selectedClass) {
      toast({ variant: 'destructive', title: 'Error', description: 'Selected class not found.' });
      setIsSubmitting(false);
      return;
    }
    
    // Find students in the selected class
    const studentsInClass = studentsData.filter(s =>
      s.grade === selectedClass.grade &&
      s.class === selectedClass.name.split('-')[1].trim()
    ).map(s => s.id);

    // Get grades for those students in the teacher's subject
    const relevantGrades = grades
      .filter(g => studentsInClass.includes(g.studentId) && g.subject === teacherInfo.subject)
      .map(g => g.grade);

    try {
      const result = await createLessonPlan({
        className: selectedClass.name,
        gradeLevel: `Grade ${selectedClass.grade}`,
        subject: teacherInfo.subject,
        weeklySyllabus: values.weeklySyllabus,
        recentGrades: relevantGrades,
      });
      setLessonPlan(result);
      toast({
        title: 'Weekly Plan Generated!',
        description: 'Your new performance-aware lesson plan is ready for review.',
      });
    } catch (error) {
      console.error('Failed to create lesson plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate lesson plan. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading || dataLoading || role !== 'Teacher') {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">AI-Powered Weekly Lesson Planner</h2>
        <p className="text-muted-foreground">Generate a performance-aware weekly lesson plan by providing a class and syllabus.</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Plan</CardTitle>
                  <CardDescription>The AI will analyze recent grades for the selected class to tailor the plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {teacherClasses.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name} ({teacherInfo?.subject})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weeklySyllabus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Syllabus / Topics</FormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="e.g., Chapter 5: The Circulatory System, Blood Types, The Heart as a Pump" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Weekly Plan
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-[500px]">
            <CardHeader>
              <CardTitle>Generated Weekly Lesson Plan</CardTitle>
              <CardDescription>Review the 5-day plan. Recap days are automatically added based on student performance.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitting && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                  <p>Our AI is analyzing grades and crafting your weekly plan...</p>
                </div>
              )}
              {lessonPlan ? (
                <Accordion type="single" collapsible className="w-full" defaultValue="Monday">
                  {lessonPlan.weeklyPlan.map((dailyPlan) => (
                    <AccordionItem value={dailyPlan.day} key={dailyPlan.day}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg">{dailyPlan.day}</span>
                          {dailyPlan.isRecap && <Badge variant="destructive">Recap Day</Badge>}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 text-sm pl-2">
                        <div className="flex items-center gap-2 text-base font-semibold">
                            <Info className="h-5 w-5 text-primary" /> 
                            <span>Topic: {dailyPlan.topic}</span>
                        </div>
                        <div>
                          <h4 className="flex items-center font-semibold mb-2"><CheckCircle className="mr-2 h-5 w-5 text-primary"/>Objectives</h4>
                          <p className="p-3 bg-muted rounded-md whitespace-pre-wrap">{dailyPlan.objectives}</p>
                        </div>
                        <div>
                          <h4 className="flex items-center font-semibold mb-2"><Hammer className="mr-2 h-5 w-5 text-primary"/>Activities</h4>
                          <p className="p-3 bg-muted rounded-md whitespace-pre-wrap">{dailyPlan.activities}</p>
                        </div>
                        <div>
                          <h4 className="flex items-center font-semibold mb-2"><FlaskConical className="mr-2 h-5 w-5 text-primary"/>Materials</h4>
                          <p className="p-3 bg-muted rounded-md whitespace-pre-wrap">{dailyPlan.materials}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                !isSubmitting && (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <Sparkles className="h-10 w-10 mb-4" />
                    <p>Your generated weekly plan will appear here.</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
