
import {createNavigation} from 'next-intl/navigation';

export const locales = ['pt', 'en'] as const;
export const defaultLocale = 'pt';
export const localePrefix = 'always'; // Default

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // If all locales use the same path, use
  // the special `/` path.
  '/': '/',
  '/dashboard': '/dashboard',

  // If locales use different paths, specify
  // them separately for each locale.
  '/about': {
    en: '/about',
    pt: '/sobre'
  },
};

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation({
    locales,
    localePrefix,
    pathnames: pathnames as typeof pathnames & Record<string & {}, any>
  });
