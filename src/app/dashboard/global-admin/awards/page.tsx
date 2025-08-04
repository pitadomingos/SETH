
'use client';
import { useAuth } from '@/context/auth-context';
import { useSchoolData } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, School, User, Sparkles, BrainCircuit, Gift, DollarSign, Award as AwardIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getGpaFromNumeric } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

function AIEvaluationDialog({ winner, category }) {
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateAnalysis = () => {
        setIsLoading(true);
        // Simulate AI analysis generation
        setTimeout(() => {
            let generatedAnalysis;
            if (category === 'School') {
                generatedAnalysis = {
                    title: `Analysis for ${winner.name}`,
                    points: [
                        `Demonstrated a 15% year-over-year improvement in average student GPA, reaching an impressive ${winner.avgGpa.toFixed(2)}.`,
                        "Achieved a 98% fee collection rate, indicating strong financial health and parent satisfaction.",
                        "Maintained a student-teacher ratio of 15:1, well below the network average, allowing for personalized attention.",
                        "Received outstanding community feedback, particularly regarding their extracurricular arts and science programs."
                    ],
                    recommendation: `The key to ${winner.name}'s success lies in its balanced focus on academic rigor and community engagement. Other schools could adopt their model of targeted after-school tutoring to boost academic performance.`
                };
            } else if (category === 'Teacher') {
                 generatedAnalysis = {
                    title: `Analysis for ${winner.name}`,
                    points: [
                        `Maintained an average student grade of ${winner.avgStudentGrade.toFixed(2)}/20 in ${winner.subject}, a subject often considered challenging.`,
                        "Consistently high parent-teacher meeting attendance, suggesting strong communication and parental involvement.",
                        "Pioneered the use of project-based learning, which correlates with a 20% increase in student engagement metrics.",
                        "Zero student complaints filed over the past academic year."
                    ],
                    recommendation: `${winner.name}'s use of formative assessments and personalized feedback loops is a model of excellence. Implementing weekly, low-stakes quizzes could help other teachers identify struggling students earlier.`
                };
            } else { // Student
                generatedAnalysis = {
                    title: `Analysis for ${winner.name}`,
                    points: [
                        `Achieved an exceptional average grade of ${winner.avgGrade.toFixed(2)}/20 across all subjects.`,
                        "Demonstrated perfect attendance for the entire academic year, showing remarkable dedication.",
                        "Actively participated in 3 extracurricular clubs, holding a leadership position in one.",
                        "Received top marks in behavioral assessments for respect and participation."
                    ],
                    recommendation: `Miguel's success is a testament to consistent effort and active participation. His study technique, which involves creating summary mind maps, could be shared with peers as a best-practice example.`
                };
            }
            setAnalysis(generatedAnalysis);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Sparkles className="mr-2 h-4 w-4" /> View Analysis</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><BrainCircuit /> AI Performance Analysis</DialogTitle>
                    <DialogDescription>
                        An AI-generated summary of the winner's achievements.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {!analysis && !isLoading && (
                         <div className="text-center p-8">
                             <p className="text-muted-foreground mb-4">Click below to generate the analysis for {winner.name}.</p>
                            <Button onClick={handleGenerateAnalysis}>Generate Analysis</Button>
                        </div>
                    )}
                    {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                    {analysis && (
                        <div className="space-y-4">
                            <h3 className="font-semibold">{analysis.title}</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                {analysis.points.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                            <div className="p-3 bg-primary/10 rounded-md">
                                <p className="font-semibold text-sm">Key Recommendation:</p>
                                <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function AwardsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  const isLoading = authLoading || schoolLoading;

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const schoolOfTheYear = useMemo(() => {
    if (!allSchoolData) return null;
    const schoolsWithScores = Object.values(allSchoolData).map(school => {
      const avgGpa = school.grades.length > 0
        ? school.grades.reduce((acc, g) => acc + getGpaFromNumeric(parseFloat(g.grade)), 0) / school.grades.length
        : 0;
      
      const totalFees = school.finance.reduce((sum, f) => sum + f.totalAmount, 0);
      const totalRevenue = school.finance.reduce((sum, f) => sum + f.amountPaid, 0);
      const collectionRate = totalFees > 0 ? (totalRevenue / totalFees) : 1;
      
      const score = (avgGpa * 0.6) + (collectionRate * 0.4);

      return { ...school.profile, score, avgGpa, collectionRate };
    });

    return schoolsWithScores.sort((a, b) => b.score - a.score)[0];
  }, [allSchoolData]);

  const teacherOfTheYear = useMemo(() => {
    if (!allSchoolData) return null;
    return Object.values(allSchoolData).flatMap(school => school.teachers.map(teacher => {
      const teacherCourses = school.courses.filter(c => c.teacherId === teacher.id);
      const studentIds = new Set<string>();
      teacherCourses.forEach(course => {
          const classInfo = school.classes.find(c => c.id === course.classId);
          if (classInfo) {
            school.students
              .filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim())
              .forEach(s => studentIds.add(s.id));
          }
      });
      const teacherGrades = school.grades
          .filter(g => studentIds.has(g.studentId) && g.subject === teacher.subject)
          .map(g => parseFloat(g.grade));
      const avgStudentGrade = teacherGrades.length > 0
          ? teacherGrades.reduce((sum, g) => sum + g, 0) / teacherGrades.length
          : 0;
      
      return { ...teacher, avgStudentGrade, schoolName: school.profile.name };
    })).sort((a, b) => b.avgStudentGrade - a.avgStudentGrade)[0];
  }, [allSchoolData]);

  const studentOfTheYear = useMemo(() => {
    if (!allSchoolData) return null;
    return Object.values(allSchoolData).flatMap(school => school.students.map(student => {
      const studentGrades = school.grades.filter(g => g.studentId === student.id);
      const avgGrade = studentGrades.length > 0 ? studentGrades.reduce((acc, g) => acc + parseFloat(g.grade), 0) / studentGrades.length : 0;
      return { ...student, avgGrade, schoolName: school.profile.name };
    })).sort((a, b) => b.avgGrade - a.avgGrade)[0];
  }, [allSchoolData]);

  const handleAnnounce = () => {
    toast({
      title: 'Winners Announced!',
      description: 'A notification has been sent to all schools regarding the award winners.',
      duration: 5000,
    });
  };

  if (isLoading || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">EduDesk Annual Awards</h2>
        <p className="text-muted-foreground">Recognizing excellence across the entire school network.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schoolOfTheYear && (
          <Card className="flex flex-col">
            <CardHeader className="text-center">
              <Trophy className="mx-auto h-12 w-12 text-amber-500" />
              <CardTitle className="text-2xl mt-4">School of the Year</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={schoolOfTheYear.logoUrl} alt={schoolOfTheYear.name} data-ai-hint="school logo"/>
                    <AvatarFallback><School /></AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{schoolOfTheYear.name}</h3>
                <p className="text-muted-foreground">{schoolOfTheYear.head}</p>
                <div className="mt-4 flex gap-2">
                    <Badge>Avg. GPA: {schoolOfTheYear.avgGpa.toFixed(2)}</Badge>
                    <Badge variant="secondary">Fees: {(schoolOfTheYear.collectionRate * 100).toFixed(0)}% Paid</Badge>
                </div>
            </CardContent>
            <CardFooter>
               <AIEvaluationDialog winner={schoolOfTheYear} category="School" />
            </CardFooter>
          </Card>
        )}
        {teacherOfTheYear && (
            <Card className="flex flex-col">
            <CardHeader className="text-center">
              <AwardIcon className="mx-auto h-12 w-12 text-slate-500" />
              <CardTitle className="text-2xl mt-4">Teacher of the Year</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="" alt={teacherOfTheYear.name} data-ai-hint="profile picture"/>
                    <AvatarFallback className="text-3xl">{teacherOfTheYear.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{teacherOfTheYear.name}</h3>
                <p className="text-muted-foreground">{teacherOfTheYear.subject} - {teacherOfTheYear.schoolName}</p>
                 <div className="mt-4 flex gap-2">
                    <Badge>Avg. Student Grade: {teacherOfTheYear.avgStudentGrade.toFixed(2)}</Badge>
                </div>
            </CardContent>
             <CardFooter>
               <AIEvaluationDialog winner={teacherOfTheYear} category="Teacher" />
            </CardFooter>
          </Card>
        )}
        {studentOfTheYear && (
            <Card className="flex flex-col">
            <CardHeader className="text-center">
              <User className="mx-auto h-12 w-12 text-cyan-600" />
              <CardTitle className="text-2xl mt-4">Student of the Year</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="" alt={studentOfTheYear.name} data-ai-hint="profile picture"/>
                    <AvatarFallback className="text-3xl">{studentOfTheYear.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{studentOfTheYear.name}</h3>
                <p className="text-muted-foreground">Grade {studentOfTheYear.grade} - {studentOfTheYear.schoolName}</p>
                 <div className="mt-4 flex gap-2">
                    <Badge>Avg. Grade: {studentOfTheYear.avgGrade.toFixed(2)}</Badge>
                </div>
            </CardContent>
             <CardFooter>
               <AIEvaluationDialog winner={studentOfTheYear} category="Student" />
            </CardFooter>
          </Card>
        )}
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift /> Prize Management</CardTitle>
            <CardDescription>Configure and announce the prizes for the award winners. This feature is for demonstration purposes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">School of the Year Prize</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4"/> $10,000 Technology Grant</p>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Teacher of the Year Prize</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4"/> $2,500 Professional Development Fund</p>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Student of the Year Prize</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4"/> $1,000 University Scholarship</p>
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleAnnounce}>Announce Winners &amp; Prizes</Button>
        </CardFooter>
       </Card>
    </div>
  );
}
