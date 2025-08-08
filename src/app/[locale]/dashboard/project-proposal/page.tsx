
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter } from '@/navigation';
import { GraduationCap, TrendingUp, Users, Presentation, HeartHandshake, ShieldCheck, Gem, Star, CheckCircle, Mail, BarChart, Rocket } from 'lucide-react';

function FeatureListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
      <span className="text-muted-foreground">{children}</span>
    </li>
  );
}

export default function ProjectProposalPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleContact = () => {
    sessionStorage.setItem('prefillMessage', JSON.stringify({
        subject: `EduDesk Partnership Inquiry from ${user?.name}`,
        body: `Hello,\n\nOur institution is interested in learning more about the EduDesk platform. We would like to schedule a personalized demo to see how it can benefit our school.\n\nPlease let us know the next available steps.\n\nThank you,\n${user?.name}`
    }));
    router.push('/dashboard/messaging');
  };


  return (
    <div className="bg-background text-foreground animate-in fade-in-50">
      <main className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
        {/* --- Hero Section --- */}
        <section className="text-center">
          <div className="mx-auto mb-6 inline-block rounded-full bg-primary/10 p-4">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Transforming Education, Together.</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            EduDesk is an all-in-one, AI-powered School Management System designed for the unique challenges of modern educational institutions in Southern Africa. We replace administrative burdens with intelligent automation, empowering you to focus on what truly matters: student success.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" onClick={handleContact}>
                <Mail className="mr-2 h-5 w-5" /> Request a Demo
            </Button>
          </div>
        </section>

        {/* --- The Challenge & Solution --- */}
        <section className="mt-24 grid gap-12 md:grid-cols-2">
            <div className="space-y-4">
                <h2 className="flex items-center gap-3 text-3xl font-bold"><TrendingUp className="h-8 w-8 text-destructive" /> The Challenge: A Fragmented System</h2>
                <p className="text-muted-foreground">Schools often struggle with disconnected software, manual data entry, and paper-based processes. This creates data silos, consumes valuable teacher time, and prevents administrators from getting a clear, real-time view of school performance.</p>
            </div>
             <div className="space-y-4">
                <h2 className="flex items-center gap-3 text-3xl font-bold"><Rocket className="h-8 w-8 text-primary" /> The Solution: A Unified Ecosystem</h2>
                <p className="text-muted-foreground">EduDesk integrates every aspect of school management into a single, intuitive platform. From admissions and finance to academics and parent communication, our AI-driven tools provide actionable insights and streamline daily operations for every user.</p>
            </div>
        </section>

        {/* --- For Everyone Section --- */}
        <section className="mt-24">
            <div className="text-center">
                <h2 className="text-4xl font-bold">A Platform for Your Entire School Community</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    EduDesk is designed with tailored dashboards and tools for every role within your institution.
                </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <Presentation className="h-10 w-10 text-primary mb-4" />
                        <CardTitle>For Teachers</CardTitle>
                        <CardDescription>Reduce administrative workload and focus on teaching.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <FeatureListItem>AI-powered lesson planning and test generation.</FeatureListItem>
                            <FeatureListItem>Automated grading and performance analytics.</FeatureListItem>
                            <FeatureListItem>Simplified attendance and behavioral tracking.</FeatureListItem>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Users className="h-10 w-10 text-primary mb-4" />
                        <CardTitle>For Administrators</CardTitle>
                        <CardDescription>Gain a 360-degree view of your school's operations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <FeatureListItem>Streamlined admissions and enrollment.</FeatureListItem>
                            <FeatureListItem>Comprehensive financial management and reporting.</FeatureListItem>
                            <FeatureListItem>AI-driven reports on school-wide performance.</FeatureListItem>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <HeartHandshake className="h-10 w-10 text-primary mb-4" />
                        <CardTitle>For Parents & Students</CardTitle>
                        <CardDescription>Foster engagement and empower self-management.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <FeatureListItem>Unified portal for tracking progress and fees.</FeatureListItem>
                            <FeatureListItem>AI-powered advice and academic support for students.</FeatureListItem>
                            <FeatureListItem>Access to schedules, grades, and school events.</FeatureListItem>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>

        {/* --- Subscription Tiers Section --- */}
        <section className="mt-24">
           <div className="text-center">
                <h2 className="text-4xl font-bold">Flexible Plans for Every Institution</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    Choose the plan that best fits your school's size and ambition. All plans include core management modules.
                </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
                {/* Starter Plan */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <Star className="h-8 w-8 mb-4"/>
                        <CardTitle>Starter</CardTitle>
                        <CardDescription>Essential tools for small schools to get organized and improve communication.</CardDescription>
                         <p className="text-3xl font-bold pt-4">Contact for Pricing</p>
                    </CardHeader>
                    <CardContent className="flex-1">
                       <ul className="space-y-3">
                            <FeatureListItem>Student, Teacher & Class Management</FeatureListItem>
                            <FeatureListItem>Basic Finance & Invoicing</FeatureListItem>
                            <FeatureListItem>Event Calendars & Announcements</FeatureListItem>
                            <FeatureListItem>Role-Based Dashboards</FeatureListItem>
                        </ul>
                    </CardContent>
                </Card>

                {/* Pro Plan */}
                 <Card className="flex flex-col border-primary shadow-2xl">
                    <CardHeader>
                        <ShieldCheck className="h-8 w-8 mb-4 text-primary"/>
                        <CardTitle>Pro Plan</CardTitle>
                        <CardDescription>Unlock powerful AI tools to drive academic excellence and efficiency.</CardDescription>
                        <p className="text-3xl font-bold pt-4">Contact for Pricing</p>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-3">
                            <FeatureListItem><strong>Everything in Starter, plus:</strong></FeatureListItem>
                            <FeatureListItem>AI Lesson Planner & Test Generator</FeatureListItem>
                            <FeatureListItem>AI-Powered Performance Reports</FeatureListItem>
                            <FeatureListItem>Full Admissions & Enrollment Module</FeatureListItem>
                            <FeatureListItem>Advanced Financial Analytics</FeatureListItem>
                        </ul>
                    </CardContent>
                </Card>

                {/* Premium Plan */}
                 <Card className="flex flex-col">
                    <CardHeader>
                        <Gem className="h-8 w-8 mb-4"/>
                        <CardTitle>Premium</CardTitle>
                        <CardDescription>The ultimate solution for school groups and districts requiring centralized management.</CardDescription>
                        <p className="text-3xl font-bold pt-4">Contact for Pricing</p>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-3">
                            <FeatureListItem><strong>Everything in Pro, plus:</strong></FeatureListItem>
                            <FeatureListItem>Multi-School Management Dashboard</FeatureListItem>
                            <FeatureListItem>Consolidated Group-Level Reporting</FeatureListItem>
                            <FeatureListItem>System-Wide AI Analysis Tools</FeatureListItem>
                            <FeatureListItem>Dedicated Support & Onboarding</FeatureListItem>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>

        {/* --- Call to Action --- */}
        <section className="mt-24 rounded-lg bg-muted p-12 text-center">
            <h2 className="text-4xl font-bold">Ready to Elevate Your School?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Let's start a conversation. Schedule a free, no-obligation demo to see how EduDesk can be tailored to the specific needs of your institution.
            </p>
            <div className="mt-8">
                <Button size="lg" onClick={handleContact}>
                    <Mail className="mr-2 h-5 w-5" /> Schedule Your Personalized Demo
                </Button>
            </div>
        </section>
      </main>
    </div>
  );
}
