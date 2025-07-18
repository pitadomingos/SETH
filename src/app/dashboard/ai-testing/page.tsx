
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect } from 'react';
import { Loader2, FlaskConical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FeatureLock } from '@/components/layout/feature-lock';

export default function AiTestingPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { schoolProfile, isLoading: schoolLoading } = useSchoolData();

  const isLoading = authLoading || schoolLoading;

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
        <h2 className="text-3xl font-bold tracking-tight">AI Test Generator</h2>
        <p className="text-muted-foreground">
          Generate, save, and deploy ad-hoc tests for your classes.
        </p>
      </header>
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FlaskConical /> Feature Removed</CardTitle>
          <CardDescription>
            The AI Test Generator feature has been temporarily removed to ensure application stability. The functionality will be restored in a future update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">We apologize for any inconvenience.</p>
        </CardContent>
      </Card>
    </div>
  );
}
