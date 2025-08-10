import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
 
export const locales = ['pt', 'en'];
export const defaultLocale = 'pt';
 
export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();
 
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});