
import {createNavigation} from 'next-intl/navigation';
 
export const locales = ['pt', 'en'] as const;
export const localePrefix = 'always';
 
export const pathnames = {
  '/': '/',
} satisfies Record<string, any>;
 
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation({locales, localePrefix, pathnames});
