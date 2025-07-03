
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData } from '@/context/school-data-context';
import { cn } from '@/lib/utils';
import { ClipboardList, GraduationCap, Calendar as CalendarIcon, Clock, MapPin, PlusCircle, Loader2 } from 'lucide-react';

const examSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  subject: z.string().min(2, "Subject is required."),
  grade: z.string().min(1, "Grade is required."),
  board: z.string({ required_error: "Exam board is required." }),
  date: z.date({ required_error: "A date for the exam is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)."),
  duration: z.string().min(3, "Duration is required."),
  room: z.string().min(1, "Room is required."),
});

type ExamFormValues = z.infer<typeof examSchema>;

export default function ExaminationsPage() {
  const { role } = useAuth();
  const { examsData, examBoards } = useSchoolData();
  const router = useRouter();
  const [exams, setExams] = useState(examsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
        title: '',
        subject: '',
        grade: '',
        board: 'Internal',
        time: '09:00',
        duration: '2 hours',
        room: '',
    },
  });

  if (role && role !== 'Admin') {
      router.push('/dashboard');
      return null;
  }

  function onSubmit(values: ExamFormValues) {
    const newExam = {
      id: `EXM${String(exams.length + 1).padStart(3, '0')}`,
      ...values,
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Exam Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Final Chemistry Exam" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Chemistry" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 11" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="board"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Exam Board</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select an exam board" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {examBoards.map(board => (
                                    <SelectItem key={board} value={board}>{board}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                            <Input placeholder="HH:MM" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 2 hours" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="room"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Room</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 205B" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Schedule Exam
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>
      
      <div className="grid gap-6">
        {exams.map(exam => (
            <Card key={exam.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>{exam.title}</CardTitle>
                        <CardDescription>{exam.subject}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                         <Badge variant={exam.board === 'Internal' ? 'secondary' : 'default'}>{exam.board}</Badge>
                         <span className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Grade {exam.grade}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{new Date(exam.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{exam.time} ({exam.duration})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Room {exam.room}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

    </div>
  );
}
