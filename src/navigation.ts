import {
  createLocalizedPathnamesNavigation
} from 'next-intl/navigation';

export const locales = ['en', 'pt'];
export const pathnames = {};

// Use a dummy export to avoid breaking imports, but functionality is disabled.
// All links will fall back to default Next.js behavior.
export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, pathnames });
