import { ReactNode } from 'react';
import { AppProviders } from '@/components/layout/app-providers';
import { Toaster } from '@/components/ui/toaster';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

// This is the root layout, and it does not have access to the locale.
// It should be language-agnostic.
export default function RootLayout({ children, params: { locale } }: Props) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
