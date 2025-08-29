
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SchoolDataProvider, useSchoolData } from '@/context/school-data-context';
import { Baby, Briefcase, GraduationCap, Lightbulb, Loader2, Mail, MapPin, Phone, Rocket, School, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function PublicHomePage() {
  const { allSchoolData, isLoading } = useSchoolData();

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // Assuming 'northwood' is the master record for corporate/website info
  const websiteContent = allSchoolData?.['northwood']?.profile;
  const teamMembers = websiteContent?.teamMembers || [];
  const partnerSchools = websiteContent?.partnerSchools || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
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

        <section className="w-full py-12 md:py-24 lg:py-32" id="overview">
            <div className="container px-4 md:px-6">
                 <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl"><Rocket /> Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>The landscape of education in Mozambique and the broader Southern African region is at a critical inflection point. While rich in potential, it faces significant challenges related to administrative efficiency, resource allocation, and data-driven decision-making. EduDesk is a comprehensive, multi-tenant SaaS platform engineered not just to manage schools, but to transform them. By integrating a suite of powerful, AI-driven tools into a single, accessible system, EduDesk will empower educators, engage parents, and provide administrators with the insights needed to elevate educational standards.</p>
                        <p>Our prototype has successfully validated the core thesis: that a unified, intelligent platform can drastically reduce administrative overhead and unlock a new level of academic oversight. We are now seeking seed funding to transition from our robust prototype to a production-ready Firebase backend, enabling us to launch in Mozambique and subsequently scale across the SADC region. This investment will fuel a sustainable business model designed for long-term social impact, making modern educational tools accessible and affordable.</p>
                    </CardContent>
                </Card>
            </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/20" id="vision">
            <div className="container space-y-12 px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Lifelong Learning Ecosystem</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            From the first day of pre-school to university graduation and beyond.
                        </p>
                    </div>
                </div>
                 <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background">
                        <Baby className="h-10 w-10 text-primary mb-3"/>
                        <h4 className="font-semibold">EduDesk Pre-School</h4>
                        <p className="text-sm text-muted-foreground mt-1">Focusing on developmental milestones, play-based learning, and parent communication.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background">
                        <School className="h-10 w-10 text-primary mb-3"/>
                        <h4 className="font-semibold">EduDesk K-12 (Core)</h4>
                        <p className="text-sm text-muted-foreground mt-1">Our current platform, perfecting the management of curriculum-based education, assessments, and school operations.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background">
                        <Briefcase className="h-10 w-10 text-primary mb-3"/>
                        <h4 className="font-semibold">EduDesk University & Careers</h4>
                        <p className="text-sm text-muted-foreground mt-1">Bridging the gap to employment by connecting verified graduates with recruiters.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="team" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Meet Our Team</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The passionate individuals driving the future of education.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              {teamMembers.map((member) => (
                <Card key={member.name}>
                  <CardContent className="flex flex-col items-center space-y-4 pt-6">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint="person photo"/>
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-lg font-bold">{member.name}</h3>
                      <p className="text-primary">{member.role}</p>
                      <p className="text-sm text-muted-foreground mt-2">{member.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
         <section id="partners" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Partner Schools</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We are proud to work with these fine institutions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 sm:grid-cols-3 md:grid-cols-4 lg:gap-8">
              {partnerSchools.map((school) => (
                 <div key={school.name} className="flex flex-col items-center justify-center space-y-2">
                    <Image src={school.logoUrl} alt={school.name} width={100} height={100} className="rounded-lg object-contain" data-ai-hint="school logo"/>
                    <span className="text-sm font-medium">{school.name}</span>
                </div>
              ))}
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


export default function LandingPageWrapper() {
    return (
        <SchoolDataProvider>
            <PublicHomePage />
        </SchoolDataProvider>
    );
}
