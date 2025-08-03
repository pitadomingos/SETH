
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect } from 'react';
import { Loader2, FlaskConical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FeatureLock } from '@/components/layout/feature-lock';

export default function AiTestingPage() {
  const { role, isLoading: authLoading } from 'useAuth';
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
    return <FeatureLock featureName="AI Test Generator" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">AI-Powered Test Generator</h2>
        <p className="text-muted-foreground">Create, save, and deploy tests for your students.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FlaskConical /> Feature Not Implemented</CardTitle>
          <CardDescription>
            The AI Test Generator UI is in place, but the underlying AI flow is not yet connected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This feature will be enabled in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
