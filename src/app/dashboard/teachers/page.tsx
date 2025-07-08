
'use client';
import { useSchoolData, Teacher } from '@/context/school-data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2, MoreHorizontal, Edit, Search, Presentation, CheckCircle, XCircle, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

const PAGE_SIZE = 10;

const teacherSchema = z.object({
  name: z.string().min(2, "Name is required."),
  sex: z.enum(['Male', 'Female'], { required_error: "Please select a gender." }),
  subject: z.string().min(2, "Subject is required."),
  email: z.string().email("Invalid email."),
  phone: z.string().min(10, "Invalid phone number."),
  address: z.string().min(5, "Address is too short."),
  experience: z.string().min(1, "Experience is required."),
  qualifications: z.string().min(2, "Qualifications are required."),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

function NewTeacherDialog() {
    const { addTeacher, subjects } = useSchoolData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const form = useForm<TeacherFormValues>({
        resolver: zodResolver(teacherSchema),
        defaultValues: { name: '', subject: '', email: '', phone: '', address: '', experience: '', qualifications: '', sex: 'Male' }
    });

    function onSubmit(values: TeacherFormValues) {
        addTeacher(values);
        form.reset();
        setIsDialogOpen(false);
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button><UserPlus className="mr-2 h-4 w-4" />Add Teacher</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Teacher</DialogTitle>
                    <DialogDescription>Enter the details for the new teacher.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="sex" render={({ field }) => ( <FormItem><FormLabel>Sex</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger></FormControl>
                                    <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="address" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="experience" render={({ field }) => ( <FormItem><FormLabel>Experience</FormLabel><FormControl><Input placeholder="e.g., 5 years" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="qualifications" render={({ field }) => ( <FormItem><FormLabel>Qualifications</FormLabel><FormControl><Input placeholder="e.g., M.Ed." {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <DialogFooter className="col-span-2 mt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}> {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Teacher</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function EditTeacherDialog({ teacher }: { teacher: Teacher }) {
    const { updateTeacher, subjects } = useSchoolData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<TeacherFormValues>({
        resolver: zodResolver(teacherSchema),
        defaultValues: { ...teacher }
    });
    
    useEffect(() => {
        if(teacher) form.reset(teacher);
    }, [teacher, form]);

    function onSubmit(values: TeacherFormValues) {
        updateTeacher(teacher.id, values);
        setIsDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
            </DropdownMenuContent>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Teacher: {teacher.name}</DialogTitle>
                    <DialogDescription>Update the details for this teacher.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
                         <FormField control={form.control} name="sex" render={({ field }) => ( <FormItem><FormLabel>Sex</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger></FormControl>
                                    <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="address" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="experience" render={({ field }) => ( <FormItem><FormLabel>Experience</FormLabel><FormControl><Input placeholder="e.g., 5 years" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="qualifications" render={({ field }) => ( <FormItem><FormLabel>Qualifications</FormLabel><FormControl><Input placeholder="e.g., M.Ed." {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <DialogFooter className="col-span-2 mt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}> {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function TeachersBySubjectChart() {
    const { teachersData } = useSchoolData();

    const chartData = useMemo(() => {
        const subjectCounts = teachersData.reduce((acc, teacher) => {
            acc[teacher.subject] = (acc[teacher.subject] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(subjectCounts)
            .map(([name, teachers]) => ({ name, teachers: teachers as number }))
            .sort((a, b) => b.teachers - a.teachers);

    }, [teachersData]);

    const chartConfig = {
        teachers: {
            label: "Teachers",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Teachers by Subject</CardTitle>
                <CardDescription>A distribution of teaching staff across subjects.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            width={80}
                        />
                        <XAxis type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="teachers" fill="var(--color-teachers)" radius={4}>
                           <LabelList dataKey="teachers" position="right" offset={8} className="fill-foreground" fontSize={12} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default function TeachersPage() {
    const { role, isLoading } = useAuth();
    const { teachersData } = useSchoolData();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredTeachers = useMemo(() => {
        return teachersData.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teachersData, searchTerm]);

    const paginatedTeachers = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredTeachers.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredTeachers, currentPage]);

    const totalPages = Math.ceil(filteredTeachers.length / PAGE_SIZE);

    const summaryStats = useMemo(() => {
        const activeTeachers = teachersData.filter(t => t.status === 'Active').length;
        const inactiveTeachers = teachersData.length - activeTeachers;
        const uniqueSubjects = new Set(teachersData.map(t => t.subject)).size;
        return {
            totalTeachers: teachersData.length,
            activeTeachers,
            inactiveTeachers,
            uniqueSubjects,
        };
    }, [teachersData]);

    useEffect(() => {
        if (!isLoading && role !== 'Admin') {
            router.push('/dashboard');
        }
    }, [role, isLoading, router]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (isLoading || role !== 'Admin') {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Teacher Management</h2>
                    <p className="text-muted-foreground">Manage teacher information and assignments.</p>
                </div>
                 <NewTeacherDialog />
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Teachers</CardTitle><Presentation className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{summaryStats.totalTeachers}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Teachers</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-500">{summaryStats.activeTeachers}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Inactive/Transferred</CardTitle><XCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-500">{summaryStats.inactiveTeachers}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Subject Diversity</CardTitle><Briefcase className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{summaryStats.uniqueSubjects}</div></CardContent>
                </Card>
            </div>

            <TeachersBySubjectChart />

            <Card>
                <CardHeader>
                    <CardTitle>All Teachers ({filteredTeachers.length})</CardTitle>
                    <CardDescription>View and manage all teachers in the system.</CardDescription>
                    <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search teachers by name, email, or subject..."
                          className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Sex</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Experience</TableHead>
                                <TableHead>Qualifications</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedTeachers.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell className="font-medium">{teacher.name}</TableCell>
                                    <TableCell>{teacher.sex}</TableCell>
                                    <TableCell>{teacher.subject}</TableCell>
                                    <TableCell>
                                        <div>{teacher.email}</div>
                                        <div className="text-muted-foreground">{teacher.phone}</div>
                                    </TableCell>
                                    <TableCell>{teacher.experience}</TableCell>
                                    <TableCell>{teacher.qualifications}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <EditTeacherDialog teacher={teacher} />
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filteredTeachers.length === 0 && (
                        <p className="text-center text-muted-foreground py-10">No teachers found matching your search.</p>
                    )}
                </CardContent>
                {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2 p-4 border-t">
                        <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
