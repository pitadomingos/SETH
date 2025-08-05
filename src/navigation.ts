import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import { locales } from '../i18n';

export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard'
};

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales: locales,
    pathnames,
    localePrefix: 'as-needed'
  });
