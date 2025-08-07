import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from "@/components/layout/app-providers";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { locales } from '../../../i18n';
 
export default async function LocaleLayout({
  children,
  params: {locale},
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    // Redirect or show a 404 page if the locale is not supported
    // For simplicity, we'll just log an error here in a real app you might redirect
    console.error(`Unsupported locale: ${locale}`);
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  
  setRequestLocale(locale);
 
  return (
    <html lang={locale}>
        <body>
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
