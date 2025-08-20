import { ReactNode } from 'react';
import { AppProviders } from '@/components/layout/app-providers';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {

  return (
    <html suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            {children}
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>