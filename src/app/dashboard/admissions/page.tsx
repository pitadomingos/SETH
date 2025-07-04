
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData, Admission } from '@/context/school-data-context';
import { MoreHorizontal, Check, X, FileText, UserPlus, Loader2 } from 'lucide-react';

const applicationSchema = z.object({
  name: z.string().min(2, "Applicant name must be at least 2 characters."),
  appliedFor: z.string().min(1, "Please specify the grade being applied for."),
  formerSchool: z.string().min(2, "Former school is required."),
  grades: z.string().min(10, "Please provide a brief summary of previous grades."),
  parentName: z.string().min(2, "Parent name is required."),
  parentEmail: z.string().email("Invalid email address for parent."),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

function ViewApplicationDialog({ application }: { application: Admission }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Application</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                    <DialogDescription>
                        Full details for applicant: {application.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <p className="font-semibold">Applicant Name:</p><p>{application.name}</p>
                        <p className="font-semibold">Applying For:</p><p>{application.appliedFor}</p>
                        <p className="font-semibold">Application Date:</p><p>{application.date}</p>
                        <p className="font-semibold">Status:</p><p><Badge variant={application.status === 'Approved' ? 'secondary' : application.status === 'Rejected' ? 'destructive' : 'outline'}>{application.status}</Badge></p>
                        <p className="font-semibold">Parent Name:</p><p>{application.parentName}</p>
                        <p className="font-semibold">Parent Email:</p><p>{application.parentEmail}</p>
                        <p className="font-semibold">Former School:</p><p>{application.formerSchool}</p>
                    </div>
                    <div>
                         <p className="font-semibold">Grades Summary:</p>
                         <p className="text-muted-foreground p-2 bg-muted rounded-md mt-1">{application.grades}</p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function AdmissionsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { admissionsData, updateApplicationStatus } = useSchoolData();
  const router = useRouter();
  const [applications, setApplications] = useState(admissionsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    setApplications(admissionsData);
  }, [admissionsData]);

  useEffect(() => {
    if (!authLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: '', appliedFor: '', formerSchool: '', grades: '', parentName: '', parentEmail: '',
    },
  });

  if (authLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  async function onSubmit(values: ApplicationFormValues) {
    const newApplication = {
      id: `ADM${String(applications.length + 1).padStart(3, '0')}`,
      name: values.name,
      appliedFor: values.appliedFor,
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'Pending' as const,
      formerSchool: values.formerSchool,
      grades: values.grades,
      parentName: values.parentName,
      parentEmail: values.parentEmail,
    };
    setApplications([newApplication, ...applications]);
    form.reset();
    setIsDialogOpen(false);
  }

  const handleStatusChange = (id: string, status: Admission['status']) => {
    updateApplicationStatus(id, status);
  };

  const stats = applications.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, { Pending: 0, Approved: 0, Rejected: 0 });

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admissions</h2>
          <p className="text-muted-foreground">Manage student admission applications and enrollment.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="mr-2 h-4 w-4" />New Application</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New Admission Application</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new application. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Applicant Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="appliedFor" render={({ field }) => ( <FormItem><FormLabel>Applying for Grade</FormLabel><FormControl><Input placeholder="e.g., Grade 9" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="parentName" render={({ field }) => ( <FormItem><FormLabel>Parent Name</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="parentEmail" render={({ field }) => ( <FormItem><FormLabel>Parent Email</FormLabel><FormControl><Input type="email" placeholder="e.g., j.doe@family.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="formerSchool" render={({ field }) => ( <FormItem className="col-span-1 md:col-span-2"><FormLabel>Former School</FormLabel><FormControl><Input placeholder="e.g., Anytown Middle School" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="grades" render={({ field }) => ( <FormItem className="col-span-1 md:col-span-2"><FormLabel>Former School Grades</FormLabel><FormControl><Textarea placeholder="Summarize previous grades or note that a transcript is attached." {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Application</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Applications</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-orange-500">{stats.Pending || 0}</div><p className="text-xs text-muted-foreground">Awaiting review</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Approved</CardTitle><Check className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">{stats.Approved || 0}</div><p className="text-xs text-muted-foreground">Ready for enrollment</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Rejected</CardTitle><X className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-500">{stats.Rejected || 0}</div><p className="text-xs text-muted-foreground">Did not meet criteria</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Applications</CardTitle><CardDescription>A list of the latest admission applications.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Applicant Name</TableHead><TableHead>Parent</TableHead><TableHead>Applied For</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.name}</TableCell>
                  <TableCell>{application.parentName} <span className="text-muted-foreground">({application.parentEmail})</span></TableCell>
                  <TableCell>{application.appliedFor}</TableCell>
                  <TableCell>{application.date}</TableCell>
                  <TableCell><Badge variant={ application.status === 'Approved' ? 'secondary' : application.status === 'Rejected' ? 'destructive' : 'outline' }>{application.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ViewApplicationDialog application={application} />
                        <DropdownMenuItem onClick={() => handleStatusChange(application.id, 'Approved')}>Approve</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(application.id, 'Rejected')} className="text-destructive">Reject</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
