'use client';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}!
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to EduDesk</CardTitle>
          <CardDescription>
            This is your starting point. You are logged in as a {role}.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
