
'use client';

import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { SchoolDataProvider } from '@/context/school-data-context';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { cn } from '@/lib/utils';
import './globals.css';

// export const metadata: Metadata = {
//   title: 'EduManage',
//   description: 'School Management System',
// };

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
                <SchoolDataProvider>
                    {children}
                </SchoolDataProvider>
            </AuthProvider>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
