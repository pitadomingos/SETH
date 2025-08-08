
import {getRequestConfig} from 'next-intl/server';
import {locales} from './src/navigation';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) return;
 
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
