
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
import { Loader2, Sparkles, Hammer, FlaskConical, CheckCircle, Info, Printer, History } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useSchoolData } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { format, getWeek } from 'date-fns';
import { FeatureLock } from '@/components/layout/feature-lock';

const formSchema = z.object({
  courseId: z.string().min(1, { message: 'Please select a course.' }),
  weekNumber: z.coerce.number().min(1, 'Please select a week.'),
  overrideSyllabus: z.string().optional(),
});

function DailyPlanView({ plan }) {
    return (
        <Accordion type="single" collapsible className="w-full" defaultValue="Monday">
          {plan.map((dailyPlan) => (
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
    );
}

export default function LessonPlannerPage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { classesData, teachersData, studentsData, grades, lessonPlans, addLessonPlan, schoolProfile, isLoading: dataLoading, coursesData, syllabi } = useSchoolData();

  const [generatedPlan, setGeneratedPlan] = useState<CreateLessonPlanOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoading = authLoading || dataLoading;

  const teacherInfo = useMemo(() => {
    return teachersData.find(t => t.name === user?.name);
  }, [teachersData, user]);
  
  const teacherCourses = useMemo(() => {
    if (!teacherInfo) return [];
    return coursesData
      .filter(c => c.teacherId === teacherInfo.id)
      .map(course => {
        const classInfo = classesData.find(c => c.id === course.classId);
        return {
          ...course,
          label: `${course.subject} - ${classInfo?.name || 'Unknown Class'}`
        }
      });
  }, [coursesData, teacherInfo, classesData]);


  useEffect(() => {
    if (!isLoading && role !== 'Teacher') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: '',
      weekNumber: getWeek(new Date()),
      overrideSyllabus: '',
    },
  });
  
  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (role !== 'Teacher') {
     return <div className="flex h-full items-center justify-center"><p>Access Denied</p></div>;
  }

  if (schoolProfile?.tier === 'Starter') {
    return <FeatureLock featureName="AI Lesson Planner" />;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!teacherInfo) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not find teacher information.' });
      return;
    }

    setIsSubmitting(true);
    setGeneratedPlan(null);

    const selectedCourse = coursesData.find(c => c.id === values.courseId);
    if (!selectedCourse) {
       toast({ variant: 'destructive', title: 'Error', description: 'Selected course not found.' });
       setIsSubmitting(false);
       return;
    }
    const selectedClass = classesData.find(c => c.id === selectedCourse.classId);
    if (!selectedClass) {
      toast({ variant: 'destructive', title: 'Error', description: 'Selected class not found.' });
      setIsSubmitting(false);
      return;
    }
    
    // Determine the weekly syllabus
    let weeklySyllabus = values.overrideSyllabus || '';
    if (!weeklySyllabus) {
      const syllabusForCourse = syllabi.find(s => s.grade === selectedClass.grade && s.subject === selectedCourse.subject);
      const topicForWeek = syllabusForCourse?.topics.find(t => t.week === values.weekNumber);
      if (topicForWeek) {
        weeklySyllabus = `Topic: ${topicForWeek.topic}. Subtopics: ${topicForWeek.subtopics.join(', ')}.`;
      } else {
        toast({ variant: 'destructive', title: 'Syllabus Topic Not Found', description: `No topic found for week ${values.weekNumber}. Please specify a topic manually.` });
        setIsSubmitting(false);
        return;
      }
    }
    
    const studentsInClass = studentsData.filter(s =>
      s.grade === selectedClass.grade &&
      s.class === selectedClass.name.split('-')[1].trim()
    ).map(s => s.id);

    const relevantGrades = grades
      .filter(g => studentsInClass.includes(g.studentId) && g.subject === selectedCourse.subject)
      .map(g => g.grade);

    try {
      const result = await createLessonPlan({
        className: selectedClass.name,
        gradeLevel: `Grade ${selectedClass.grade}`,
        subject: selectedCourse.subject,
        weeklySyllabus: weeklySyllabus,
        recentGrades: relevantGrades,
      });
      setGeneratedPlan(result);
      
      addLessonPlan({
        className: selectedClass.name,
        subject: selectedCourse.subject,
        weeklySyllabus: weeklySyllabus,
        weeklyPlan: result.weeklyPlan
      });

      toast({
        title: 'Plan Generated & Saved!',
        description: 'Your new lesson plan is ready for review and has been saved to your history.',
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

  function handlePrint() {
    window.print();
  }

  const selectedCourseId = form.watch('courseId');
  const selectedCourseInfo = teacherCourses.find(c => c.id === selectedCourseId);
  const selectedClassInfo = selectedCourseInfo ? classesData.find(c => c.id === selectedCourseInfo.classId) : null;
  const hasSyllabusForCourse = selectedClassInfo && selectedCourseInfo ? syllabi.some(s => s.grade === selectedClassInfo.grade && s.subject === selectedCourseInfo.subject) : false;

  return (
    <div className="space-y-6 animate-in fade-in-50">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">AI-Powered Weekly Lesson Planner</h2>
        <p className="text-muted-foreground">Generate, save, and print performance-aware weekly lesson plans for your classes.</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 print:hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Plan</CardTitle>
                  <CardDescription>The AI will use the official syllabus and recent student grades to tailor the plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {teacherCourses.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weekNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Week of the Year</FormLabel>
                         <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select week" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                              <SelectItem key={week} value={String(week)}>Week {week}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!hasSyllabusForCourse && selectedCourseId && (
                    <FormField
                      control={form.control}
                      name="overrideSyllabus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekly Syllabus / Topics</FormLabel>
                          <FormDescription>No official syllabus found. Please specify topics manually.</FormDescription>
                          <FormControl>
                            <Textarea rows={4} placeholder="e.g., Chapter 5: The Circulatory System, Blood Types, The Heart as a Pump" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
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
              <CardDescription>Review the 5-day plan. Save it for later or print it for use in the classroom.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitting && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                  <p>Our AI is analyzing grades and crafting your weekly plan...</p>
                </div>
              )}
              {generatedPlan ? (
                <DailyPlanView plan={generatedPlan.weeklyPlan} />
              ) : (
                !isSubmitting && (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <Sparkles className="h-10 w-10 mb-4" />
                    <p>Your generated weekly plan will appear here.</p>
                  </div>
                )
              )}
            </CardContent>
            {generatedPlan && (
                <CardFooter className="flex justify-end print:hidden">
                     <Button onClick={handlePrint} variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Plan
                    </Button>
                </CardFooter>
            )}
          </Card>
        </div>
      </div>
      
       {lessonPlans.length > 0 && (
        <Card className="print:hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> Saved Lesson Plans</CardTitle>
                <CardDescription>Review your previously saved lesson plans.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="w-full">
                    {lessonPlans.map((plan) => (
                        <AccordionItem value={plan.id} key={plan.id}>
                            <AccordionTrigger>
                                <div className="flex flex-col items-start text-left">
                                    <p className="font-bold">{plan.className} - {plan.subject}</p>
                                    <p className="text-sm text-muted-foreground">Created: {format(plan.createdAt, 'PPP')}</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 p-4 border-t">
                               <div>
                                 <h4 className="font-semibold mb-1">Original Syllabus:</h4>
                                 <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{plan.weeklySyllabus}</p>
                               </div>
                               <DailyPlanView plan={plan.weeklyPlan} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
