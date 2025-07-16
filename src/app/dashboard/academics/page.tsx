
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, PlusCircle, User, School, Clock, MapPin, Trash2, BrainCircuit, AlertTriangle, CheckCircle, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSchoolData, Syllabus, SyllabusTopic } from '@/context/school-data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { analyzeScheduleConflicts, type AnalyzeScheduleConflictsOutput } from '@/ai/flows/analyze-schedule-conflicts';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const courseSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  teacherId: z.string().min(1, "Teacher is required."),
  classId: z.string().min(1, "Class section is required."),
  schedule: z.array(z.object({
    day: z.string().min(1, "Day is required."),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:MM format."),
    endTime: z.string().regex(/^([01]\d|2[0-5]\d)$/, "Use HH:MM format."),
    room: z.string().min(1, "Room is required."),
  })).min(1, "At least one schedule slot is required."),
});
type CourseFormValues = z.infer<typeof courseSchema>;

const syllabusSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  grade: z.string().min(1, "Grade is required."),
});
type SyllabusFormValues = z.infer<typeof syllabusSchema>;

const topicSchema = z.object({
    topic: z.string().min(3, "Topic title is required."),
    week: z.coerce.number().min(1).max(52),
    subtopics: z.string().min(3, "Subtopics are required."),
});
type TopicFormValues = z.infer<typeof topicSchema>;


// --- Dialog Components ---

function NewCourseDialog() {
  const { addCourse, subjects, teachersData, classesData } = useSchoolData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: { subject: '', teacherId: '', classId: '', schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:00', room: '' }], },
  });

  const { fields, append, remove } = useForm({ control: form.control, name: "schedule" });

  function onSubmit(values: CourseFormValues) {
    addCourse(values);
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Define a course by assigning a subject and teacher to a class section with a weekly schedule.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="teacherId" render={({ field }) => ( <FormItem><FormLabel>Teacher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Teacher" /></SelectTrigger></FormControl><SelectContent>{teachersData.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="classId" render={({ field }) => ( <FormItem><FormLabel>Class Section</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger></FormControl><SelectContent>{classesData.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
            </div>
            <Separator />
            <div>
              <FormLabel>Weekly Schedule</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-[1fr,1fr,1fr,auto,auto] gap-2 items-end p-3 border rounded-md">
                    <FormField control={form.control} name={`schedule.${index}.day`} render={({ field }) => ( <FormItem><FormLabel className="text-xs">Day</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger></FormControl><SelectContent>{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name={`schedule.${index}.startTime`} render={({ field }) => ( <FormItem><FormLabel className="text-xs">Start</FormLabel><FormControl><Input placeholder="HH:MM" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name={`schedule.${index}.endTime`} render={({ field }) => ( <FormItem><FormLabel className="text-xs">End</FormLabel><FormControl><Input placeholder="HH:MM" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name={`schedule.${index}.room`} render={({ field }) => ( <FormItem><FormLabel className="text-xs">Room</FormLabel><FormControl><Input placeholder="Room" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ day: 'Monday', startTime: '09:00', endTime: '10:00', room: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Time Slot
              </Button>
            </div>
            <DialogFooter className="sticky bottom-0 bg-background pt-4 pr-0">
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Course</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function NewSyllabusDialog() {
  const { addSyllabus, subjects, syllabi } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<SyllabusFormValues>({ resolver: zodResolver(syllabusSchema) });

  const onSubmit = (values: SyllabusFormValues) => {
    if (syllabi.some(s => s.subject === values.subject && s.grade === values.grade)) {
      form.setError('root', { message: 'A syllabus for this subject and grade already exists.' });
      return;
    }
    addSyllabus(values);
    form.reset();
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Create Syllabus</Button></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Syllabus</DialogTitle>
          <DialogDescription>Define a new syllabus for a subject and grade level.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="subject" render={({ field }) => (<FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="grade" render={({ field }) => (<FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger></FormControl><SelectContent>{Array.from({ length: 12 }, (_, i) => i + 1).map(g => <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            {form.formState.errors.root && <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>}
            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Create</Button></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function TopicDialog({ syllabus, topic, children }: { syllabus: Syllabus, topic?: SyllabusTopic, children: React.ReactNode }) {
  const { updateSyllabusTopic } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: topic
      ? { ...topic, subtopics: topic.subtopics.join('\n') }
      : { topic: '', week: 1, subtopics: '' }
  });

  const onSubmit = (values: TopicFormValues) => {
    const topicData = {
      ...values,
      subtopics: values.subtopics.split('\n').filter(s => s.trim() !== ''),
      id: topic?.id || `T${Date.now()}`
    };
    updateSyllabusTopic(syllabus.subject, syllabus.grade, topicData);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{topic ? 'Edit' : 'Add'} Topic</DialogTitle>
          <DialogDescription>Add or edit a weekly topic for {syllabus.subject} - Grade {syllabus.grade}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="topic" render={({ field }) => (<FormItem><FormLabel>Topic Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="week" render={({ field }) => (<FormItem><FormLabel>Week</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="subtopics" render={({ field }) => (<FormItem><FormLabel>Subtopics</FormLabel><FormDescription>Enter one subtopic per line.</FormDescription><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Save Topic</Button></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteTopicDialog({ syllabus, topic, children }: { syllabus: Syllabus, topic: SyllabusTopic, children: React.ReactNode }) {
    const { deleteSyllabusTopic } = useSchoolData();
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDesc>This will permanently delete the topic "{topic.topic}" from the syllabus. This action cannot be undone.</AlertDialogDesc>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteSyllabusTopic(syllabus.subject, syllabus.grade, topic.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
    )
}

function AnalyzeScheduleDialog() {
  const { coursesData, teachersData, classesData } = useSchoolData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScheduleConflictsOutput | null>(null);

  const handleRunAnalysis = async () => {
    setIsLoading(true); setAnalysisResult(null);
    try {
      const analysisInput = { courses: coursesData.map(course => ({ subject: course.subject, teacherName: teachersData.find(t => t.id === course.teacherId)?.name || 'N/A', className: classesData.find(c => c.id === course.classId)?.name || 'N/A', schedule: course.schedule, })) };
      const result = await analyzeScheduleConflicts(analysisInput);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not run the schedule analysis. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onOpenChange = (open: boolean) => { setIsOpen(open); if (!open) { setAnalysisResult(null); setIsLoading(false); } }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline"><BrainCircuit className="mr-2 h-4 w-4" /> Analyze Schedule</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>AI Schedule Conflict Analysis</DialogTitle><DialogDescription>The AI will analyze the entire course schedule for teacher and room booking conflicts.</DialogDescription></DialogHeader>
        <div className="py-4 min-h-[20rem] max-h-[70vh] overflow-y-auto pr-4">
          {isLoading ? ( <div className="flex flex-col items-center justify-center h-full text-muted-foreground"><Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" /><p>Analyzing schedule for conflicts...</p></div>
          ) : analysisResult ? (
            <div className="space-y-6">
              <div className={`p-4 rounded-lg border ${analysisResult.hasConflicts ? 'border-destructive/20 bg-destructive/5' : 'border-green-500/20 bg-green-500/5'}`}>
                <h3 className={`font-bold flex items-center gap-2 ${analysisResult.hasConflicts ? 'text-destructive' : 'text-green-600'}`}>{analysisResult.hasConflicts ? <AlertTriangle /> : <CheckCircle />}Analysis Summary</h3>
                <p className="text-sm text-muted-foreground mt-1">{analysisResult.summary}</p>
              </div>
              {analysisResult.hasConflicts && (<div><h4 className="font-semibold mb-2">Detected Conflicts:</h4><ul className="space-y-3">{analysisResult.conflicts.map((conflict, index) => (<li key={index} className="p-4 bg-muted rounded-md text-sm"><p className="font-semibold text-card-foreground">{conflict.type}</p><p className="text-muted-foreground mt-1">{conflict.details}</p><p className="text-primary font-medium mt-2">Suggestion: <span className="text-muted-foreground">{conflict.suggestion}</span></p></li>))}</ul></div>)}
            </div>
          ) : (<div className="flex flex-col items-center justify-center h-full text-muted-foreground"><p className="text-center">Click the button below to start the analysis.</p></div>)}
        </div>
        <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Close</Button></DialogClose>{!analysisResult && ( <Button onClick={handleRunAnalysis} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4" />}Run Analysis</Button>)}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SubjectDetailsDialog({ subject, courses }: { subject: string; courses: any[] }) {
  const { teachersData, classesData } = useSchoolData();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted transition-colors">
          <CardHeader className="p-4"><CardTitle className="text-lg flex items-center gap-2"><BookOpen /> {subject}</CardTitle></CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>School-Wide Schedule for {subject}</DialogTitle><DialogDescription>Showing all scheduled classes for this subject.</DialogDescription></DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-6 space-y-6 py-4">
          {courses.map((course, index) => {
            const teacher = teachersData.find(t => t.id === course.teacherId);
            const classSection = classesData.find(c => c.id === course.classId);
            return (
              <div key={course.id}>
                {index > 0 && <Separator className="mb-6" />}
                <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-base">{classSection?.name || 'N/A'}</h3><Badge variant="outline">{teacher?.name || 'N/A'}</Badge></div>
                <div className="space-y-2">{course.schedule.map((slot: any, sIndex: number) => (<div key={sIndex} className="flex justify-between items-center text-sm text-muted-foreground p-2 bg-muted rounded-md"><span>{slot.day}</span><div className="flex items-center gap-4"><div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /><span>{slot.startTime} - {slot.endTime}</span></div><div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /><span>{slot.room}</span></div></div></div>))}</div>
              </div>);
          })}
        </div>
        <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Close</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AcademicsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { coursesData, subjects, syllabi } = useSchoolData();
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => { if (!authLoading && role !== 'Admin') router.push('/dashboard'); }, [role, authLoading, router]);

  const coursesBySubject = useMemo(() => coursesData.reduce((acc, course) => { acc[course.subject] = acc[course.subject] || []; acc[course.subject].push(course); return acc; }, {} as Record<string, any[]>), [coursesData]);
  
  const filteredSyllabi = useMemo(() => syllabi.filter(s => selectedSubject ? s.subject === selectedSubject : true).sort((a, b) => parseInt(a.grade) - parseInt(b.grade)), [syllabi, selectedSubject]);

  if (authLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap gap-2 justify-between items-center">
        <div><h2 className="text-3xl font-bold tracking-tight">Academics</h2><p className="text-muted-foreground">Manage school subjects, schedules, and curriculum syllabus.</p></div>
        <div className="flex gap-2"><AnalyzeScheduleDialog /><NewCourseDialog /></div>
      </header>

      <Card>
        <CardHeader><CardTitle>Course Schedules</CardTitle><CardDescription>Overview of all defined courses, grouped by subject.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Object.entries(coursesBySubject).map(([subject, courses]) => (
              <SubjectDetailsDialog key={subject} subject={subject} courses={courses} />
            ))}
            {coursesData.length === 0 && (<p className="text-muted-foreground col-span-full text-center py-10">No courses have been created yet.</p>)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
              <div><CardTitle>Curriculum Syllabus</CardTitle><CardDescription>Select a subject to see and manage its curriculum topics.</CardDescription></div>
              <NewSyllabusDialog />
          </div>
          <div className="pt-4"><Select onValueChange={setSelectedSubject} value={selectedSubject}><SelectTrigger className="w-full md:w-[280px]"><SelectValue placeholder="Filter by subject..." /></SelectTrigger><SelectContent>{subjects.map(subject => (<SelectItem key={subject} value={subject}>{subject}</SelectItem>))}</SelectContent></Select></div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4">
            {filteredSyllabi.map(syllabus => (
              <Card key={`${syllabus.subject}-${syllabus.grade}`} className="overflow-hidden">
                <AccordionItem value={`grade-${syllabus.grade}`} className="border-b-0">
                  <AccordionTrigger className="bg-muted px-4 py-3"><div className="flex flex-1 items-center gap-3"><BookOpen className="h-5 w-5 text-primary" /><span className="font-semibold text-lg">{syllabus.subject} - Grade {syllabus.grade}</span></div></AccordionTrigger>
                  <AccordionContent className="p-4 space-y-4">
                     <div className="text-right"><TopicDialog syllabus={syllabus}><Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Topic</Button></TopicDialog></div>
                    <ul className="space-y-3">{syllabus.topics.sort((a, b) => a.week - b.week).map(topic => (<li key={topic.id} className="p-3 border rounded-lg"><div className="flex justify-between items-start"><div><p className="font-semibold">Week {topic.week}: {topic.topic}</p><ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">{topic.subtopics.map((subtopic, index) => (<li key={index}>{subtopic}</li>))}</ul></div><div className="flex gap-1"><TopicDialog syllabus={syllabus} topic={topic}><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button></TopicDialog><DeleteTopicDialog syllabus={syllabus} topic={topic}><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></DeleteTopicDialog></div></div></li>))}</ul>
                     {syllabus.topics.length === 0 && <p className="text-muted-foreground text-center py-6">No topics have been added to this syllabus yet.</p>}
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>
          {filteredSyllabi.length === 0 && <p className="text-center text-muted-foreground py-10">No syllabus found. Click "Create Syllabus" to get started.</p>}
        </CardContent>
      </Card>

    </div>
  );
}
