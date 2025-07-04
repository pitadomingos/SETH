
'use client';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, PlusCircle, User, School, Clock, MapPin, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSchoolData, NewCourseData } from '@/context/school-data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

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

function NewCourseDialog() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { addCourse, subjects, teachersData, classesData } = useSchoolData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:00', room: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedule"
  });

  useEffect(() => {
    if (!authLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

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
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Course
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function AcademicsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { coursesData, teachersData, classesData } = useSchoolData();

  useEffect(() => {
    if (!authLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  if (authLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Course Management</h2>
            <p className="text-muted-foreground">Create and manage courses by assigning subjects, teachers, and schedules to class sections.</p>
        </div>
        <NewCourseDialog />
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coursesData.map(course => {
          const teacher = teachersData.find(t => t.id === course.teacherId);
          const classSection = classesData.find(c => c.id === course.classId);
          return (
            <Card key={course.id}>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BookOpen /> {course.subject}</CardTitle>
                  <CardDescription>A course for {classSection?.name || 'N/A'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground"><User className="mr-2 h-4 w-4" /> <span>Teacher: {teacher?.name || 'N/A'}</span></div>
                <div className="flex items-center text-sm text-muted-foreground"><School className="mr-2 h-4 w-4" /> <span>For Class: {classSection?.name || 'N/A'}</span></div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Schedule</h4>
                  {course.schedule.map((slot, index) => (
                    <div key={index} className="flex justify-between items-center text-xs text-muted-foreground">
                       <span>{slot.day}</span>
                       <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1"><Clock className="h-3 w-3" /><span>{slot.startTime} - {slot.endTime}</span></div>
                          <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>{slot.room}</span></div>
                       </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
         {coursesData.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-10">No courses have been created yet.</p>
        )}
      </div>

    </div>
  );
}
