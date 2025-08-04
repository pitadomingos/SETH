import {createNavigation} from 'next-intl/navigation';
 
export const locales = ['en', 'pt'] as const;
 
export const {Link, redirect, usePathname, useRouter} =
  createNavigation({locales});