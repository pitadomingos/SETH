import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextRequest } from 'next/server';
 
export async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale
});

  console.log('Incoming request URL:', request.url);

  const response = handleI18nRouting(request);

  console.log('Middleware processed request. Rewritten URL (if any):', response.headers.get('x-middleware-rewrite'));

  return response;
}
export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!_next|api|.*\\..*).*)']
};