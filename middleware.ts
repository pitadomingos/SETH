import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  // Use the locale list and default (from your i18n.ts)
  locales,
  defaultLocale,
  localePrefix: 'always', // All routes require a locale prefix, e.g. /en/dashboard
});

export default function middleware(request) {
  try {
    // Call next-intl middleware to handle locale routing
    return intlMiddleware(request);
  } catch (error) {
    // Log and return a 500 error response if something goes wrong
    console.error('Error in next-intl middleware:', error);
    return new NextResponse('Internal Server Error in Middleware', { status: 500 });
  }
}

// This matcher applies middleware to all pages except static, API, and internal Next.js routes
export const config = {
  matcher: [
    '/((?!_next|api|.*\\..*).*)'
  ]
};