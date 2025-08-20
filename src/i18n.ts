import {getRequestConfig} from 'next-intl/server';
 
// Can be imported from a shared config
export const locales = ['en', 'pt'];
export const defaultLocale = 'pt';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  // and fallback to the default locale if it's not.
  if (!locales.includes(locale as any)) {
    return {
      messages: (await import(`./messages/${defaultLocale}.json`)).default
    };
  }
 
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
