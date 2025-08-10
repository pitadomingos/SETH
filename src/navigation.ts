import {createNavigation} from 'next-intl/navigation';
import { locales } from '../i18n';
 
export const localePrefix = 'always';
 
// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // If all locales use the same path, use
  // the usual string definition
  '/': '/',
  '/dashboard': '/dashboard',
};
 
export const {Link, redirect, usePathname, useRouter} =
  createNavigation({locales, localePrefix, pathnames});