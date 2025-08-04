import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from "@/components/layout/app-providers";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EduDesk",
  description: "AI-Powered Multi-School Management Prototype",
};

export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = await getMessages();
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AppProviders locale={locale} messages={messages}>
              {children}
            </AppProviders>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
