'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, CreditCard, PieChart, Banknote, Briefcase, FileSignature, CloudCog } from 'lucide-react';
import { useEffect } from 'react';

export default function FinanceProposalPage() {
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
        <h2 className="text-3xl font-bold tracking-tight">Finance Module Development Proposal</h2>
        <p className="text-muted-foreground">A strategic roadmap for building a comprehensive financial management system for EduManage.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DollarSign /> Vision & Current State</CardTitle>
          <CardDescription>Our goal is to evolve the current finance tools into a full-featured, automated financial management suite that provides schools with clarity, control, and efficiency.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Current Capabilities:</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Ad-hoc fee creation and student assignment.</li>
                <li>Manual recording of full or partial payments.</li>
                <li>Tracking of basic school expenses with proof upload.</li>
                <li>A high-level dashboard displaying total revenue, pending, and overdue fees.</li>
                <li>Separate finance portals for Admin and Parent roles.</li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold">Limitations:</h3>
              <p className="text-sm text-muted-foreground">The current system is heavily manual, lacks automation, and cannot support complex financial operations like automated billing, online payments, or detailed reporting.</p>
            </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold tracking-tight">Development Roadmap</h3>
        
        {/* Phase 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">1</span>Phase 1: Core Financial Operations</CardTitle>
            <CardDescription>Establishing a robust foundation for billing and payments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <CreditCard className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Payment Gateway Integration (Stripe/PayPal)</h4>
                <p className="text-sm text-muted-foreground">Allow parents to pay fees online directly through the portal, with automated payment recording.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <FileSignature className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Automated Invoicing & Reminders</h4>
                <p className="text-sm text-muted-foreground">Automatically generate invoices for recurring fees (e.g., tuition) and send automated email reminders for upcoming or overdue payments.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <Banknote className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Configurable Fee Structures</h4>
                <p className="text-sm text-muted-foreground">Enable admins to create complex fee structures (e.g., tuition, bus fees, meal plans) with different amounts per grade or class, and apply them in bulk to students.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">2</span>Phase 2: Advanced Reporting & Budgeting</CardTitle>
            <CardDescription>Providing deep financial insights for strategic decision-making.</CardDescription>
          </CardHeader>
           <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <PieChart className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Advanced Financial Reporting</h4>
                <p className="text-sm text-muted-foreground">Generate detailed reports like Profit & Loss, Balance Sheets, and cash flow statements. Allow filtering by date range and category.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <Briefcase className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Budgeting & Forecasting</h4>
                <p className="text-sm text-muted-foreground">Create school budgets, track actual spending against the budget in real-time, and use historical data to forecast future financial performance.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 3 */}
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">3</span>Phase 3: Integration & Automation</CardTitle>
            <CardDescription>Connecting EduManage to the broader financial ecosystem.</CardDescription>
          </CardHeader>
           <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <CloudCog className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Accounting Software Integration (QuickBooks, Xero)</h4>
                <p className="text-sm text-muted-foreground">Implement two-way sync with popular accounting platforms to eliminate manual data entry and ensure consistency.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <DollarSign className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Payroll Management</h4>
                <p className="text-sm text-muted-foreground">A dedicated module to manage teacher and staff salaries, deductions, and payment schedules, integrated with the main expense system.</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
