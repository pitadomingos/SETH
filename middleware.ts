import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './i18n.config';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales,
  localePrefix,
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(pt|en)/:path*',

    // Enable redirects that add a locale prefix
    // (e.g. `/dashboard` -> `/en/dashboard`)
    '/((?!_next|.*\\..*).*)'
  ]
};
