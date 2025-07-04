
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Rocket, Lightbulb, Layers, Target, CalendarClock, DollarSign, BrainCircuit, Users, ShieldCheck, Gem } from 'lucide-react';
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
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Project Proposal: EduManage</h2>
        <p className="text-muted-foreground">An investment proposal for the development and launch of a next-generation school management system.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Rocket /> Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <p>EduManage is a comprehensive, multi-tenant SaaS platform designed to modernize school administration. By integrating AI-powered tools, role-based dashboards, and a full suite of management features, EduManage addresses the critical need for a unified, efficient, and intelligent solution for K-12 institutions.</p>
            <p>The current prototype has validated the core architecture and feature set, demonstrating significant value for administrators, teachers, students, and parents. We are seeking seed funding to accelerate the transition to a production-ready Firebase backend, implement key monetization features like payment gateways, and scale our marketing and sales efforts to capture the underserved market of independent and small-to-medium-sized school districts.</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb /> The Opportunity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <h3 className="font-semibold text-card-foreground">The Problem</h3>
                <p className="text-sm text-muted-foreground">Many educational institutions are encumbered by outdated, fragmented software systems. They often rely on a patchwork of disconnected tools for admissions, grading, finance, and communication, leading to data silos, administrative inefficiency, and a disjointed experience for staff, students, and parents.</p>
             </div>
             <div>
                <h3 className="font-semibold text-card-foreground">Our Solution</h3>
                <p className="text-sm text-muted-foreground">EduManage provides a single, cloud-native platform that unifies all aspects of school management. Our key differentiator is the deep integration of AI to not just manage data, but to provide actionable insights—from performance-aware lesson planning for teachers to strategic system-wide analysis for administrators.</p>
             </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers /> Product & Features</CardTitle>
          </CardHeader>
           <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary"/><span>Role-Based Dashboards & Multi-Tenancy</span></p>
              <p className="flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-primary"/><span>AI-Powered Lesson Planning & Test Generation</span></p>
              <p className="flex items-center gap-2"><Users className="h-4 w-4 text-primary"/><span>Comprehensive User & Course Management</span></p>
              <p className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary"/><span>Integrated Finance & Expense Tracking</span></p>
           </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target /> Go-to-Market & Monetization</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-card-foreground">Target Market</h3>
                <p className="text-sm text-muted-foreground">Our primary market consists of independent K-12 schools and small-to-medium school districts (2-10 schools) that are large enough to require a professional solution but are underserved by complex, enterprise-level ERPs.</p>
             </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Monetization Strategy</h3>
                <p className="text-sm text-muted-foreground">A tiered, annual subscription model (per student) ensures predictable revenue:</p>
                <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold">Starter:</span> Core management features for small schools.</li>
                    <li><span className="font-semibold text-primary">Pro:</span> Adds advanced AI tools and integrations for growing institutions.</li>
                    <li><span className="font-semibold text-premium">Premium:</span> Multi-school management, custom branding, and dedicated support for districts.</li>
                </ul>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock /> Roadmap & Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">1</span>
              <div>
                <h4 className="font-semibold">Phase 1 (Q3 2025): Production Backend & Core Service</h4>
                <p className="text-sm text-muted-foreground">Migrate from mock data to a full Firebase backend (Auth, Firestore, Storage). Refactor all services to be production-ready.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">2</span>
              <div>
                <h4 className="font-semibold">Phase 2 (Q4 2025): Monetization & Automation</h4>
                <p className="text-sm text-muted-foreground">Integrate with Stripe for online payments. Implement automated invoicing, billing cycles, and payment reminders.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">3</span>
              <div>
                <h4 className="font-semibold">Phase 3 (Q1 2026): Market Launch & Customer Acquisition</h4>
                <p className="text-sm text-muted-foreground">Launch targeted digital marketing campaigns. Onboard the first cohort of paying schools and gather feedback for iterative improvement.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign /> Funding Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
              <p>We are seeking $500,000 in seed funding. These funds will be allocated to accelerate development, build out our marketing and sales infrastructure, and expand the engineering team to meet our aggressive roadmap targets.</p>
              <ul className="list-disc pl-5 mt-2">
                  <li><span className="font-semibold">40%</span> - Engineering & Product Development</li>
                  <li><span className="font-semibold">35%</span> - Sales & Marketing</li>
                  <li><span className="font-semibold">15%</span> - Cloud Infrastructure & Operations</li>
                  <li><span className="font-semibold">10%</span> - Administrative & Contingency</li>
              </ul>
          </CardContent>
        </Card>
    </div>
  );
}
