import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'pt'];
export const defaultLocale = 'pt';
 
export default getRequestConfig(async ({locale}) => {
  // Provide a static fallback in case the locale is not found
  if (!locales.includes(locale as any)) {
      const {notFound} = await import('next/navigation');
      notFound();
  }
 
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
