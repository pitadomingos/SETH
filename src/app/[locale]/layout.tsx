'use client';

import { AppProviders } from '@/components/layout/app-providers';
import { I18nProviderClient } from '@/lib/i18n';
import { ReactNode } from 'react';

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <I18nProviderClient locale={locale}>
      <AppProviders>{children}</AppProviders>
    </I18nProviderClient>
  );
}
