
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SchoolDataProvider, useSchoolData } from '@/context/school-data-context';
import { GraduationCap, Loader2, Rocket, School } from 'lucide-react';
import Link from 'next/link';

function PublicHomePage() {
  const { allSchoolData, isLoading } = useSchoolData();

  if (isLoading) {
    return <div className="flex h-[calc(100vh-128px)] w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const partnerSchools = allSchoolData?.['northwood']?.profile?.partnerSchools || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/20" id="home">
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
        
         <section id="partners" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Leading Institutions</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 sm:grid-cols-3 md:grid-cols-4 lg:gap-8">
              {partnerSchools.map((school) => (
                 <div key={school.name} className="flex flex-col items-center justify-center space-y-2">
                    <img src={school.logoUrl} alt={school.name} width={100} height={100} className="rounded-lg object-contain" />
                    <span className="text-sm font-medium">{school.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function HomePageWrapper() {
    return (
        <SchoolDataProvider>
            <PublicHomePage />
        </SchoolDataProvider>
    );
}
