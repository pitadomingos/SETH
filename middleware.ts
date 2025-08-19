import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // Pass all request headers to the middleware
  const requestHeaders = new Headers(request.headers);

  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
    // localePrefix: 'always', // Removed for better production compatibility
  });
  
  const response = handleI18nRouting(request);
  
  // Add the headers to the response
  requestHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(pt|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
