import {getRequestConfig, GetRequestConfigParams} from 'next-intl/server';
import {notFound} from 'next/navigation';

export const locales = ['en', 'pt'];
export const defaultLocale = 'pt'; // Corrected default locale

export default getRequestConfig(async ({locale}: GetRequestConfigParams) => { // Explicit parameter typing
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  let messages;
  if (locale === 'en') {
    messages = (await import('./src/messages/en.json')).default; // Corrected import path
  } else if (locale === 'pt') {
    messages = (await import('./src/messages/pt.json')).default; // Corrected import path
  } else {
      // Fallback to default locale messages if locale is valid but not explicitly handled
      messages = (await import(`./src/messages/${defaultLocale}.json`)).default; // Corrected import path
  }


  return {
    locale: locale as string, // Explicitly return locale
    messages
  };
});
