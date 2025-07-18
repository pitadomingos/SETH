
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect } from 'react';
import { Loader2, PenSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FeatureLock } from '@/components/layout/feature-lock';

export default function LessonPlannerPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { schoolProfile, isLoading: dataLoading } = useSchoolData();

  const isLoading = authLoading || dataLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Teacher') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (role !== 'Teacher') {
     return <div className="flex h-full items-center justify-center"><p>Access Denied</p></div>;
  }

  if (schoolProfile?.tier === 'Starter') {
    return <FeatureLock featureName="AI Lesson Planner" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">AI-Powered Weekly Lesson Planner</h2>
        <p className="text-muted-foreground">Generate, save, and print performance-aware weekly lesson plans for your classes.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PenSquare /> Feature Removed</CardTitle>
          <CardDescription>
            The AI Lesson Planner feature has been temporarily removed to ensure application stability. The functionality will be restored in a future update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">We apologize for any inconvenience.</p>
        </CardContent>
      </Card>
    </div>
  );
}
