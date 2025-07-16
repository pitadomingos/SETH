
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Award, School, GraduationCap, Presentation, Star, Medal, CheckCircle, Settings, BrainCircuit } from 'lucide-react';
import { useSchoolData, AwardConfig, BehavioralAssessment } from '@/context/school-data-context';
import { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGpaFromNumeric } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { analyzeTopSchool } from '@/ai/flows/analyze-top-school';
import { analyzeTopStudent } from '@/ai/flows/analyze-top-student';
import { analyzeTopTeacher } from '@/ai/flows/analyze-top-teacher';


const prizeSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  hasCertificate: z.boolean(),
});

const awardConfigSchema = z.object({
  topSchool: z.array(prizeSchema).length(3),
  topStudent: z.array(prizeSchema).length(3),
  topTeacher: z.array(prizeSchema).length(3),
});

type AwardConfigFormValues = z.infer<typeof awardConfigSchema>;


function ConfigurePrizesDialog() {
  const { awardConfig, updateAwardConfig } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<AwardConfigFormValues>({
    resolver: zodResolver(awardConfigSchema),
    defaultValues: awardConfig,
  });
  
  const { fields: schoolFields } = useFieldArray({ control: form.control, name: "topSchool" });
  const { fields: studentFields } = useFieldArray({ control: form.control, name: "topStudent" });
  const { fields: teacherFields } = useFieldArray({ control: form.control, name: "topTeacher" });

  useEffect(() => {
    form.reset(awardConfig);
  }, [awardConfig, isOpen, form]);

  const onSubmit = (values: AwardConfigFormValues) => {
    updateAwardConfig(values);
    setIsOpen(false);
  };

  const rankLabels = ['1st Place', '2nd Place', '3rd Place'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Configure Prizes</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configure Annual Awards</DialogTitle>
          <DialogDescription>
            Set the prizes for each award category. Changes will be saved for the session.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><School /> Top Performing School Prizes</h3>
              <div className="grid grid-cols-3 gap-4">
                {schoolFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <FormLabel>{rankLabels[index]}</FormLabel>
                    <FormField control={form.control} name={`topSchool.${index}.description`} render={({ field }) => ( <FormItem className="mt-2"><FormControl><Input placeholder="Prize description..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name={`topSchool.${index}.hasCertificate`} render={({ field }) => ( <FormItem className="flex items-center space-x-2 mt-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-sm font-normal">Includes Certificate</FormLabel></FormItem> )} />
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><GraduationCap /> Student of the Year Prizes</h3>
              <div className="grid grid-cols-3 gap-4">
                {studentFields.map((field, index) => (
                   <Card key={field.id} className="p-4">
                    <FormLabel>{rankLabels[index]}</FormLabel>
                    <FormField control={form.control} name={`topStudent.${index}.description`} render={({ field }) => ( <FormItem className="mt-2"><FormControl><Input placeholder="Prize description..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name={`topStudent.${index}.hasCertificate`} render={({ field }) => ( <FormItem className="flex items-center space-x-2 mt-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-sm font-normal">Includes Certificate</FormLabel></FormItem> )} />
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Presentation /> Teacher of the Year Prizes</h3>
              <div className="grid grid-cols-3 gap-4">
                {teacherFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <FormLabel>{rankLabels[index]}</FormLabel>
                    <FormField control={form.control} name={`topTeacher.${index}.description`} render={({ field }) => ( <FormItem className="mt-2"><FormControl><Input placeholder="Prize description..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name={`topTeacher.${index}.hasCertificate`} render={({ field }) => ( <FormItem className="flex items-center space-x-2 mt-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-sm font-normal">Includes Certificate</FormLabel></FormItem> )} />
                  </Card>
                ))}
              </div>
            </div>
             <DialogFooter className="sticky bottom-0 bg-background pt-4 pr-0">
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit">Save Configuration</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


const calculateAverageGpaForSchool = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const totalPoints = grades.reduce((acc, g) => acc + getGpaFromNumeric(parseFloat(g.grade)), 0);
    return parseFloat((totalPoints / grades.length).toFixed(2));
};

const rankingStyles = [
  { color: 'text-yellow-500', size: 'h-8 w-8', label: '1st Place' },
  { color: 'text-gray-400', size: 'h-6 w-6', label: '2nd Place' },
  { color: 'text-orange-600', size: 'h-6 w-6', label: '3rd Place' },
];

function AnnounceWinnersButton({ onAnnounce, hasBeenAnnounced }) {
  const { toast } = useToast();

  const handleAnnounce = () => {
    onAnnounce();
    toast({
      title: "Winners Announced!",
      description: "An event has been created on every school's calendar.",
    });
  };

  if (hasBeenAnnounced) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-semibold p-2 bg-green-500/10 rounded-md">
        <CheckCircle className="h-4 w-4" />
        <span>Awards for {new Date().getFullYear()} have been announced.</span>
      </div>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Star className="mr-2 h-4 w-4" /> Announce Winners
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Announcement</AlertDialogTitle>
          <AlertDialogDescription>
            This will create a public event on every school's calendar announcing the winners for this year. This action cannot be undone. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAnnounce}>Confirm & Announce</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// --- Analysis Dialogs ---

function SchoolAnalysisDialog({ school }) {
  const { allSchoolData } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
        const schoolData = allSchoolData?.[school.id];
        if (!schoolData) throw new Error("School data not found");
        
        const totalFees = schoolData.finance.reduce((sum, f) => sum + f.totalAmount, 0);
        const totalRevenue = schoolData.finance.reduce((sum, f) => sum + f.amountPaid, 0);
        const feeCollectionRate = totalFees > 0 ? (totalRevenue / totalFees) * 100 : 100;
        const overdueFees = schoolData.finance.filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) < new Date()).reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
        
        const avgTeacherScore = schoolData.savedReports.filter(r => r.type === 'TeacherPerformance').reduce((acc, r, _, arr) => acc + r.result.performanceScore / arr.length, 50);

        const result = await analyzeTopSchool({
            schoolName: school.name,
            studentCount: schoolData.students.length,
            averageGpa: school.avgGpa,
            feeCollectionRate,
            overdueFees,
            avgTeacherPerformanceScore: avgTeacherScore,
        });
        setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (open) => {
      setIsOpen(open);
      if (!open) {
          setIsLoading(false);
          setAnalysis(null);
      }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{/* Children will be passed here */}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Why is {school.name} a Top School?</DialogTitle>
          <DialogDescription>AI-powered analysis of the key metrics behind their success.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2"/>Analyzing...</div>
          ) : analysis ? (
            <div className="text-sm space-y-3">
              <p className="p-3 bg-muted rounded-md">{analysis.analysis}</p>
              <div>
                <h4 className="font-semibold mb-2">Key Strengths:</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {analysis.keyStrengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          ) : (
             <Button onClick={handleRunAnalysis} className="w-full"><BrainCircuit className="mr-2 h-4 w-4" />Run AI Analysis</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StudentAnalysisDialog({ student }) {
  const { allSchoolData } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
        const schoolData = allSchoolData?.[student.schoolId];
        if (!schoolData) throw new Error("School data not found");
        const studentGrades = schoolData.grades.filter(g => g.studentId === student.id).map(g => ({ subject: g.subject, grade: g.grade }));
        const studentAttendance = schoolData.attendance.filter(a => a.studentId === student.id);
        const presentCount = studentAttendance.filter(a => ['Present', 'Late'].includes(a.status)).length;
        const attendanceRate = studentAttendance.length > 0 ? (presentCount / studentAttendance.length) * 100 : 100;

        const result = await analyzeTopStudent({
            studentName: student.name,
            schoolName: student.schoolName,
            grade: `Grade ${student.grade}`,
            averageGrade: student.avgGrade,
            grades: studentGrades,
            attendanceRate,
            behavioralAssessments: student.behavioralAssessments
        });
        setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (open) => {
      setIsOpen(open);
      if (!open) {
          setIsLoading(false);
          setAnalysis(null);
      }
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="cursor-pointer"></div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Why is {student.name} a Top Student?</DialogTitle>
          <DialogDescription>AI-powered analysis of their academic record.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2"/>Analyzing...</div>
          ) : analysis ? (
            <div className="text-sm space-y-3">
              <p className="p-3 bg-muted rounded-md">{analysis.analysis}</p>
              <div>
                <h4 className="font-semibold mb-2">Key Strengths:</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {analysis.keyStrengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          ) : (
             <Button onClick={handleRunAnalysis} className="w-full"><BrainCircuit className="mr-2 h-4 w-4" />Run AI Analysis</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TeacherAnalysisDialog({ teacher }) {
  const { allSchoolData } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
        const schoolData = allSchoolData?.[teacher.schoolId];
        if (!schoolData) throw new Error("School data not found");
        
        const classPerformances = schoolData.courses.filter(c => c.teacherId === teacher.id).map(course => {
            const classInfo = schoolData.classes.find(c => c.id === course.classId);
            if (!classInfo) return null;
            const studentsInClass = schoolData.students.filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim()).map(s => s.id);
            const classGrades = schoolData.grades.filter(g => studentsInClass.includes(g.studentId) && g.subject === course.subject).map(g => parseFloat(g.grade));
            const averageGrade = classGrades.length ? classGrades.reduce((sum, g) => sum + g, 0) / classGrades.length : 0;
            const passingRate = classGrades.length ? (classGrades.filter(g => g >= 10).length / classGrades.length) * 100 : 0;
            return { className: classInfo.name, averageGrade, passingRate };
        }).filter(Boolean);

        const result = await analyzeTopTeacher({
            teacherName: teacher.name,
            schoolName: teacher.schoolName,
            subject: teacher.subject,
            averageStudentGrade: teacher.avgStudentGrade,
            classPerformances: classPerformances as any,
        });
        setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (open) => {
      setIsOpen(open);
      if (!open) {
          setIsLoading(false);
          setAnalysis(null);
      }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="cursor-pointer"></div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Why is {teacher.name} a Top Teacher?</DialogTitle>
          <DialogDescription>AI-powered analysis of their performance metrics.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2"/>Analyzing...</div>
          ) : analysis ? (
            <div className="text-sm space-y-3">
              <p className="p-3 bg-muted rounded-md">{analysis.analysis}</p>
              <div>
                <h4 className="font-semibold mb-2">Key Metrics:</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {analysis.keyMetrics.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          ) : (
             <Button onClick={handleRunAnalysis} className="w-full"><BrainCircuit className="mr-2 h-4 w-4" />Run AI Analysis</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Main Page Component ---
export default function AwardsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, announceAwards, awardConfig } = useSchoolData();
  const router = useRouter();
  const [hasBeenAnnounced, setHasBeenAnnounced] = useState(false);

  const isLoading = authLoading || schoolLoading;

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const topSchools = useMemo(() => {
    if (!allSchoolData) return [];
    return Object.values(allSchoolData)
      .map(school => ({
        id: school.profile.id,
        name: school.profile.name,
        logoUrl: school.profile.logoUrl,
        avgGpa: calculateAverageGpaForSchool(school.grades),
      }))
      .sort((a, b) => b.avgGpa - a.avgGpa)
      .slice(0, 3);
  }, [allSchoolData]);

  const topStudents = useMemo(() => {
    if (!allSchoolData) return [];
    const allStudents = Object.values(allSchoolData).flatMap(school =>
      school.students.map(student => ({ ...student, schoolName: school.profile.name, schoolId: school.profile.id }))
    );
    const allGrades = Object.values(allSchoolData).flatMap(s => s.grades);
    const allAttendance = Object.values(allSchoolData).flatMap(s => s.attendance);

    return allStudents.map(student => {
      // Academic Score (60%)
      const studentGrades = allGrades.filter(g => g.studentId === student.id).map(g => parseFloat(g.grade));
      const avgGrade = studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g, 0) / studentGrades.length : 0;
      const academicScore = (avgGrade / 20) * 60;

      // Attendance Score (20%)
      const studentAttendance = allAttendance.filter(a => a.studentId === student.id);
      const attendedCount = studentAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
      const attendanceRate = studentAttendance.length > 0 ? (attendedCount / studentAttendance.length) * 100 : 100;
      const attendanceScore = (attendanceRate / 100) * 20;

      // Behavioral Score (20%)
      let behaviorScore = 0;
      if (student.behavioralAssessments && student.behavioralAssessments.length > 0) {
          const totalScore = student.behavioralAssessments.reduce((sum, assessment) => sum + assessment.respect + assessment.participation + assessment.socialSkills + assessment.conduct, 0);
          const totalItems = student.behavioralAssessments.length * 4;
          const avgBehavior = totalScore / totalItems;
          // Normalize from 1-5 scale to 0-1, then multiply by weight
          behaviorScore = ((avgBehavior - 1) / 4) * 20;
      } else {
          // Default to average score if no assessments
          behaviorScore = ( (3 - 1) / 4 ) * 20;
      }
      
      const holisticScore = academicScore + attendanceScore + behaviorScore;

      return { ...student, avgGrade, holisticScore };
    })
    .sort((a,b) => b.holisticScore - a.holisticScore)
    .slice(0, 3);
  }, [allSchoolData]);

  const topTeachers = useMemo(() => {
    if (!allSchoolData) return [];
    const allTeachers = Object.values(allSchoolData).flatMap(s => s.teachers.map(teacher => ({...teacher, schoolName: s.profile.name, schoolId: s.profile.id})));
    const allGrades = Object.values(allSchoolData).flatMap(s => s.grades);

    return allTeachers.map(teacher => {
      const school = allSchoolData[teacher.schoolId];
      if (!school) return { ...teacher, avgStudentGrade: 0 };

      const teacherCourses = school.courses.filter(c => c.teacherId === teacher.id);
      const studentIds = new Set<string>();
      
      teacherCourses.forEach(course => {
          const classInfo = school.classes.find(c => c.id === course.classId);
          if(classInfo) {
              school.students
                  .filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim())
                  .forEach(s => studentIds.add(s.id));
          }
      });

      const teacherGrades = allGrades
          .filter(g => studentIds.has(g.studentId) && teacherCourses.some(c => c.subject === g.subject))
          .map(g => parseFloat(g.grade));
      
      const avgStudentGrade = teacherGrades.length > 0
          ? teacherGrades.reduce((sum, g) => sum + g, 0) / teacherGrades.length
          : 0;
      
      return { ...teacher, avgStudentGrade };
    })
    .sort((a, b) => b.avgStudentGrade - a.avgStudentGrade)
    .slice(0, 3);
  }, [allSchoolData]);

  if (isLoading || !allSchoolData || !awardConfig) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const handleAnnounceWinners = () => {
    announceAwards();
    setHasBeenAnnounced(true);
  };
  
  const AwardCard = ({ rank, children, prize }) => {
    const isFirst = rank === 0;
    return (
        <Card className={cn(isFirst ? 'md:col-span-1' : '', 'flex flex-col')}>
            <CardHeader className="flex-row items-center gap-4">
                <Medal className={cn(rankingStyles[rank].color, rankingStyles[rank].size)} />
                <div className="flex-1">
                    <CardTitle>{rankingStyles[rank].label}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                {children}
            </CardContent>
            {prize && (
              <CardFooter className="flex-col items-start pt-4 border-t">
                  <p className="font-semibold">Prize:</p>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-muted-foreground">{prize.description}</p>
                    {prize.hasCertificate && <Badge variant="outline"><Award className="mr-1.5 h-3 w-3" />Certificate</Badge>}
                  </div>
              </CardFooter>
            )}
        </Card>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">EduManage Excellence Awards</h2>
            <p className="text-muted-foreground">Manage and announce the annual awards for the top performers in the network.</p>
        </div>
        <div className="flex items-center gap-2">
            <ConfigurePrizesDialog />
            <AnnounceWinnersButton onAnnounce={handleAnnounceWinners} hasBeenAnnounced={hasBeenAnnounced} />
        </div>
      </header>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-2xl font-semibold flex items-center gap-3 mb-4"><School /> Top Performing Schools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topSchools.length > 0 ? (
              <>
                <AwardCard rank={0} prize={awardConfig.topSchool[0]}>
                    <SchoolAnalysisDialog school={topSchools[0]}>
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-yellow-500">
                            <AvatarImage src={topSchools[0].logoUrl} data-ai-hint="school logo"/>
                            <AvatarFallback>{topSchools[0].name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <p className="text-xl font-bold">{topSchools[0].name}</p>
                        <p className="text-3xl font-bold text-primary mt-2">{topSchools[0].avgGpa.toFixed(2)} GPA</p>
                    </div>
                    </SchoolAnalysisDialog>
                </AwardCard>
                <div className="space-y-6">
                  {topSchools[1] && (
                      <AwardCard rank={1} prize={awardConfig.topSchool[1]}>
                        <SchoolAnalysisDialog school={topSchools[1]}>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-gray-400"><AvatarImage src={topSchools[1].logoUrl} data-ai-hint="school logo"/><AvatarFallback>{topSchools[1].name.substring(0, 2)}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-bold">{topSchools[1].name}</p>
                              <p className="text-xl font-bold text-primary mt-1">{topSchools[1].avgGpa.toFixed(2)} GPA</p>
                            </div>
                          </div>
                        </SchoolAnalysisDialog>
                      </AwardCard>
                  )}
                  {topSchools[2] && (
                      <AwardCard rank={2} prize={awardConfig.topSchool[2]}>
                        <SchoolAnalysisDialog school={topSchools[2]}>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-orange-600"><AvatarImage src={topSchools[2].logoUrl} data-ai-hint="school logo"/><AvatarFallback>{topSchools[2].name.substring(0, 2)}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-bold">{topSchools[2].name}</p>
                              <p className="text-xl font-bold text-primary mt-1">{topSchools[2].avgGpa.toFixed(2)} GPA</p>
                            </div>
                          </div>
                        </SchoolAnalysisDialog>
                      </AwardCard>
                  )}
                </div>
              </>
            ) : <p className="text-muted-foreground text-center col-span-2">No school data available for ranking.</p>}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold flex items-center gap-3 mb-4"><GraduationCap /> Students of the Year</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topStudents.length > 0 ? (
                <>
                  <AwardCard rank={0} prize={awardConfig.topStudent[0]}>
                    <StudentAnalysisDialog student={topStudents[0]}>
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-yellow-500"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topStudents[0].name[0]}</AvatarFallback></Avatar>
                        <p className="text-xl font-bold">{topStudents[0].name}</p>
                        <p className="text-sm text-muted-foreground">{topStudents[0].schoolName}</p>
                        <p className="text-3xl font-bold text-primary mt-2">{topStudents[0].holisticScore.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Holistic Score</p>
                      </div>
                    </StudentAnalysisDialog>
                  </AwardCard>
                  <div className="space-y-6">
                  {topStudents[1] && (
                      <AwardCard rank={1} prize={awardConfig.topStudent[1]}>
                        <StudentAnalysisDialog student={topStudents[1]}>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-gray-400"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topStudents[1].name[0]}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-bold">{topStudents[1].name}</p>
                              <p className="text-xs text-muted-foreground">{topStudents[1].schoolName}</p>
                              <p className="text-xl font-bold text-primary mt-1">{topStudents[1].holisticScore.toFixed(2)}</p>
                            </div>
                          </div>
                        </StudentAnalysisDialog>
                      </AwardCard>
                  )}
                  {topStudents[2] && (
                      <AwardCard rank={2} prize={awardConfig.topStudent[2]}>
                        <StudentAnalysisDialog student={topStudents[2]}>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-orange-600"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topStudents[2].name[0]}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-bold">{topStudents[2].name}</p>
                              <p className="text-xs text-muted-foreground">{topStudents[2].schoolName}</p>
                              <p className="text-xl font-bold text-primary mt-1">{topStudents[2].holisticScore.toFixed(2)}</p>
                            </div>
                          </div>
                        </StudentAnalysisDialog>
                      </AwardCard>
                  )}
                  </div>
                </>
              ) : <p className="text-muted-foreground text-center col-span-2">No student data available for ranking.</p>}
           </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold flex items-center gap-3 mb-4"><Presentation /> Teachers of the Year</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topTeachers.length > 0 ? (
                <>
                  <AwardCard rank={0} prize={awardConfig.topTeacher[0]}>
                    <TeacherAnalysisDialog teacher={topTeachers[0]}>
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-yellow-500"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topTeachers[0].name[0]}</AvatarFallback></Avatar>
                        <p className="text-xl font-bold">{topTeachers[0].name}</p>
                        <p className="text-sm text-muted-foreground">{topTeachers[0].schoolName} - {topTeachers[0].subject}</p>
                        <p className="text-3xl font-bold text-primary mt-2">{topTeachers[0].avgStudentGrade.toFixed(2)}/20</p>
                        <p className="text-xs text-muted-foreground">Avg. Student Grade</p>
                      </div>
                    </TeacherAnalysisDialog>
                  </AwardCard>
                  <div className="space-y-6">
                  {topTeachers[1] && (
                      <AwardCard rank={1} prize={awardConfig.topTeacher[1]}>
                        <TeacherAnalysisDialog teacher={topTeachers[1]}>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-gray-400"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topTeachers[1].name[0]}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-bold">{topTeachers[1].name}</p>
                              <p className="text-xs text-muted-foreground">{topTeachers[1].schoolName} - {topTeachers[1].subject}</p>
                              <p className="text-xl font-bold text-primary mt-1">{topTeachers[1].avgStudentGrade.toFixed(2)}/20</p>
                            </div>
                          </div>
                        </TeacherAnalysisDialog>
                      </AwardCard>
                  )}
                  {topTeachers[2] && (
                      <AwardCard rank={2} prize={awardConfig.topTeacher[2]}>
                        <TeacherAnalysisDialog teacher={topTeachers[2]}>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-orange-600"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{topTeachers[2].name[0]}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-bold">{topTeachers[2].name}</p>
                              <p className="text-xs text-muted-foreground">{topTeachers[2].schoolName} - {topTeachers[2].subject}</p>
                              <p className="text-xl font-bold text-primary mt-1">{topTeachers[2].avgStudentGrade.toFixed(2)}/20</p>
                            </div>
                          </div>
                        </TeacherAnalysisDialog>
                      </AwardCard>
                  )}
                  </div>
                </>
              ) : <p className="text-muted-foreground text-center col-span-2">No teacher data available for ranking.</p>}
           </div>
        </section>
      </div>
    </div>
  );
}
