import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'pt'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
      // Handle invalid locale, maybe redirect or use a default
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
