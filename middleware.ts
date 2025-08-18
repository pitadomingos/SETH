import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextResponse } from 'next/server';

// Create the middleware
const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always'
});

// Export a single default middleware function that handles errors
export default async function middleware(request) {
  console.log('Value of locales in middleware:', locales); // Console log here

  try {
    // Call the next-intl middleware
    const response = await intlMiddleware(request);
    return response;

  } catch (error) {
    console.error('Error in next-intl middleware:', error); // Log the error

    // Return a 500 response if an error occurs
    return new NextResponse('Internal Server Error in Middleware', { status: 500 });
  }
}

export const config = {
  matcher: [
    '/((?!_next|api|.*\\..*).*)'
  ]
};
