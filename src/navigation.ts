
import {
  createNavigation
} from 'next-intl/navigation';

export const locales = ['pt', 'en'] as const;
export const localePrefix = 'always';
export const defaultLocale = 'pt' as const;

export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard',
} satisfies Record<string, string>;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({ locales, localePrefix });
