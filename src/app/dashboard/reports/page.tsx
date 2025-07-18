
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2, User, GitCompareArrows } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSchoolData, SavedReport } from '@/context/school-data-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { getLetterGrade } from '@/lib/utils';
import { format as formatDate } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { FeatureLock } from '@/components/layout/feature-lock';


// School-Wide Analysis Component
function SchoolWideAnalysis() {
    const { schoolProfile } = useSchoolData();
    const { toast } = useToast();

    return (
        <Card>
            <CardHeader>
                <CardTitle>School-Wide Holistic Analysis</CardTitle>
                <CardDescription>Generate a comprehensive report on the school's overall academic and financial health.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button disabled>Analyze School Performance (AI Feature Removed)</Button>
            </CardContent>
        </Card>
    );
}

// Class Analysis Component
function ClassAnalysis() {
  const { classesData, subjects } = useSchoolData();
  const { toast } = useToast();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Performance Analysis</CardTitle>
        <CardDescription>Select a class and subject to get a performance analysis and grade distribution chart.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Class" /></SelectTrigger><SelectContent>{classesData.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Subject" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          <Button disabled>Analyze (AI Feature Removed)</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Struggling Students Component
function StrugglingStudents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identify Struggling Students</CardTitle>
        <CardDescription>Run an analysis across the school to identify students who may need academic intervention.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button disabled>Identify Students (AI Feature Removed)</Button>
      </CardContent>
    </Card>
  );
}

// Teacher Performance Component
function TeacherPerformance() {
  const { teachersData } = useSchoolData();
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Performance Analysis</CardTitle>
        <CardDescription>Select a teacher to analyze their students' performance across classes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Teacher" /></SelectTrigger><SelectContent>{teachersData.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
          <Button disabled>Analyze (AI Feature Removed)</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { schoolProfile, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();

  const isLoading = authLoading || schoolLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (role !== 'Admin') {
     return <div className="flex h-full items-center justify-center"><p>Access Denied</p></div>;
  }

  if (schoolProfile?.tier === 'Starter') {
    return <FeatureLock featureName="AI Reports" />;
  }
  
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Academic Reports</h2>
        <p className="text-muted-foreground">Generate on-demand academic analysis for your classes, students, and teachers.</p>
        <p className="text-sm mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-md border border-yellow-200 dark:border-yellow-500/30">Note: All AI-powered analysis features have been temporarily removed to ensure application stability.</p>
      </header>
      
      <Tabs defaultValue="school-wide-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="school-wide-analysis">School-Wide</TabsTrigger>
          <TabsTrigger value="class-analysis">Class Analysis</TabsTrigger>
          <TabsTrigger value="struggling-students">Struggling Students</TabsTrigger>
          <TabsTrigger value="teacher-performance">Teacher Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="school-wide-analysis">
          <SchoolWideAnalysis />
        </TabsContent>
        <TabsContent value="class-analysis">
          <ClassAnalysis />
        </TabsContent>
        <TabsContent value="struggling-students">
          <StrugglingStudents />
        </TabsContent>
        <TabsContent value="teacher-performance">
          <TeacherPerformance />
        </TabsContent>
      </Tabs>
    </div>
  );
}
