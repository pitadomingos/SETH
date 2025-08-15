import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
 
export default createMiddleware({
  console.log('Locales in middleware:', locales);
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always'
});
 
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
