import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n'; // Make sure this is correct!
import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest for typing

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  try {
    return intlMiddleware(request);
  } catch (error) {
    console.error('Error in next-intl middleware:', error);
    return new NextResponse('Internal Server Error in Middleware', { status: 500 });
  }
}

export const config = {
  matcher: [
    '/((?!_next|api|.*\\..*).*)'
  ]
};