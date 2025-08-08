
import {
  createNavigation
} from 'next-intl/navigation';
import {locales as allLocales} from '@/i18n';

export const locales = allLocales;
export const localePrefix = 'always';
export const defaultLocale = 'pt' as const;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({ locales, localePrefix });
