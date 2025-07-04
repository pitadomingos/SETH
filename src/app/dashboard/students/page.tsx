'use client';
import { useSchoolData } from '@/context/school-data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const studentSchema = z.object({
  name: z.string().min(2, "Name is required."),
  grade: z.string().min(1, "Grade is required."),
  class: z.string().min(1, "Class is required."),
  email: z.string().email("Invalid email."),
  phone: z.string().min(10, "Invalid phone number."),
  address: z.string().min(5, "Address is too short."),
  parentName: z.string().min(2, "Parent name is required."),
  parentEmail: z.string().email("Invalid parent email."),
});
type StudentFormValues = z.infer<typeof studentSchema>;

function NewStudentDialog() {
    const { addStudent } = useSchoolData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: { name: '', grade: '', class: '', email: '', phone: '', address: '', parentName: '', parentEmail: '' }
    });

    function onSubmit(values: StudentFormValues) {
        addStudent(values);
        form.reset();
        setIsDialogOpen(false);
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button><UserPlus className="mr-2 h-4 w-4" />Add Student</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>Enter the details for the new student.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="grade" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Grade</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger></FormControl>
                                    <SelectContent>{Array.from({ length: 12 }, (_, i) => i + 1).map(g => <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="class" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Class Section</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger></FormControl>
                                    <SelectContent>{['A', 'B', 'C', 'D'].map(c => <SelectItem key={c} value={c}>Section {c}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="parentName" render={({ field }) => ( <FormItem><FormLabel>Parent Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="parentEmail" render={({ field }) => ( <FormItem><FormLabel>Parent Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <DialogFooter className="col-span-2 mt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}> {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Student</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function StudentsPage() {
    const { role, isLoading } = useAuth();
    const { studentsData } = useSchoolData();
    const router = useRouter();

    const getGpaLetterGrade = (gpa: number): string => {
        if (gpa >= 4.0) return 'A+';
        if (gpa >= 3.7) return 'A';
        if (gpa >= 3.3) return 'B+';
        if (gpa >= 3.0) return 'B';
        if (gpa >= 2.7) return 'B-';
        if (gpa >= 2.3) return 'C+';
        if (gpa >= 2.0) return 'C';
        if (gpa >= 1.7) return 'C-';
        if (gpa >= 1.0) return 'D';
        return 'F';
    };

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
                    <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
                    <p className="text-muted-foreground">Manage student information and records.</p>
                </div>
                <NewStudentDialog />
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>View and manage all students in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>GPA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentsData.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>Grade {student.grade} - {student.class}</TableCell>
                                    <TableCell>
                                        <div>{student.email}</div>
                                        <div className="text-muted-foreground">{student.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={student.gpa >= 3.5 ? 'secondary' : 'outline'}>
                                            {student.gpa.toFixed(1)} ({getGpaLetterGrade(student.gpa)})
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
