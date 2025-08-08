import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/layout/app-providers';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { NextIntlClientProvider } from 'next-intl';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

// Note: This layout is crucial for i18n providers and root HTML structure
// It does not use getMessages or setRequestLocale because that is handled
// in the [locale] layout.
export default function RootLayout({ children, params }: Props) {
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AppProviders>
            {children}
            <Toaster />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
