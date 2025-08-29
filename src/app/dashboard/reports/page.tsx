
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData, SavedReport } from '@/context/school-data-context';
import { useEffect, useState, useRef } from 'react';
import { Loader2, BrainCircuit, Sparkles, Save, FileText, BarChart, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FeatureLock } from '@/components/layout/feature-lock';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { analyzeSchoolPerformanceAction } from '@/app/actions/ai-actions';
import { SchoolAnalysis, SchoolAnalysisParams } from '@/ai/flows/school-analysis-flow';
import { format } from 'date-fns';
import { useReactToPrint } from 'react-to-print';

export default function AiReportsPage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { schoolProfile, isLoading: dataLoading, studentsData, teachersData, grades, attendance, addSavedReport, savedReports } = useSchoolData();
  const { toast } = useToast();
  const reportRef = useRef(null);

  const [reportType, setReportType] = useState<SchoolAnalysisParams['type']>('School-Wide');
  const [generatedReport, setGeneratedReport] = useState<SchoolAnalysis | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = authLoading || dataLoading;

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: generatedReport?.title || 'School Performance Report',
  });

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const handleGenerateReport = async () => {
    if (!schoolProfile) return;
    
    setIsGenerating(true);
    setGeneratedReport(null);
    setError(null);
    
    const params: SchoolAnalysisParams = {
        type: reportType,
        schoolName: schoolProfile.name,
        students: studentsData.map(s => ({ name: s.name, grade: s.grade, class: s.class })),
        teachers: teachersData.map(t => ({ name: t.name, subject: t.subject })),
        grades: grades.map(g => ({ studentId: g.studentId, subject: g.subject, grade: g.grade })),
        attendance: attendance.map(a => ({ studentId: a.studentId, status: a.status })),
    };
    
    try {
        const result = await analyzeSchoolPerformanceAction(params);
        setGeneratedReport(result);
    } catch(e) {
        console.error("AI Report generation failed:", e);
        setError('Failed to generate the report. The AI service may be temporarily unavailable.');
        toast({ variant: 'destructive', title: 'Generation Failed' });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSaveReport = () => {
    if (!generatedReport || !user) return;
    const reportData: Omit<SavedReport, 'id'> = {
      type: reportType,
      title: `${reportType} Report - ${format(new Date(), 'PPP')}`,
      date: new Date(),
      generatedBy: user.name,
      content: generatedReport,
    };
    addSavedReport(reportData);
    toast({ title: 'Report Saved', description: 'The generated report has been saved.' });
    setGeneratedReport(null);
  };

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
        <h2 className="text-3xl font-bold tracking-tight">AI-Powered Reports</h2>
        <p className="text-muted-foreground">Generate insightful reports on school, class, and student performance.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText /> Generate New Report</CardTitle>
          <CardDescription>Select the type of report you want the AI to generate based on your school's current data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Select onValueChange={(value) => setReportType(value as any)} defaultValue={reportType}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select report type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="School-Wide">School-Wide Performance</SelectItem>
                <SelectItem value="Class Performance">Class Performance</SelectItem>
                <SelectItem value="Struggling Students">Struggling Students</SelectItem>
                <SelectItem value="Teacher Performance">Teacher Performance</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

       {generatedReport && (
        <Card>
          <div ref={reportRef}>
            <CardHeader>
              <CardTitle>{generatedReport.title}</CardTitle>
              <CardDescription>{generatedReport.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart /> Key Metrics</h3>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                          {generatedReport.keyMetrics.map((metric, i) => <li key={i}><b>{metric.metric}:</b> {metric.value}</li>)}
                      </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold mb-2 flex items-center gap-2"><BrainCircuit/> Insights</h3>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                          {generatedReport.insights.map((insight, i) => <li key={i}>{insight}</li>)}
                      </ul>
                  </div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      {generatedReport.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                  </ul>
              </div>
            </CardContent>
          </div>
          <CardFooter className="flex gap-2">
            <Button onClick={handleSaveReport}><Save className="mr-2 h-4 w-4"/> Save Report</Button>
            <Button variant="outline" onClick={handlePrint}><Download className="mr-2 h-4 w-4"/> Download PDF</Button>
          </CardFooter>
        </Card>
      )}

      {savedReports.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Saved Reports</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {savedReports.map(report => (
                <div key={report.id} className="p-4 border rounded-lg">
                    <h4 className="font-semibold">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">Generated by {report.generatedBy} on {format(report.date, 'PPP')}</p>
                    <Button variant="link" className="p-0 h-auto mt-2">View Report</Button>
                </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
