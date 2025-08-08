import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'pt'];
export const defaultLocale = 'pt';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
      // Handle not found case if you need to
  }
 
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});