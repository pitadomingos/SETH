import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextResponse } from 'next/server';

console.log('Value of locales in middleware:', locales);

try {
  const intlMiddleware = createMiddleware({
    locales: [...locales],
    defaultLocale,
    localePrefix: 'always'
  });

  // Export a single default middleware function that handles errors
  export default async function middleware(request) { // Line 12 - Red line here?
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

} catch (error) {
  // This catch block should not be needed with the refactored structure
  console.error('Unexpected error in middleware:', error);
}


export const config = {
  matcher: [
    '/((?!_next|api|.*\\..*).*)'
  ]
};
