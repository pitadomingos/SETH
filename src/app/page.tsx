'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { LoginForm } from '@/components/auth/login-form';
import { Loader2, Phone, Building } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  const { user, role, isLoading: authIsLoading } = useAuth();
  const { schoolProfile, isLoading: schoolDataIsLoading } = useSchoolData();
  const router = useRouter();

  const isLoading = authIsLoading || (user && schoolDataIsLoading);

  useEffect(() => {
    if (!isLoading && role) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [role, isLoading, router]);
  
  if (isLoading || (!authIsLoading && role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        {role && user && schoolProfile ? (
          <Card className="w-full max-w-md animate-in fade-in-50">
            <CardHeader className="items-center text-center">
              <div className="flex items-center gap-2">
                <Building className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{schoolProfile.name}</CardTitle>
              </div>
              <CardDescription>{schoolProfile.address}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{schoolProfile.phone}</span>
              </div>
              <div className="my-4 flex flex-col items-center gap-1">
                <p className="text-sm text-muted-foreground">Welcome</p>
                <p className="text-lg font-semibold">{user.name}</p>
              </div>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <LoginForm />
    </main>
  );
}
