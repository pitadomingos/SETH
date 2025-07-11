
'use client';

import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { cn } from '@/lib/utils';
import './globals.css';
import { SchoolDataProvider } from '@/context/school-data-context';
import { Loader2 } from 'lucide-react';

// export const metadata: Metadata = {
//   title: 'EduManage',
//   description: 'School Management System',
// };

function AppProviders({ children }: { children: React.ReactNode }) {
    const { isLoading, user } = useAuth();

    if (isLoading) {
        return (
             <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <SchoolDataProvider authUser={user}>
            {children}
            <Toaster />
        </SchoolDataProvider>
    )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
            <AuthProvider>
                <AppProviders>
                    {children}
                </AppProviders>
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
