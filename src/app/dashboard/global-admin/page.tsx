
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Presentation, Settings, BrainCircuit, DollarSign, School, Gem, TrendingDown, BarChart2, X } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect, useState, useMemo } from 'react';
import { analyzeSchoolSystem, AnalyzeSchoolSystemOutput } from '@/ai/flows/analyze-school-system';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { getGpaFromNumeric, formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const calculateAverageGpaForSchool = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const totalPoints = grades.reduce((acc, g) => acc + getGpaFromNumeric(parseFloat(g.grade)), 0);
    return parseFloat((totalPoints / grades.length).toFixed(2));
};

function AISystemAnalysis({ allSchoolData }) {
  const [analysis, setAnalysis] = useState<AnalyzeSchoolSystemOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const schoolList = useMemo(() => Object.values(allSchoolData), [allSchoolData]);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<string[]>(schoolList.map(s => s.profile.id));

  const handleToggleSchool = (schoolId: string) => {
    setSelectedSchoolIds(prev =>
      prev.includes(schoolId)
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const handleToggleAll = () => {
    if (selectedSchoolIds.length === schoolList.length) {
      setSelectedSchoolIds([]);
    } else {
      setSelectedSchoolIds(schoolList.map(s => s.profile.id));
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const schoolsToAnalyze = schoolList.filter(s => selectedSchoolIds.includes(s.profile.id));
      const analysisInput = {
        schools: schoolsToAnalyze.map(school => {
          const totalRevenue = school.finance.reduce((acc, f) => acc + f.amountPaid, 0);
          const overdueFees = school.finance
            .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) < new Date())
            .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
          return {
            name: school.profile.name,
            tier: school.profile.tier,
            studentCount: school.students.length,
            teacherCount: school.teachers.length,
            averageGpa: calculateAverageGpaForSchool(school.grades),
            totalRevenue,
            overdueFees,
          };
        }),
      };
      const result = await analyzeSchoolSystem(analysisInput);
      setAnalysis(result);
    } catch (error) {
      console.error("Failed to fetch system analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setAnalysis(null);
  };

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BrainCircuit /> AI System-Wide Analysis</CardTitle>
        <CardDescription>Select schools and generate a high-level analysis of the network.</CardDescription>
        <div className="flex flex-wrap gap-2 items-center pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Select Schools ({selectedSchoolIds.length})</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Schools for Analysis</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedSchoolIds.length === schoolList.length}
                onSelect={(e) => e.preventDefault()}
                onClick={handleToggleAll}
              >
                {selectedSchoolIds.length === schoolList.length ? 'Deselect All' : 'Select All'}
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {schoolList.map(school => (
                <DropdownMenuCheckboxItem
                  key={school.profile.id}
                  checked={selectedSchoolIds.includes(school.profile.id)}
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => handleToggleSchool(school.profile.id)}
                  className="justify-between"
                >
                  <span>{school.profile.name}</span>
                  <Badge variant={school.profile.tier === 'Premium' ? 'default' : school.profile.tier === 'Pro' ? 'secondary' : 'outline'}>{school.profile.tier}</Badge>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAnalyze} disabled={isLoading || selectedSchoolIds.length === 0}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
            Analyze Selection
          </Button>
          {(analysis || isLoading) && (
             <Button variant="ghost" onClick={handleReset} disabled={isLoading}>
                <X className="mr-2 h-4 w-4" />
                Clear Results
             </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2"/>
            <p>AI is analyzing data from selected schools...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Overall Analysis:</h4>
              <p className="text-muted-foreground">{analysis.overallAnalysis}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Recommendations:</h4>
              <p className="whitespace-pre-wrap text-muted-foreground">{analysis.recommendations}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">Run an analysis to see AI-powered insights here.</p>
        )}
      </CardContent>
    </Card>
  )
}

function GlobalLeaderboards({ allSchoolData }) {
  // Logic for Top Schools
  const topSchools = useMemo(() => {
    return Object.values(allSchoolData)
      .map(school => ({
        id: school.profile.id,
        name: school.profile.name,
        avgGpa: calculateAverageGpaForSchool(school.grades),
      }))
      .sort((a, b) => b.avgGpa - a.avgGpa)
      .slice(0, 10);
  }, [allSchoolData]);

  // Logic for Top Students
  const topStudents = useMemo(() => {
    const allStudents = Object.values(allSchoolData).flatMap(s => s.students.map(student => ({...student, schoolName: s.profile.name})));
    const allGrades = Object.values(allSchoolData).flatMap(s => s.grades);
    
    return allStudents.map(student => {
        const studentGrades = allGrades.filter(g => g.studentId === student.id).map(g => parseFloat(g.grade));
        const avgGrade = studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g, 0) / studentGrades.length : 0;
        return { ...student, avgGrade };
    })
    .sort((a,b) => b.avgGrade - a.avgGrade)
    .slice(0, 10);
  }, [allSchoolData]);

  // Logic for Top Teachers
  const topTeachers = useMemo(() => {
    const allTeachers = Object.values(allSchoolData).flatMap(s => s.teachers.map(teacher => ({...teacher, schoolName: s.profile.name, schoolId: s.profile.id})));
    
    return allTeachers.map(teacher => {
      const school = allSchoolData[teacher.schoolId];
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
      const teacherGrades = school.grades
          .filter(g => studentIds.has(g.studentId) && g.subject === teacher.subject)
          .map(g => parseFloat(g.grade));
      
      const avgStudentGrade = teacherGrades.length > 0
          ? teacherGrades.reduce((sum, g) => sum + g, 0) / teacherGrades.length
          : 0;
      
      return { ...teacher, avgStudentGrade };
    })
    .sort((a, b) => b.avgStudentGrade - a.avgStudentGrade)
    .slice(0, 10);
  }, [allSchoolData]);

  // Logic for Financial Health
  const topFinancial = useMemo(() => {
    return Object.values(allSchoolData).map(school => {
      const totalFees = school.finance.reduce((sum, f) => sum + f.totalAmount, 0);
      const totalRevenue = school.finance.reduce((sum, f) => sum + f.amountPaid, 0);
      const collectionRate = totalFees > 0 ? (totalRevenue / totalFees) * 100 : 100;
      return {
        id: school.profile.id,
        name: school.profile.name,
        collectionRate,
      };
    })
    .sort((a,b) => b.collectionRate - a.collectionRate)
    .slice(0, 10);
  }, [allSchoolData]);
  
  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Global Leaderboards</CardTitle>
        <CardDescription>Top performers across the entire school network.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="schools">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schools">Top Schools</TabsTrigger>
            <TabsTrigger value="students">Top Students</TabsTrigger>
            <TabsTrigger value="teachers">Top Teachers</TabsTrigger>
            <TabsTrigger value="finance">Financial Health</TabsTrigger>
          </TabsList>

          <TabsContent value="schools" className="pt-4">
            <Table><TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>School</TableHead><TableHead className="text-right">Avg. GPA</TableHead></TableRow></TableHeader>
              <TableBody>{topSchools.map((school, i) => ( <TableRow key={school.id}><TableCell className="font-bold">{i + 1}</TableCell><TableCell>{school.name}</TableCell><TableCell className="text-right font-medium">{school.avgGpa.toFixed(2)}</TableCell></TableRow> ))}</TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="students" className="pt-4">
            <Table><TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Student</TableHead><TableHead>School</TableHead><TableHead className="text-right">Avg. Grade</TableHead></TableRow></TableHeader>
              <TableBody>{topStudents.map((student, i) => (
                <TableRow key={student.id}><TableCell className="font-bold">{i + 1}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{student.name[0]}</AvatarFallback></Avatar><span>{student.name}</span></div></TableCell>
                  <TableCell>{student.schoolName}</TableCell><TableCell className="text-right font-medium">{student.avgGrade.toFixed(2)}/20</TableCell>
                </TableRow> ))}</TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="teachers" className="pt-4">
             <Table><TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Teacher</TableHead><TableHead>School</TableHead><TableHead>Subject</TableHead><TableHead className="text-right">Avg. Student Grade</TableHead></TableRow></TableHeader>
              <TableBody>{topTeachers.map((teacher, i) => (
                <TableRow key={teacher.id}><TableCell className="font-bold">{i + 1}</TableCell>
                 <TableCell><div className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture"/><AvatarFallback>{teacher.name[0]}</AvatarFallback></Avatar><span>{teacher.name}</span></div></TableCell>
                  <TableCell>{teacher.schoolName}</TableCell><TableCell>{teacher.subject}</TableCell><TableCell className="text-right font-medium">{teacher.avgStudentGrade.toFixed(2)}/20</TableCell>
                </TableRow> ))}</TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="finance" className="pt-4">
             <Table><TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>School</TableHead><TableHead className="text-right">Fee Collection Rate</TableHead></TableRow></TableHeader>
              <TableBody>{topFinancial.map((school, i) => ( <TableRow key={school.id}><TableCell className="font-bold">{i + 1}</TableCell><TableCell>{school.name}</TableCell><TableCell className="text-right font-medium">{school.collectionRate.toFixed(2)}%</TableCell></TableRow> ))}</TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function GlobalAdminDashboard() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();

  const isLoading = authLoading || schoolLoading;

  const summaryStats = useMemo(() => {
    if (!allSchoolData) return { schools: 0, students: 0, teachers: 0, revenue: 0, expenses: 0, overdue: 0 };
    const schools = Object.values(allSchoolData);
    const totalStudents = schools.reduce((sum, school) => sum + school.students.length, 0);
    const totalTeachers = schools.reduce((sum, school) => sum + school.teachers.length, 0);
    
    const totalRevenue = schools.reduce((sum, school) => {
        const schoolRevenue = school.finance.reduce((acc, f) => acc + f.amountPaid, 0);
        return sum + schoolRevenue;
    }, 0);
    
    const totalExpenses = schools.reduce((sum, school) => {
        const schoolExpenses = school.expenses.reduce((acc, e) => acc + e.amount, 0);
        return sum + schoolExpenses;
    }, 0);

    const totalOverdue = schools.reduce((sum, school) => {
        const schoolOverdue = school.finance
            .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) < new Date())
            .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
        return sum + schoolOverdue;
    }, 0);

    return {
        schools: schools.length,
        students: totalStudents,
        teachers: totalTeachers,
        revenue: totalRevenue,
        expenses: totalExpenses,
        overdue: totalOverdue,
    }
  }, [allSchoolData]);

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'GlobalAdmin' || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">System Dashboard</h2>
        <p className="text-muted-foreground">High-level overview of the entire school network.</p>
      </header>
      
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.schools}</div>
            <p className="text-xs text-muted-foreground">Managed in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.students.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all schools</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Presentation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.teachers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all schools</p>
          </CardContent>
        </Card>
      </div>

       <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">Financial Overview</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{formatCurrency(summaryStats.revenue)}</div>
                        <p className="text-xs text-muted-foreground">Aggregated from all tenants</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(summaryStats.expenses)}</div>
                        <p className="text-xs text-muted-foreground">Aggregated from all tenants</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Overdue Fees</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{formatCurrency(summaryStats.overdue)}</div>
                        <p className="text-xs text-muted-foreground">Across all schools</p>
                    </CardContent>
                </Card>
            </div>
        </div>

      <div className="grid gap-6">
        <GlobalLeaderboards allSchoolData={allSchoolData} />
        <AISystemAnalysis allSchoolData={allSchoolData} />
      </div>
    </div>
  );
}
