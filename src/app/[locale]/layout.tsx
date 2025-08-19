import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/layout/theme-provider';

type Props = {
  children: ReactNode;
};

export default function LocaleLayout({ children }: Props) {
  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        {children}
    </ThemeProvider>
  );
}
