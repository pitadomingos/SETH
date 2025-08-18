import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextResponse } from 'next/server';

console.log('Value of locales in middleware:', locales);

try {
  const middleware = createMiddleware({
    locales: [...locales],
    defaultLocale,
    localePrefix: 'always'
  });

  export default middleware;

} catch (error) {
  console.error('Error in next-intl middleware:', error);

  export default function errorMiddleware() {
    return new NextResponse('Internal Server Error in Middleware', { status: 500 });
  }
}

export const config = {
  matcher: [
    '/((?!_next|api|.*\\..*).*)'
  ]
};
