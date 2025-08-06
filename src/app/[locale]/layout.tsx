import { ReactNode } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
 
export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
 
  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
