import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default function middleware(request: any) {
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
