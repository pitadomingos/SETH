import { ReactNode } from 'react';
import { AppProviders } from '@/components/layout/app-providers';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Toaster } from '@/components/ui/toaster';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function RootLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            {children}
            <Toaster />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
