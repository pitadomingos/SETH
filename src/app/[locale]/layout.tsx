import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../../../i18n';
import { AppProviders } from '@/components/layout/app-providers';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error("Could not load messages for locale:", locale, error);
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProviders>
        {children}
      </AppProviders>
    </NextIntlClientProvider>
  );
}
