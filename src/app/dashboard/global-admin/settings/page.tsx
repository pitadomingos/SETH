
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Tv } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalSettingsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const isLoading = authLoading;
  
  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'GlobalAdmin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">Manage global settings for the EduManage network.</p>
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Tv /> Page Deprecated</CardTitle>
            <CardDescription>Kiosk settings have been moved to the "Kiosk Showcase" page for easier access and unified management.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please use the Kiosk Showcase link in the sidebar to configure all public display settings.</p>
          <Button asChild variant="link" className="px-0">
            <Link href="/dashboard/kiosk-showcase">Go to Kiosk Showcase</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
