import {createNavigation} from 'next-intl/navigation';
import { locales } from '../i18n';

export const localePrefix = 'always';
 
export const pathnames = {
  '/': '/',
} satisfies Record<string, any>;
 
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation({locales, localePrefix, pathnames});