import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import { locales, defaultLocale } from '../i18n';

export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard'
};

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    localePrefix: 'as-needed'
  });
