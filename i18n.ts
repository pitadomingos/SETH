import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ptMessages from './src/messages/pt.json';
import enMessages from './src/messages/en.json';

export const locales = ['en', 'pt'];
export const defaultLocale = 'pt';

export default getRequestConfig(async ({ locale }) => {
  if (locale === 'pt') return { messages: ptMessages };
  if (locale === 'en') return { messages: enMessages };
  notFound();
});
