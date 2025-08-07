import createMiddleware from 'next-intl/middleware';
import {locales, localePrefix, defaultLocale} from './navigation';
 
export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(pt|en)/:path*']
};