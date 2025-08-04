
'use client';
import { useSchoolData, Class as ClassType } from '@/context/school-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Presentation, MapPin, UserPlus, Loader2, School, Sigma, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const classSchema = z.object({
  name: z.string().min(3, "Class name is required."),
  grade: z.string().min(1, "Grade is required."),
  teacher: z.string().min(2, "Homeroom teacher is required."),
  students: z.coerce.number().int().positive("Must be a positive number."),
  room: z.string().min(1, "Room is required."),
});
type ClassFormValues = z.infer<typeof classSchema>;

function ClassFormDialog({ classItem, children }: { classItem?: ClassType, children: React.ReactNode }) {
    const { addClass, updateClass, teachersData } = useSchoolData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const isEditMode = !!classItem;
    
    const form = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema),
        defaultValues: isEditMode ? classItem : { name: '', grade: '', teacher: '', students: 0, room: '' }
    });
    
    const { isSubmitting } = useFormState({ control: form.control });

    useEffect(() => {
        if (isEditMode && classItem) {
            form.reset(classItem);
        } else {
            form.reset({ name: '', grade: '', teacher: '', students: 0, room: '' });
        }
    }, [classItem, isEditMode, form, isDialogOpen]);

    async function onSubmit(values: ClassFormValues) {
        if(isEditMode && classItem) {
            await updateClass(classItem.id, values);
        } else {
            await addClass(values);
        }
        form.reset();
        setIsDialogOpen(false);
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? `Edit ${classItem?.name}` : 'Create New Class Section'}</DialogTitle>
                    <DialogDescription>{isEditMode ? 'Update the details for this class section.' : 'Define a new group of students (e.g., a homeroom section).'}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Class Name</FormLabel><FormControl><Input placeholder="e.g., Class 9-A" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="grade" render={({ field }) => ( <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger></FormControl><SelectContent>{Array.from({ length: 12 }, (_, i) => i + 1).map(g => <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="teacher" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Homeroom Teacher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Teacher" /></SelectTrigger></FormControl><SelectContent>{teachersData.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="students" render={({ field }) => ( <FormItem><FormLabel>No. of Students</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="room" render={({ field }) => ( <FormItem><FormLabel>Homeroom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <DialogFooter className="col-span-2 mt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}> {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isEditMode ? 'Save Changes' : 'Create Class'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function DeleteClassDialog({ classItem, children }: { classItem: ClassType, children: React.ReactNode}) {
    const { deleteClass } = useSchoolData();
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDesc>
                        This will permanently delete the class "{classItem.name}". This action cannot be undone. Associated courses will also be removed.
                    </AlertDialogDesc>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteClass(classItem.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}


function StudentsPerClassChart() {
  const { classesData } = useSchoolData();

  const chartData = useMemo(() => {
    return classesData.map(c => ({ name: c.name, students: c.students }))
      .sort((a,b) => b.students - a.students);
  }, [classesData]);

  const chartConfig = {
    students: {
      label: "Students",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students per Class</CardTitle>
        <CardDescription>Distribution of students across all class sections.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="students" fill="var(--color-students)" radius={4}>
              <LabelList dataKey="students" position="top" offset={4} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function ClassesPage() {
    const { role, isLoading } = useAuth();
    const { classesData } = useSchoolData();
    const router = useRouter();

    const summaryStats = useMemo(() => {
        const totalStudents = classesData.reduce((acc, c) => acc + c.students, 0);
        const totalClasses = classesData.length;
        const avgClassSize = totalClasses > 0 ? (totalStudents / totalClasses) : 0;
        return { totalClasses, totalStudents, avgClassSize: avgClassSize.toFixed(1) };
    }, [classesData]);

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
                    <p className="text-muted-foreground">Manage class sections and student groups.</p>
                </div>
                 <ClassFormDialog><Button><UserPlus className="mr-2 h-4 w-4" />Create Class</Button></ClassFormDialog>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Classes</CardTitle><School className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{summaryStats.totalClasses}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Enrolled Students</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{summaryStats.totalStudents}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Average Class Size</CardTitle><Sigma className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{summaryStats.avgClassSize}</div></CardContent>
                </Card>
            </div>

            {classesData.length > 0 && <StudentsPerClassChart />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classesData.map((classItem) => (
                    <Card key={classItem.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{classItem.name}</CardTitle>
                                <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">Grade {classItem.grade}</span>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <ClassFormDialog classItem={classItem}><DropdownMenuItem onSelect={(e) => e.preventDefault()}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem></ClassFormDialog>
                                        <DeleteClassDialog classItem={classItem}><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem></DeleteClassDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 flex-grow">
                            <div className="flex items-center text-muted-foreground">
                                <Presentation className="mr-3 h-4 w-4" />
                                <span>Homeroom Teacher: {classItem.teacher}</span>
                            </div>
                             <div className="flex items-center text-muted-foreground">
                                <Users className="mr-3 h-4 w-4" />
                                <span>{classItem.students} Students</span>
                            </div>
                             <div className="flex items-center text-muted-foreground">
                                <MapPin className="mr-3 h-4 w-4" />
                                <span>Default Homeroom: {classItem.room}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                 {classesData.length === 0 && (
                    <p className="text-muted-foreground col-span-full text-center py-10">No classes have been created yet.</p>
                )}
            </div>
        </div>
    );
}
