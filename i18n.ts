import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['pt', 'en'];
export const defaultLocale = 'pt';
 
export default getRequestConfig(async ({locale}) => {
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
