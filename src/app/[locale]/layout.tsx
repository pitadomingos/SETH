import { setRequestLocale } from 'next-intl/server';
import { locales } from '../../../i18n';
 
export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default function LocaleLayout({
  children,
  params: {locale},
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  setRequestLocale(locale);
 
  return (
    <>
      {children}
    </>
  );
}
