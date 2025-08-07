import {
  createNavigation
} from 'next-intl/navigation';

export const locales = ['pt', 'en'] as const;
export const localePrefix = 'always'; // Options: 'as-needed' | 'always' | 'never'
export const defaultLocale = 'pt';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales, localePrefix });
