import createMiddleware from 'next-intl/middleware';
import {locales} from './navigation';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales,
 
  // Used when no locale matches
  defaultLocale: 'en',

  // The following properties are required for the App Router
  // A `localePrefix` is used on all paths except for the default locale
  localePrefix: 'as-needed',
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
