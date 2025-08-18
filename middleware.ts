import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

console.log('Value of locales in middleware:', locales); // This line should be outside the object literal

export default createMiddleware({
  locales: [...locales], // This is the object literal being passed to createMiddleware
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: [
    '/((?!_next|api|.*\\..*).*)'
  ]
};
