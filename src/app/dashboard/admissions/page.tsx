
'use client';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData, Admission } from '@/context/school-data-context';
import { MoreHorizontal, Check, X, FileText as FileTextIcon, Loader2, User, Users2, BarChart, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateAge } from '@/lib/utils';
import { Pie, PieChart, Cell, Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { FeatureLock } from '@/components/layout/feature-lock';
import { Separator } from '@/components/ui/separator';

function ViewApplicationDialog({ application }: { application: Admission }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Application</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                    <DialogDescription>
                        Full details for applicant: {application.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm max-h-[60vh] overflow-y-auto pr-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <p className="font-semibold">Applicant Name:</p><p>{application.name}</p>
                        <p className="font-semibold">Age:</p><p>{calculateAge(application.dateOfBirth)} years old</p>
                        <p className="font-semibold">Sex:</p><p>{application.sex}</p>
                        <p className="font-semibold">Applying For:</p><p>{application.appliedFor}</p>
                        <p className="font-semibold">Date of Birth:</p><p>{application.dateOfBirth}</p>
                        <p className="font-semibold">Application Date:</p><p>{application.date}</p>
                        <p className="font-semibold">Status:</p><p><Badge variant={application.status === 'Approved' ? 'secondary' : application.status === 'Rejected' ? 'destructive' : 'outline'}>{application.status}</Badge></p>
                        <p className="font-semibold">Parent Name:</p><p>{application.parentName}</p>
                        <p className="font-semibold col-span-2">Parent Email:</p><p className="col-span-2 break-all">{application.parentEmail}</p>
                    </div>

                    <Separator />
                    
                    {application.type === 'Transfer' ? (
                         <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <p className="font-semibold">Transfer From:</p><p>{application.formerSchool}</p>
                            <p className="font-semibold col-span-2">Reason for Transfer:</p>
                            <p className="col-span-2 text-muted-foreground whitespace-pre-wrap">{application.reasonForTransfer}</p>
                         </div>
                    ) : (
                        <div className="space-y-2">
                           <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                             <p className="font-semibold">Previous School:</p><p>{application.formerSchool}</p>
                           </div>
                           <div className="space-y-1">
                                <p className="font-semibold">Academic Summary:</p>
                                <p className="text-muted-foreground whitespace-pre-wrap p-3 bg-muted rounded-md">{application.grades}</p>
                           </div>
                        </div>
                    )}
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

function ApplicationsByGradeChart({ admissions }) {
  const chartData = useMemo(() => {
    const gradeCounts = admissions.reduce((acc, application) => {
      const grade = application.appliedFor;
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(gradeCounts).map(([name, count]) => ({
      name: name.replace('Grade ', 'G'),
      count: count as number,
    })).sort((a,b) => parseInt(a.name.substring(1)) - parseInt(b.name.substring(1)));
  }, [admissions]);

  const chartConfig = {
    count: { label: "Applications", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart /> Applications by Grade</CardTitle>
        <CardDescription>Distribution of new applications per grade level.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <RechartsBarChart data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4}>
              <LabelList dataKey="count" position="top" offset={4} className="fill-foreground" fontSize={12} />
            </Bar>
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function ApplicantGenderChart({ admissions }) {
  const chartData = useMemo(() => {
    const genderCounts = admissions.reduce((acc, application) => {
      acc[application.sex] = (acc[application.sex] || 0) + 1;
      return acc;
    }, { Male: 0, Female: 0 });

    return [{ name: 'Male', count: genderCounts.Male, fill: 'var(--color-male)' }, { name: 'Female', count: genderCounts.Female, fill: 'var(--color-female)' }];
  }, [admissions]);

  const chartConfig = {
    count: { label: "Count" },
    male: { label: "Male", color: "hsl(var(--chart-1))" },
    female: { label: "Female", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users2 /> Applicant Gender Ratio</CardTitle>
        <CardDescription>Male vs. female applicant distribution.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, count }) => `${name}: ${count}`}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


export default function AdmissionsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { admissionsData, updateApplicationStatus, addStudentFromAdmission, schoolProfile, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  
  const isLoading = authLoading || schoolLoading;
  const isAuthorized = role === 'Admin' || role === 'AdmissionsOfficer';

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.push('/dashboard');
    }
  }, [role, isLoading, router, isAuthorized]);

  if (isLoading || !isAuthorized) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (schoolProfile?.tier === 'Starter') {
    return <FeatureLock featureName="Admissions" />;
  }

  const handleStatusChange = async (application: Admission, status: Admission['status']) => {
    await updateApplicationStatus(application.id, status);
    if (status === 'Approved') {
        await addStudentFromAdmission(application);
        toast({
            title: "Student Enrolled",
            description: `${application.name} has been approved and added to the student roster.`,
        });
    }
  };

  const stats = admissionsData.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, { Pending: 0, Approved: 0, Rejected: 0 });

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admissions</h2>
          <p className="text-muted-foreground">Review and process new student admission applications.</p>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Applications</CardTitle><FileTextIcon className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-orange-500">{stats.Pending || 0}</div><p className="text-xs text-muted-foreground">Awaiting review</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Approved</CardTitle><Check className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">{stats.Approved || 0}</div><p className="text-xs text-muted-foreground">Enrolled in student body</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Rejected</CardTitle><X className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-500">{stats.Rejected || 0}</div><p className="text-xs text-muted-foreground">Did not meet criteria</p></CardContent></Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <ApplicationsByGradeChart admissions={admissionsData} />
        <ApplicantGenderChart admissions={admissionsData} />
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Applications</CardTitle><CardDescription>A list of the latest admission applications.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Applicant Name</TableHead><TableHead>Type</TableHead><TableHead>Parent</TableHead><TableHead>Applied For</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
            <TableBody>
              {admissionsData.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.name}</TableCell>
                  <TableCell><Badge variant="outline" className="flex items-center gap-1 w-fit">{application.type === 'Transfer' ? <ArrowRightLeft className="h-3 w-3" /> : null}{application.type}</Badge></TableCell>
                  <TableCell>{application.parentName} <span className="text-muted-foreground">({application.parentEmail})</span></TableCell>
                  <TableCell>{application.appliedFor}</TableCell>
                  <TableCell>{application.date}</TableCell>
                  <TableCell><Badge variant={ application.status === 'Approved' ? 'secondary' : application.status === 'Rejected' ? 'destructive' : 'outline' }>{application.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ViewApplicationDialog application={application} />
                        <DropdownMenuItem onClick={() => handleStatusChange(application, 'Approved')} disabled={application.status !== 'Pending'}>Approve & Enroll</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(application, 'Rejected')} className="text-destructive" disabled={application.status !== 'Pending'}>Reject</DropdownMenuItem>
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
