import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/layout/app-providers';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { I18nProviderClient } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'EduDesk',
  description: 'AI-Powered Multi-School Management System',
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn('font-body antialiased', 'min-h-screen bg-background')}
      >
        <I18nProviderClient locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppProviders>{children}</AppProviders>
            <Toaster />
          </ThemeProvider>
        </I18nProviderClient>
      </body>
    </html>
  );
}
