import { useTranslations } from 'next-intl';
import { redirect } from '@/navigation';

export default function LocaleIndexPage() {
  // This page is caught by the root redirect in `src/app/page.tsx`,
  // but as a fallback, we'll redirect again.
  redirect('/dashboard');
}
