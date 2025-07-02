
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { role } = useAuth();
  const router = useRouter();

  if (role && role !== 'Admin') {
      router.push('/dashboard');
      return null;
  }
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage system settings and preferences.</p>
      </header>
      <Card className="flex items-center justify-center min-h-[400px]">
        <CardContent className="text-center text-muted-foreground p-6">
          <Wrench className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Coming Soon!</h3>
          <p>The system settings feature is currently being built.</p>
        </CardContent>
      </Card>
    </div>
  );
}
