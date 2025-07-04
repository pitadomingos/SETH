
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building, Users, Presentation, Settings, BrainCircuit, DollarSign, School } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect, useState, useMemo } from 'react';
import { analyzeSchoolSystem, AnalyzeSchoolSystemOutput } from '@/ai/flows/analyze-school-system';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

// --- Helper functions for calculations ---
const gpaMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };
const calculateGpaFromGrade = (grade: string): number => {
    const numericGrade = parseFloat(grade);
    if (!isNaN(numericGrade) && isFinite(numericGrade)) {
        return (numericGrade / 5.0);
    }
    return gpaMap[grade] || 0;
}
const calculateAverageGpaForSchool = (grades) => {
    if (grades.length === 0) return 0;
    const totalPoints = grades.reduce((acc, g) => acc + calculateGpaFromGrade(g.grade), 0);
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

export default function GlobalAdminDashboard() {
  const { role, isLoading: authLoading, switchSchoolContext } = useAuth();
  const { allSchoolData, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();

  const isLoading = authLoading || schoolLoading;

  const summaryStats = useMemo(() => {
    if (!allSchoolData) return { schools: 0, students: 0, teachers: 0, revenue: 0 };
    const schools = Object.values(allSchoolData);
    const totalStudents = schools.reduce((sum, school) => sum + school.students.length, 0);
    const totalTeachers = schools.reduce((sum, school) => sum + school.teachers.length, 0);
    const totalRevenue = schools.reduce((sum, school) => {
        const schoolRevenue = school.finance.reduce((acc, f) => acc + f.amountPaid, 0);
        return sum + schoolRevenue;
    }, 0);
    return {
        schools: schools.length,
        students: totalStudents,
        teachers: totalTeachers,
        revenue: totalRevenue,
    }
  }, [allSchoolData]);

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'GlobalAdmin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const handleManageSchool = (schoolId: string) => {
    switchSchoolContext(schoolId);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Developer Dashboard</h2>
        <p className="text-muted-foreground">Oversee all schools, analyze system-wide performance, and manage deployments.</p>
      </header>
      
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${summaryStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Aggregated from all tenants</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allSchoolData && <AISystemAnalysis allSchoolData={allSchoolData} />}
        {allSchoolData && Object.values(allSchoolData).map(school => (
            <Card key={school.profile.id}>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
                                <Building className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>{school.profile.name}</CardTitle>
                                <CardDescription>{school.profile.address}</CardDescription>
                            </div>
                        </div>
                        {school.profile.tier && (
                            <Badge variant={school.profile.tier === 'Premium' ? 'default' : school.profile.tier === 'Pro' ? 'secondary' : 'outline'}>
                                {school.profile.tier}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{school.students.length} Students</span>
                    </div>
                     <div className="flex items-center text-sm text-muted-foreground">
                        <Presentation className="mr-2 h-4 w-4" />
                        <span>{school.teachers.length} Teachers</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleManageSchool(school.profile.id)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage School
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
