import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is a valid locale
  // and import the messages for the given locale
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});