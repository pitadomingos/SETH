
'use client';

import { useEffect } from 'react';
import { redirect } from '@/navigation';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';
import { defaultLocale } from '@/navigation';

export default function RootPage() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // This now correctly uses the locale-aware redirect
    redirect('/');
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
