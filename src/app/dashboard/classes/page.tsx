
'use client';
import { useSchoolData, Class as ClassType } from '@/context/school-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Presentation, MapPin, UserPlus, Loader2, Calendar, PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const scheduleSlotSchema = z.object({
  day: z.string().min(1, "Day is required."),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Use HH:MM format."),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Use HH:MM format."),
});

const classSchema = z.object({
  name: z.string().min(3, "Class name is required."),
  grade: z.string().min(1, "Grade is required."),
  teacher: z.string().min(2, "Teacher is required."),
  students: z.coerce.number().int().positive("Must be a positive number."),
  room: z.string().min(1, "Room is required."),
  schedule: z.array(scheduleSlotSchema).min(1, "At least one schedule slot is required."),
});
type ClassFormValues = z.infer<typeof classSchema>;

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function NewClassDialog() {
    const { addClass, teachersData } = useSchoolData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const form = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema),
        defaultValues: { name: '', grade: '', teacher: '', students: 0, room: '', schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:00' }] }
    });
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "schedule"
    });

    function onSubmit(values: ClassFormValues) {
        addClass(values);
        form.reset();
        setIsDialogOpen(false);
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button><UserPlus className="mr-2 h-4 w-4" />Create Class</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
                    <DialogDescription>Enter the details for the new class and its recurring weekly schedule.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Class Name</FormLabel><FormControl><Input placeholder="e.g., Class 9-A" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="grade" render={({ field }) => ( <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger></FormControl><SelectContent>{Array.from({ length: 12 }, (_, i) => i + 1).map(g => <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="teacher" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Teacher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Teacher" /></SelectTrigger></FormControl><SelectContent>{teachersData.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="students" render={({ field }) => ( <FormItem><FormLabel>No. of Students</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="room" render={({ field }) => ( <FormItem><FormLabel>Room Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <div className="space-y-4">
                            <FormLabel>Weekly Schedule</FormLabel>
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-4 gap-2 items-end">
                                    <FormField control={form.control} name={`schedule.${index}.day`} render={({ field }) => ( <FormItem><FormLabel className="text-xs">Day</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger></FormControl><SelectContent>{weekDays.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
                                    <FormField control={form.control} name={`schedule.${index}.startTime`} render={({ field }) => ( <FormItem><FormLabel className="text-xs">Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    <FormField control={form.control} name={`schedule.${index}.endTime`} render={({ field }) => ( <FormItem><FormLabel className="text-xs">End Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 /></Button>
                                </div>
                            ))}
                             <Button type="button" variant="outline" size="sm" onClick={() => append({ day: 'Monday', startTime: '09:00', endTime: '10:00' })}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Time Slot
                            </Button>
                             <FormField control={form.control} name="schedule" render={() => (<FormItem><FormMessage /></FormItem>)}/>
                        </div>
                        <DialogFooter className="col-span-2 mt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}> {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Class</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function formatSchedule(schedule: ClassType['schedule']) {
    if (!schedule || schedule.length === 0) return "Not scheduled";
    return schedule
        .map(s => `${s.day.substring(0,3)} ${s.startTime}-${s.endTime}`)
        .join(', ');
}

export default function ClassesPage() {
    const { role, isLoading } = useAuth();
    const { classesData } = useSchoolData();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && role !== 'Admin') {
            router.push('/dashboard');
        }
    }, [role, isLoading, router]);

    if (isLoading || role !== 'Admin') {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Class Management</h2>
                    <p className="text-muted-foreground">Manage classes and recurring weekly schedules.</p>
                </div>
                 <NewClassDialog />
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classesData.map((classItem) => (
                    <Card key={classItem.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{classItem.name}</CardTitle>
                                <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">Grade {classItem.grade}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 flex-grow">
                            <div className="flex items-center text-muted-foreground">
                                <Presentation className="mr-3 h-4 w-4" />
                                <span>{classItem.teacher}</span>
                            </div>
                             <div className="flex items-center text-muted-foreground">
                                <Users className="mr-3 h-4 w-4" />
                                <span>{classItem.students} Students</span>
                            </div>
                             <div className="flex items-center text-muted-foreground">
                                <MapPin className="mr-3 h-4 w-4" />
                                <span>Room {classItem.room}</span>
                            </div>
                             <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-3 h-4 w-4" />
                                <span className="truncate">{formatSchedule(classItem.schedule)}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
