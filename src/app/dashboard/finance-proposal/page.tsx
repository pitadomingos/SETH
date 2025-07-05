
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Rocket, Lightbulb, Layers, Target, CalendarClock, DollarSign, BrainCircuit, Users, ShieldCheck, Gem, TrendingUp, BookCopy } from 'lucide-react';
import { useEffect } from 'react';

export default function ProjectProposalPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'GlobalAdmin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  return (
    <div className="space-y-8 animate-in fade-in-50">
      <header className="text-center">
        <h2 className="text-4xl font-bold tracking-tight text-primary">Project Proposal: EduManage</h2>
        <p className="text-xl text-muted-foreground mt-2">A Catalyst for Educational Transformation in Southern Africa</p>
      </header>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl"><Rocket /> Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <p>The landscape of education in Mozambique and the broader Southern African region is at a critical inflection point. While rich in potential, it faces significant challenges related to administrative efficiency, resource allocation, and data-driven decision-making. EduManage is a comprehensive, multi-tenant SaaS platform engineered not just to manage schools, but to transform them. By integrating a suite of powerful, AI-driven tools into a single, accessible system, EduManage will empower educators, engage parents, and provide administrators with the insights needed to elevate educational standards.</p>
            <p>Our prototype has successfully validated the core thesis: that a unified, intelligent platform can drastically reduce administrative overhead and unlock a new level of academic oversight. We are now seeking seed funding to transition from our robust prototype to a production-ready Firebase backend, enabling us to launch in Mozambique and subsequently scale across the SADC region. This investment will fuel a sustainable business model designed for long-term social impact, making modern educational tools accessible and affordable.</p>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb /> The Challenge & The Opportunity</CardTitle>
            <CardDescription>From Administrative Burden to Educational Focus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h3 className="font-semibold text-card-foreground">Current State: The Administrative Bottleneck</h3>
                <p className="text-sm text-muted-foreground mt-1">Many schools rely on manual, paper-based processes or a fragmented collection of outdated software. This results in critical data being siloed in disparate spreadsheets and physical files. Teachers spend valuable hours on administrative tasks instead of instructional planning, and school leaders lack the timely, aggregated data required for strategic decision-making. This inefficiency directly impacts the quality of education and hinders student progress.</p>
             </div>
             <div>
                <h3 className="font-semibold text-card-foreground">Our Solution: A Unified, Intelligent Ecosystem</h3>
                <p className="text-sm text-muted-foreground mt-1">EduManage replaces this disconnected patchwork with a single, cloud-native platform. Our key differentiator is the deep integration of AI to not just manage data, but to provide actionable insights—from performance-aware lesson planning for teachers to strategic system-wide analysis for administrators. By automating administrative tasks and providing clear, visual data, we free up educators to do what they do best: teach.</p>
             </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp /> How EduManage Elevates Standards</CardTitle>
            <CardDescription>Directly Addressing Key Educational Challenges</CardDescription>
          </CardHeader>
           <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <BrainCircuit className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Empowering Teachers with AI</h4>
                  <p className="text-muted-foreground">Instead of generic lesson plans, teachers can use our AI to generate plans tailored to their students' recent performance, ensuring no one is left behind. Ad-hoc tests can be created in minutes, not hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookCopy className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Enabling Data-Driven Leadership</h4>
                  <p className="text-muted-foreground">School administrators can move from guesswork to strategy. Our AI reports provide instant analysis of school-wide performance, class struggles, and teacher effectiveness, identifying areas for intervention and improvement.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Engaging Parents in Partnership</h4>
                  <p className="text-muted-foreground">The Parent Portal bridges the communication gap. Parents receive real-time updates on finances and can access AI-powered advice on how to support their child's specific academic needs, fostering a collaborative educational environment.</p>
                </div>
              </div>
           </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target /> Go-to-Market & Sustainable Monetization</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-card-foreground">Phased Regional Rollout</h3>
                <p className="text-sm text-muted-foreground">Our initial launch will target independent and semi-private schools in Mozambique. Success here will create a proven case study for expansion into neighboring countries like South Africa, Zimbabwe, and Botswana, adapting to local curricula and needs.</p>
             </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Flexible & Accessible Pricing</h3>
                <p className="text-sm text-muted-foreground">A tiered, annual subscription model (per student, billed in local currency) ensures predictable revenue and accessibility for institutions of all sizes:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                    <li><span className="font-semibold">Starter:</span> Core management features for emerging schools.</li>
                    <li><span className="font-semibold text-primary">Pro:</span> Adds advanced AI tools for established institutions.</li>
                    <li><span className="font-semibold text-teal-600 dark:text-teal-400">Premium:</span> Multi-school management for districts and groups.</li>
                </ul>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock /> Development Roadmap</CardTitle>
             <CardDescription>A clear timeline for moving from prototype to a scalable, production-ready application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">1</span>
              <div>
                <h4 className="font-semibold">Phase 1 (Q3 2025): Production Backend & Core Service</h4>
                <p className="text-sm text-muted-foreground">Transition from mock data to a full Firebase backend (Firestore, Auth, Storage). Refactor all services and establish robust security rules for a multi-tenant architecture.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">2</span>
              <div>
                <h4 className="font-semibold">Phase 2 (Q4 2025): Financial Integration & Automation</h4>
                <p className="text-sm text-muted-foreground">Integrate with regional payment gateways (e.g., M-Pesa, PayGate) for seamless fee collection. Implement automated invoicing, billing cycles, and payment reminders.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">3</span>
              <div>
                <h4 className="font-semibold">Phase 3 (Q1 2026): Pilot Program & Market Launch</h4>
                <p className="text-sm text-muted-foreground">Launch a pilot program with a select group of schools in Mozambique to gather feedback and refine features. Initiate targeted marketing campaigns for a full market launch.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign /> Funding Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
              <p>We are seeking $500,000 in seed funding. This capital will be strategically allocated to accelerate development, establish a local presence for sales and support, and ensure a successful market entry.</p>
              <ul className="list-disc pl-5 mt-2">
                  <li><span className="font-semibold">40%</span> - Engineering & Product Development (Firebase migration, mobile optimization)</li>
                  <li><span className="font-semibold">35%</span> - Sales & Marketing (Establish local team, build partnerships)</li>
                  <li><span className="font-semibold">15%</span> - Cloud Infrastructure & Operations</li>
                  <li><span className="font-semibold">10%</span> - Administrative & Contingency</li>
              </ul>
          </CardContent>
        </Card>
    </div>
  );
}

    