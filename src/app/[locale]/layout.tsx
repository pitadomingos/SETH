import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // Providing all messages to the client
  // side is a good default.
  const messages = await getMessages();
 
  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
