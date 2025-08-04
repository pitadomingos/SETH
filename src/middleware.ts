import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './i18n.config';
 
export default createMiddleware({
  defaultLocale: 'en',
  locales,
  localePrefix
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
