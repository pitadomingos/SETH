import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'pt'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  // and import the messages for the given locale.
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});