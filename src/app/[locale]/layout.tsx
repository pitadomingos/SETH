import {ReactNode} from 'react';
import {NextIntlClientProvider, createTranslator} from 'next-intl';
import {getMessages, unstable_setRequestLocale} from 'next-intl/server';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from "@/components/layout/app-providers";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { locales } from '@/navigation';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params: {locale}}: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AppProviders>
              {children}
            </AppProviders>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
