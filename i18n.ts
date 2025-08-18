import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales as allLocales} from './src/navigation';

// Can be imported from a shared config
export const locales = ['en', 'pt'];
export const defaultLocale = 'pt';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
 
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});