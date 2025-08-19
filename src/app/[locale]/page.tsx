'use client';

import { LoginForm } from '@/components/auth/login-form';
import { ThemeProvider } from '@/components/layout/theme-provider';

export default function LoginPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <LoginForm />
        </main>
    </ThemeProvider>
  );
}
