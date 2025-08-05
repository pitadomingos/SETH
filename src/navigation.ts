import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import {locales, localePrefix} from './i18n.config';

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard'
};

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    localePrefix,
    pathnames,
  });
