import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import i18nConfig from '../i18n';

export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard'
};

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales: i18nConfig.locales,
    pathnames,
    localePrefix: 'as-needed'
  });
