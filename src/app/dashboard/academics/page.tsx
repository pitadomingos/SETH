
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, PlusCircle, Trash2, Edit, ClipboardList, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSchoolData, Syllabus, SyllabusTopic, Exam } from '@/context/school-data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const courseSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  teacherId: z.string().min(1, "Teacher is required."),
  classId: z.string().min(1, "Class section is required."),
  schedule: z.array(z.object({
    day: z.string().min(1, "Day is required."),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:MM format."),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:MM format."),
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

const examSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  subject: z.string().min(2, "Subject is required."),
  grade: z.string().min(1, "Grade is required."),
  board: z.string({ required_error: "Exam board is required." }),
  date: z.date({ required_error: "A date for the exam is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)."),
  duration: z.string().min(3, "Duration is required."),
  room: z.string().min(1, "Room is required."),
  invigilator: z.string({ required_error: "An invigilator is required." }),
});
type ExamFormValues = z.infer<typeof examSchema>;


// --- Dialog Components ---

function NewCourseDialog() {
  const { addCourse, subjects, teachersData, classesData } = useSchoolData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: { subject: '', teacherId: '', classId: '', schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:00', room: '' }], },
  });
  
  const { isSubmitting } = useFormState({ control: form.control });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "schedule" });

  async function onSubmit(values: CourseFormValues) {
    await addCourse(values);
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
              <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Course</Button>
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

  const onSubmit = async (values: SyllabusFormValues) => {
    if (syllabi.some(s => s.subject === values.subject && s.grade === values.grade)) {
      form.setError('root', { message: 'A syllabus for this subject and grade already exists.' });
      return;
    }
    await addSyllabus(values);
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
      ? { ...topic, subtopics: topic.subtopics.join('\\n') }
      : { topic: '', week: 1, subtopics: '' }
  });

  const onSubmit = async (values: TopicFormValues) => {
    const topicData = {
      ...values,
      subtopics: values.subtopics.split('\\n').filter(s => s.trim() !== ''),
      id: topic?.id || `T${Date.now()}`
    };
    await updateSyllabusTopic(syllabus.subject, syllabus.grade, topicData);
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
        </AlertDialog>
    );
}

const PAGE_SIZE = 10;

function ExaminationsTab() {
  const { examsData, examBoards, teachersData } = useSchoolData();
  const [exams, setExams] = useState(examsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
        title: '', subject: '', grade: '', board: 'Internal', time: '09:00', duration: '2 hours', room: '', invigilator: '',
    },
  });

  const examYears = useMemo(() => {
    const years = new Set(exams.map(exam => new Date(exam.date).getFullYear().toString()));
    return ['all', ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))];
  }, [exams]);

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const examYear = new Date(exam.date).getFullYear().toString();
      const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === 'all' || examYear === selectedYear;
      const matchesBoard = selectedBoard === 'all' || exam.board === selectedBoard;
      return matchesSearch && matchesYear && matchesBoard;
    });
  }, [exams, searchTerm, selectedYear, selectedBoard]);

  const paginatedExams = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredExams.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredExams, currentPage]);
  
  const totalPages = Math.ceil(filteredExams.length / PAGE_SIZE);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedYear, selectedBoard]);

  function onSubmit(values: ExamFormValues) {
    const newExam: Exam = {
      id: `EXM${String(exams.length + 1).padStart(3, '0')}`, ...values, date: new Date(values.date),
    };
    setExams([newExam, ...exams]);
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Examination Schedule</CardTitle>
              <CardDescription>A list of all scheduled exams. Use the filters to narrow down the results.</CardDescription>
            </div>
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4"/>Schedule Exam</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Schedule New Examination</DialogTitle>
                  <DialogDescription>
                    Fill out the details below to add a new exam to the schedule.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Exam Title</FormLabel><FormControl><Input placeholder="e.g., Final Chemistry Exam" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                         <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Chemistry" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="grade" render={({ field }) => ( <FormItem><FormLabel>Grade</FormLabel><FormControl><Input placeholder="e.g., 11" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="board" render={({ field }) => ( <FormItem><FormLabel>Exam Board</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an exam board" /></SelectTrigger></FormControl><SelectContent>{examBoards.map(board => ( <SelectItem key={board} value={board}>{board}</SelectItem> ))}</SelectContent></Select><FormMessage /></FormItem> )}/>
                         <FormField control={form.control} name="date" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="time" render={({ field }) => ( <FormItem><FormLabel>Time</FormLabel><FormControl><Input placeholder="HH:MM" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                         <FormField control={form.control} name="duration" render={({ field }) => ( <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g., 2 hours" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="room" render={({ field }) => ( <FormItem><FormLabel>Room</FormLabel><FormControl><Input placeholder="e.g., 205B" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                         <FormField control={form.control} name="invigilator" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Invigilator</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an invigilator" /></SelectTrigger></FormControl><SelectContent>{teachersData.map(teacher => ( <SelectItem key={teacher.id} value={teacher.name}>{teacher.name}</SelectItem> ))}</SelectContent></Select><FormMessage /></FormItem> )}/>
                    </div>
                    <DialogFooter className="sticky bottom-0 bg-background pt-4 pr-0">
                      <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                      <Button type="submit" disabled={form.formState.isSubmitting}> {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Schedule Exam </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search title or subject..."
                className="w-full rounded-lg bg-background pl-8 md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full md:w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {examYears.map(year => (
                  <SelectItem key={year} value={year}>{year === 'all' ? 'All Years' : year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
             <Select value={selectedBoard} onValueChange={setSelectedBoard}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boards</SelectItem>
                {examBoards.map(board => (
                  <SelectItem key={board} value={board}>{board}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Title</TableHead>
                <TableHead>Subject & Grade</TableHead>
                <TableHead>Board</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Invigilator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExams.length > 0 ? paginatedExams.map(exam => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>
                    <div>{exam.subject}</div>
                    <div className="text-muted-foreground text-xs">Grade {exam.grade}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{exam.board}</Badge></TableCell>
                  <TableCell>
                    <div>{format(new Date(exam.date), 'EEE, MMM d, yyyy')}</div>
                    <div className="text-muted-foreground text-xs">{exam.time} ({exam.duration})</div>
                  </TableCell>
                  <TableCell>Room {exam.room}</TableCell>
                  <TableCell>{exam.invigilator}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No exams found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
            <CardFooter className="flex items-center justify-end space-x-2 border-t pt-4">
                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next <ChevronRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default function AcademicsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { syllabi, subjects } = useSchoolData();
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => { if (!authLoading && role !== 'Admin') router.push('/dashboard'); }, [role, authLoading, router]);

  const filteredSyllabi = useMemo(() => syllabi.filter(s => selectedSubject ? s.subject === selectedSubject : true).sort((a, b) => parseInt(a.grade) - parseInt(b.grade)), [syllabi, selectedSubject]);

  if (authLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap gap-2 justify-between items-center">
        <div><h2 className="text-3xl font-bold tracking-tight">Academics</h2><p className="text-muted-foreground">Manage school curriculum, schedules, and examinations.</p></div>
        <div className="flex gap-2"><NewCourseDialog /></div>
      </header>

      <Tabs defaultValue="syllabus">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="syllabus"><BookOpen className="mr-2 h-4 w-4"/>Curriculum & Syllabus</TabsTrigger>
            <TabsTrigger value="examinations"><ClipboardList className="mr-2 h-4 w-4"/>Examinations</TabsTrigger>
        </TabsList>
        <TabsContent value="syllabus" className="mt-6">
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
        </TabsContent>
        <TabsContent value="examinations" className="mt-6">
            <ExaminationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
