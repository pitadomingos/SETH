
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Rocket, School } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">EduDesk by Pixel Digital Solutions</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
          <Button asChild>
             <Link href="/register">Register</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    The Future of School Management is Here
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    EduDesk is a multi-tenant, AI-powered platform designed to streamline administration, empower teachers, and engage parents.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/register">Register Your School Today</Link>
                  </Button>
                   <Button asChild size="lg" variant="secondary">
                    <a href="https://studio--edudesk-h9avj.us-central1.hosted.app/" target="_blank" rel="noopener noreferrer">View Live Demo</a>
                  </Button>
                </div>
              </div>
               <Card className="shadow-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Rocket /> Key Features</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                    <div className="flex items-start gap-3"><School className="h-4 w-4 mt-1 text-primary" /><span>Multi-Tenant architecture for individual school management.</span></div>
                    <div className="flex items-start gap-3"><School className="h-4 w-4 mt-1 text-primary" /><span>AI-Powered lesson planning and performance analytics.</span></div>
                    <div className="flex items-start gap-3"><School className="h-4 w-4 mt-1 text-primary" /><span>Dedicated portals for Admins, Teachers, Students, and Parents.</span></div>
                    <div className="flex items-start gap-3"><School className="h-4 w-4 mt-1 text-primary" /><span>Comprehensive modules for finance, admissions, and more.</span></div>
                </CardContent>
               </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center py-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Pixel Digital Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
