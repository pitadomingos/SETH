
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData } from '@/context/school-data-context';
import { cn } from '@/lib/utils';
import { ClipboardList, GraduationCap, Calendar as CalendarIcon, Clock, MapPin, PlusCircle, Loader2, User, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

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

export default function ExaminationsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { examsData, examBoards, teachersData } = useSchoolData();
  const router = useRouter();
  const [exams, setExams] = useState(examsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!authLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

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

  if (authLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  function onSubmit(values: ExamFormValues) {
    const newExam = {
      id: `EXM${String(exams.length + 1).padStart(3, '0')}`, ...values,
    };
    setExams([newExam, ...exams]);
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Examinations</h2>
            <p className="text-muted-foreground">Schedule and manage examinations.</p>
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
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Examination Schedule</CardTitle>
          <CardDescription>A list of all scheduled exams. Use the filters to narrow down the results.</CardDescription>
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
