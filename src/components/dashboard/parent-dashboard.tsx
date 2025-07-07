

'use client';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { useSchoolData, NewAdmissionData, Competition, Team, Student } from '@/context/school-data-context';
import { generateParentAdvice, GenerateParentAdviceOutput } from '@/ai/flows/generate-parent-advice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, User, GraduationCap, DollarSign, BarChart2, UserPlus, Calendar as CalendarIcon, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn, formatCurrency } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart } from 'recharts';
import { getLetterGrade, formatGradeDisplay, getGpaFromNumeric } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';


const applicationSchema = z.object({
  schoolId: z.string({ required_error: "Please select a school to apply to."}),
  name: z.string().min(2, "Applicant name must be at least 2 characters."),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  sex: z.enum(['Male', 'Female'], { required_error: "Please select a gender." }),
  appliedFor: z.string().min(1, "Please specify the grade being applied for."),
  formerSchool: z.string().min(2, "Please enter the name of the former school."),
  gradesSummary: z.string().min(10, "Please provide a brief summary of previous grades.").optional(),
});
type ApplicationFormValues = z.infer<typeof applicationSchema>;

function NewApplicationDialog() {
  const { addAdmission, allSchoolData } = useSchoolData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
  });

  const selectedSchoolId = form.watch('schoolId');
  const selectedGradeStr = form.watch('appliedFor');

  const vacancies = useMemo(() => {
    if (!selectedSchoolId || !selectedGradeStr) return null;
    const school = allSchoolData?.[selectedSchoolId];
    if (!school) return null;

    const gradeNumber = selectedGradeStr.replace('Grade ', '');
    const capacity = school.profile.gradeCapacity?.[gradeNumber] ?? 0;
    const currentStudents = school.students.filter(s => s.grade === gradeNumber).length;

    return Math.max(0, capacity - currentStudents);
  }, [selectedSchoolId, selectedGradeStr, allSchoolData]);

  function onSubmit(values: ApplicationFormValues) {
    addAdmission({
      schoolId: values.schoolId,
      name: values.name,
      dateOfBirth: format(values.dateOfBirth, 'yyyy-MM-dd'),
      sex: values.sex,
      appliedFor: values.appliedFor,
      formerSchool: values.formerSchool,
      gradesSummary: values.gradesSummary || 'N/A',
    });
    toast({
      title: 'Application Submitted',
      description: `The application for ${values.name} has been sent to the school for review.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  const schoolList = allSchoolData ? Object.values(allSchoolData).map(s => s.profile) : [];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button><UserPlus className="mr-2 h-4 w-4" /> New Application</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for a New Child</DialogTitle>
          <DialogDescription>
            Fill out this form to submit a new admission application to a school.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <FormField control={form.control} name="schoolId" render={({ field }) => ( <FormItem><FormLabel>School to Apply To</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select School" /></SelectTrigger></FormControl><SelectContent>{schoolList.map(school => <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Child's Full Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="dateOfBirth" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/>
                <FormField control={form.control} name="sex" render={({ field }) => ( <FormItem><FormLabel>Sex</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
            </div>
            <FormField control={form.control} name="appliedFor" render={({ field }) => (
                <FormItem>
                    <FormLabel>Applying for Grade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedSchoolId}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger></FormControl>
                        <SelectContent>{Array.from({ length: 12 }, (_, i) => i + 1).map(g => <SelectItem key={g} value={`Grade ${g}`}>Grade {g}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
             {vacancies !== null && (
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md border">
                    Available Vacancies for this grade: <span className="font-bold text-primary">{vacancies}</span>
                    {vacancies === 0 && " (Applications will be added to the waitlist)"}
                </div>
            )}
            <FormField control={form.control} name="formerSchool" render={({ field }) => ( <FormItem><FormLabel>Previous School</FormLabel><FormControl><Input placeholder="e.g., Eastwood Elementary" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="gradesSummary" render={({ field }) => ( <FormItem><FormLabel>Previous Grades Summary</FormLabel><FormControl><Textarea placeholder="Briefly describe academic performance, e.g., 'Consistent A grades in Math and Science, B in English.'" {...field} /></FormControl><FormMessage /></FormItem> )} />
            
            <DialogFooter className="sticky bottom-0 bg-background pt-4 pr-0">
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Application</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


function AIGeneratedAdvice({ child, childGrades, childAttendanceSummary }) {
  const { toast } = useToast();
  const [advice, setAdvice] = useState<GenerateParentAdviceOutput | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(true);

  useEffect(() => {
    if (!child) return;
    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      setAdvice(null);
      try {
        const gradesForAdvice = childGrades.map(g => ({ subject: g.subject, grade: g.grade }));
        
        if (gradesForAdvice.length === 0) {
          setAdvice({
            summary: `${child.name} doesn't have any grades recorded yet. Check back soon for AI-powered insights!`,
            strengths: 'No data available.',
            recommendations: 'Encourage regular study habits and participation in class.'
          });
          return;
        }

        const result = await generateParentAdvice({
          studentName: child.name,
          grades: gradesForAdvice,
          attendanceSummary: childAttendanceSummary,
        });
        setAdvice(result);
      } catch (error) {
        console.error('Failed to generate parent advice:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Could not load AI advice for ${child.name}. Please try again later.`,
        });
      } finally {
        setIsLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [child, childGrades, childAttendanceSummary, toast]);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> AI-Powered Insights</CardTitle>
          <CardDescription>A summary of {child.name}'s progress and recommendations for you.</CardDescription>
      </CardHeader>
      <CardContent>
          {isLoadingAdvice ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                  <p>Generating personalized advice...</p>
              </div>
          ) : advice ? (
              <div className="space-y-4 text-sm">
                  <p className="italic">{advice.summary}</p>
                  <div>
                      <h4 className="font-semibold mb-1">Strengths:</h4>
                      <p className="whitespace-pre-wrap text-muted-foreground">{advice.strengths}</p>
                  </div>
                    <div>
                      <h4 className="font-semibold mb-1">Recommendations:</h4>
                      <p className="whitespace-pre-wrap text-muted-foreground">{advice.recommendations}</p>
                  </div>
              </div>
          ) : (
              <p>Could not load advice.</p>
          )}
      </CardContent>
    </Card>
  )
}

function GradeDistribution({ grades }) {
  const chartData = useMemo(() => {
    return grades.map(grade => ({
      subject: grade.subject,
      gpa: getGpaFromNumeric(parseFloat(grade.grade))
    }));
  }, [grades]);

  const chartConfig = {
    gpa: {
      label: 'GPA',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart2 /> Grade Distribution</CardTitle>
        <CardDescription>Performance by subject based on GPA.</CardDescription>
      </CardHeader>
      <CardContent>
        {grades.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <BarChart data={chartData} margin={{ top: 20 }}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="gpa" fill="var(--color-gpa)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>No grade data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ParentSportsActivities() {
    const { studentsData, teamsData, competitionsData } = useSchoolData();

    const upcomingCompetitions = useMemo(() => {
        const childrenIds = studentsData.map(c => c.id);
        const childrenTeams = teamsData.filter(t => t.playerIds.some(pId => childrenIds.includes(pId)));
        const teamMap = new Map(childrenTeams.map(t => [t.id, t]));
        
        return competitionsData
            .filter(c => c.date >= new Date() && teamMap.has(c.ourTeamId))
            .map(c => ({
                ...c,
                team: teamMap.get(c.ourTeamId),
                players: studentsData.filter(s => teamMap.get(c.ourTeamId)?.playerIds.includes(s.id))
            }))
            .sort((a,b) => a.date.getTime() - b.date.getTime());
    }, [studentsData, teamsData, competitionsData]);

    if (upcomingCompetitions.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy /> My Children's Sports</CardTitle>
                <CardDescription>Upcoming games and competitions for your children.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {upcomingCompetitions.map(comp => (
                        <li key={comp.id} className="flex items-start gap-4">
                            <div className="flex flex-col items-center p-2 bg-muted rounded-md w-14">
                                <span className="font-bold text-lg">{format(comp.date, 'dd')}</span>
                                <span className="text-xs uppercase">{format(comp.date, 'MMM')}</span>
                            </div>
                            <div>
                                <h4 className="font-semibold">{comp.team?.name} vs {comp.opponent}</h4>
                                <div className="text-sm text-muted-foreground mt-1">
                                    <div className="flex items-center gap-2"><User className="h-3 w-3"/><span>Player(s): {comp.players.map(p => p.name).join(', ')}</span></div>
                                    <div className="flex items-center gap-2"><CalendarIcon className="h-3 w-3"/><span>{format(comp.date, 'EEEE')} at {comp.time}</span></div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

const getStatusInfo = (fee) => {
    const balance = fee.totalAmount - fee.amountPaid;
    const isOverdue = new Date(fee.dueDate) < new Date() && balance > 0;

    if (balance <= 0) {
        return { text: 'Paid', variant: 'secondary' as const };
    }
    if (isOverdue) {
        return { text: 'Overdue', variant: 'destructive' as const };
    }
     if (fee.amountPaid > 0) {
        return { text: 'Partially Paid', variant: 'outline' as const };
    }
    return { text: 'Pending', variant: 'outline' as const };
};

export default function ParentDashboard() {
  const { user } = useAuth();
  const { studentsData, grades, attendance, financeData, schoolProfile, isLoading: schoolDataLoading } = useSchoolData();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedChildId && studentsData.length > 0) {
      setSelectedChildId(studentsData[0].id);
    }
  }, [studentsData, selectedChildId]);

  const selectedChild = useMemo(() => studentsData.find(c => c.id === selectedChildId), [selectedChildId, studentsData]);

  const childGrades = useMemo(() => {
    if (!selectedChildId) return [];
    return grades.filter(g => g.studentId === selectedChildId);
  }, [grades, selectedChildId]);
  
  const childAttendanceSummary = useMemo(() => {
    if (!selectedChildId) return { present: 0, late: 0, absent: 0, sick: 0 };
    const records = attendance.filter(a => a.studentId === selectedChildId);
    return records.reduce((acc, record) => {
      acc[record.status.toLowerCase()] = (acc[record.status.toLowerCase()] || 0) + 1;
      return acc;
    }, { present: 0, late: 0, absent: 0, sick: 0 });
  }, [attendance, selectedChildId]);

  const childFinanceSummary = useMemo(() => {
    if (!selectedChildId) return null;
    const childFees = financeData.filter(f => f.studentId === selectedChildId);
    if (childFees.length === 0) return null;
    // Prioritize showing an overdue fee, then a partially paid/pending one.
    const overdue = childFees.find(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) < new Date());
    if (overdue) return overdue;
    const pending = childFees.find(f => f.totalAmount - f.amountPaid > 0);
    if (pending) return pending;
    return childFees[0]; // Otherwise show the first one (likely a paid one)
  }, [financeData, selectedChildId]);

  if (schoolDataLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!studentsData || studentsData.length === 0) {
    return (
       <div className="space-y-6">
        <header className="flex flex-wrap gap-4 justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Parent Dashboard</h2>
              <p className="text-muted-foreground">Welcome, {user?.name}.</p>
            </div>
            <NewApplicationDialog />
        </header>
        <Card>
            <CardHeader>
            <CardTitle>No Student Data Found</CardTitle>
            </CardHeader>
            <CardContent>
            <p>No student information is linked to your account. You can submit an application for a new child to a school.</p>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Parent Dashboard</h2>
          <p className="text-muted-foreground">Welcome, {user?.name}. Here is an overview for your children.</p>
        </div>
        <NewApplicationDialog />
      </header>

      <div>
        <h3 className="text-lg font-medium mb-2">Select a Child</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentsData.map(child => (
            <Card 
              key={child.id} 
              onClick={() => setSelectedChildId(child.id)}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
                selectedChildId === child.id ? 'border-primary ring-2 ring-primary/50' : 'border-border'
              )}
            >
              <CardHeader>
                <CardTitle>{child.name}</CardTitle>
                <CardDescription>{child.schoolName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Grade {child.grade} - {child.class}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {selectedChild ? (
        <div className="space-y-6 animate-in fade-in-25">
           <div className="grid gap-6 lg:grid-cols-3">
            {selectedChild && (
              <AIGeneratedAdvice
                child={selectedChild}
                childGrades={childGrades}
                childAttendanceSummary={childAttendanceSummary}
              />
            )}
             <div className="space-y-6">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2"><DollarSign /> Fee Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                    {childFinanceSummary ? (
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Balance: <span className="font-bold text-lg">{formatCurrency(childFinanceSummary.totalAmount - childFinanceSummary.amountPaid, schoolProfile?.currency)}</span></p>
                                <p className="text-xs text-muted-foreground">Due: {new Date(childFinanceSummary.dueDate).toLocaleDateString()}</p>
                            </div>
                            <Badge variant={getStatusInfo(childFinanceSummary).variant}>{getStatusInfo(childFinanceSummary).text}</Badge>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">No fee information available.</p>
                    )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2"><GraduationCap /> Recent Grades</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {childGrades.length > 0 ? childGrades.slice(0, 3).map((grade, index) => {
                              const numericGrade = parseFloat(grade.grade);
                              return (
                                <li key={index} className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{grade.subject}</span>
                                    <Badge variant={numericGrade >= 17 ? 'secondary' : 'outline'}>{formatGradeDisplay(grade.grade, schoolProfile?.gradingSystem)}</Badge>
                                </li>
                              )
                            }) : <p className="text-muted-foreground text-sm">No recent grades.</p>}
                        </ul>
                    </CardContent>
                </Card>
              </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <GradeDistribution grades={childGrades} />
            <ParentSportsActivities />
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>Please select a child to view their details.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

