'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ShieldCheck, HeartHandshake, Rocket, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto flex items-center justify-between py-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">EduDesk</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              The Future of School Management is Here
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              EduDesk is a unified, AI-powered platform designed to streamline operations, empower educators, and connect with parents like never before.
            </p>
            <div className="mt-6">
              <Button size="lg" asChild>
                <Link href="/register">
                  Register Your School Today <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything Your Institution Needs</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From AI-driven insights to seamless parent communication, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="grid gap-1">
                    <CardTitle className="flex items-center gap-2"><ShieldCheck/> For Administrators</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <p>Oversee all school operations, manage staff and students, track finances, and gain strategic insights with AI-powered reports.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="grid gap-1">
                    <CardTitle className="flex items-center gap-2"><Rocket/> For Teachers</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <p>Utilize AI to generate performance-aware lesson plans, create ad-hoc tests, manage grades, and communicate effectively with parents.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="grid gap-1">
                    <CardTitle className="flex items-center gap-2"><HeartHandshake/> For Parents</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <p>Stay connected with a unified view of all your children's progress, manage fees, and get AI-powered advice to support their academic journey.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-center py-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Pixel Digital Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
