'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { LoginForm } from '@/components/auth/login-form';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role) {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || (!isLoading && role)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <LoginForm />
    </main>
  );
}
