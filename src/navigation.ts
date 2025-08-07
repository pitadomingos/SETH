import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import { locales } from '../i18n';

export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard',
  '/dashboard/academics': '/dashboard/academics',
  '/dashboard/activity-logs': '/dashboard/activity-logs',
  '/dashboard/admissions': '/dashboard/admissions',
  '/dashboard/ai-testing': '/dashboard/ai-testing',
  '/dashboard/assets': '/dashboard/assets',
  '/dashboard/attendance': '/dashboard/attendance',
  '/dashboard/behavioral': '/dashboard/behavioral',
  '/dashboard/classes': '/dashboard/classes',
  '/dashboard/events': '/dashboard/events',
  '/dashboard/finance': '/dashboard/finance',
  '/dashboard/grading': '/dashboard/grading',
  '/dashboard/kiosk-showcase': '/dashboard/kiosk-showcase',
  '/dashboard/leaderboards': '/dashboard/leaderboards',
  '/dashboard/lesson-planner': '/dashboard/lesson-planner',
  '/dashboard/manage-schools': '/dashboard/manage-schools',
  '/dashboard/messaging': '/dashboard/messaging',
  '/dashboard/profile': '/dashboard/profile',
  '/dashboard/reports': '/dashboard/reports',
  '/dashboard/schedule': '/dashboard/schedule',
  '/dashboard/settings': '/dashboard/settings',
  '/dashboard/sports': '/dashboard/sports',
  '/dashboard/students': '/dashboard/students',
  '/dashboard/system-documentation': '/dashboard/system-documentation',
  '/dashboard/teachers': '/dashboard/teachers',
  '/dashboard/todo-list': '/dashboard/todo-list',
  '/dashboard/user-manual': '/dashboard/user-manual',
  '/dashboard/global-admin': '/dashboard/global-admin',
  '/dashboard/global-admin/all-schools': '/dashboard/global-admin/all-schools',
  '/dashboard/global-admin/awards': '/dashboard/global-admin/awards',
  '/dashboard/global-admin/finance': '/dashboard/global-admin/finance',
  '/dashboard/global-admin/inbox': '/dashboard/global-admin/inbox',
  '/dashboard/global-admin/parents': '/dashboard/global-admin/parents',
  '/dashboard/global-admin/settings': '/dashboard/global-admin/settings',
  '/dashboard/global-admin/students': '/dashboard/global-admin/students',
  '/dashboard/global-admin/teachers': '/dashboard/global-admin/teachers',
  '/dashboard/project-proposal': '/dashboard/project-proposal',
};

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    localePrefix: 'as-needed'
  });
