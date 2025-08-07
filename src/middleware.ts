import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, pathnames } from './navigation';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
 
  // Used when no locale matches
  defaultLocale,

  // Use the default pathnames configuration
  pathnames
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(pt|en)/:path*']
};
