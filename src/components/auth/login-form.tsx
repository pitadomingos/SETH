'use client';
import { BookOpenCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (role: 'Admin' | 'Teacher' | 'Student') => {
    login(role);
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
          <BookOpenCheck className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-headline">Welcome to EduDesk</CardTitle>
        <CardDescription>Your Digital Education Hub. Select a role to continue.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button onClick={() => handleLogin('Admin')} size="lg" className="w-full">
          Login as Admin
        </Button>
        <Button onClick={() => handleLogin('Teacher')} size="lg" className="w-full">
          Login as Teacher
        </Button>
        <Button onClick={() => handleLogin('Student')} size="lg" className="w-full">
          Login as Student
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-center text-xs text-muted-foreground">
          This is a demo application. No real authentication is performed.
        </p>
      </CardFooter>
    </Card>
  );
}
