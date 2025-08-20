import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';

type Props = {
  children: ReactNode;
};

// The root layout is language-agnostic
export default function RootLayout({ children }: Props) {
  return children;
}
