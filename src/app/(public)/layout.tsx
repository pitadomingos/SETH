
'use client';
import { Button } from '@/components/ui/button';
import { SchoolDataProvider } from '@/context/school-data-context';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SchoolDataProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
          <Link href="/" className="flex items-center justify-center" prefetch={false}>
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold">EduDesk</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>About Us</Link>
            <Link href="/vision" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Our Vision</Link>
            <Link href="/team" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Our Team</Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Contact</Link>
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              Login
            </Link>
            <Button asChild>
               <Link href="/register">Register</Link>
            </Button>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
            <p className="text-xs text-muted-foreground">&copy; 2024 Pixel Digital Solutions. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>Twitter</Link>
                <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>Facebook</Link>
                <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>LinkedIn</Link>
            </nav>
        </footer>
      </div>
    </SchoolDataProvider>
  );
}
