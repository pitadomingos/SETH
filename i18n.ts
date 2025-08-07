import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['pt', 'en'];
export const defaultLocale = 'pt';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
      // Returning a 404 is not required, as the middleware will redirect.
      // However, it can be helpful for debugging.
      // notFound();
  }
 
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
