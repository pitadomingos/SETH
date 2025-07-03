'use client';
import { useState } from 'react';
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
import { useSchoolData } from '@/context/school-data-context';
import { MoreHorizontal, Check, X, FileText, UserPlus, Loader2 } from 'lucide-react';

const applicationSchema = z.object({
  name: z.string().min(2, "Applicant name must be at least 2 characters."),
  appliedFor: z.string().min(1, "Please specify the grade being applied for."),
  formerSchool: z.string().min(2, "Former school is required."),
  grades: z.string().min(10, "Please provide a brief summary of previous grades."),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function AdmissionsPage() {
  const { role } = useAuth();
  const { admissionsData } = useSchoolData();
  const router = useRouter();
  const [applications, setApplications] = useState(admissionsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: '',
      appliedFor: '',
      formerSchool: '',
      grades: '',
    },
  });

  if (role && role !== 'Admin') {
    router.push('/dashboard');
    return null;
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
    };
    setApplications([newApplication, ...applications]);
    form.reset();
    setIsDialogOpen(false);
  }

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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Admission Application</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new application. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appliedFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applying for Grade</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Grade 9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="formerSchool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Former School</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Anytown Middle School" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grades"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Former School Grades</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Summarize previous grades or note that a transcript is attached." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Application
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.Pending || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.Approved || 0}</div>
            <p className="text-xs text-muted-foreground">Ready for enrollment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.Rejected || 0}</div>
            <p className="text-xs text-muted-foreground">Did not meet criteria</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>A list of the latest admission applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Applied For</TableHead>
                <TableHead>Former School</TableHead>
                <TableHead>Grades Summary</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.name}</TableCell>
                  <TableCell>{application.appliedFor}</TableCell>
                  <TableCell>{application.formerSchool}</TableCell>
                  <TableCell>{application.grades}</TableCell>
                  <TableCell>{application.date}</TableCell>
                  <TableCell>
                    <Badge variant={
                      application.status === 'Approved' ? 'secondary' :
                        application.status === 'Rejected' ? 'destructive' : 'outline'
                    }>{application.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Application</DropdownMenuItem>
                        <DropdownMenuItem>Approve</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Reject</DropdownMenuItem>
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
