
import createMiddleware from 'next-intl/middleware';
import {locales, localePrefix} from './src/navigation';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales,
  localePrefix,
 
  // Used when no locale matches
  defaultLocale: 'pt'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(pt|en)/:path*']
};
