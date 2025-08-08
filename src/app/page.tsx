'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { defaultLocale } from '@/i18n';

export default function RootPage() {

  useEffect(() => {
    redirect(`/${defaultLocale}`);
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
