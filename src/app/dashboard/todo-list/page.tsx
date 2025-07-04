
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const completedTasks = [
  'Activated the Settings page for school-wide configuration (e.g., grading system).',
  'Added a comparative performance chart to the developer dashboard to analyze subscription tiers.',
  'Added AI-powered analysis and guidance for students who have not met graduation requirements.',
  'AI-powered, ad-hoc Test Generator for teachers',
  'AI-powered Lesson Planner for Teachers with auto-saving.',
  'Automated student enrollment from the Admissions module, removing manual creation.',
  'Centralized system data management (Fee Descriptions, Event Audiences, Currency, Calendar) in the Admin Panel.',
  'Comprehensive admissions workflow from parent application to admin approval.',
  'Comprehensive, subject-specific Gradebook for teachers with dual (letter & numeric) grading support',
  'Created a system-wide AI analysis tool for developers to get strategic insights across the school network.',
  'Developed an AI-powered academic reports suite for Admins, including analysis for schools, classes, struggling students, and teacher performance.',
  'Dynamic Parent Portal with multi-child support, AI-powered advice, fee tracking, and new child applications.',
  'Enabled interactive profile and picture updates on the Profile page.',
  'Enhanced the Sports page with dynamic team and competition management.',
  'Global Admin dashboard for viewing all schools and managing their status.',
  'Implemented Academics, Examinations, and Attendance pages.',
  'Implemented academically and financially-gated student certificate and transcript downloads on the Student Dashboard.',
  'Multi-school simulation with dynamic data loading based on user role.',
  'Personalized leaderboards view for parents and school-wide view for staff',
  'Personalized login loading screen with school and user details',
  'Project Proposal page for developers outlining vision, roadmap, and funding needs.',
  'Role-based dashboards and side navigation',
  'School status management (Active, Suspended, Inactive) for system owners.',
  'School-wide currency configuration (USD, ZAR, MZN) for financial management.',
  'Upgraded Events page with an interactive calendar and event creation for admins.',
  'Upgraded Finance module with partial payments, ad-hoc transaction creation, expense tracking, and multi-currency support.',
  'User authentication with roles (Global Admin, Admin, Teacher, Student, Parent)',
];

const upcomingFeatures = [
  'Build out student online test-taking, auto-grading, and result-publishing based on the AI Test Generator',
  'Develop a dedicated "Finance Proposal" page detailing payment gateway integration, automated invoicing, and billing cycles.',
  'Implement full CRUD (Create, Read, Update, Delete) on all management pages',
  'Connect mock data to a real database (e.g., Firestore) to enable persistence',
  'Implement a site-wide notification and communication hub',
  'Enable profile editing with photo uploads for all users',
  'Introduce student-centric features like goal setting and digital portfolios',
  'Develop district, provincial, and national data views for higher-level administration',
  'Enhance mobile-first responsive design for a seamless experience on phones and tablets',
  'Plan and scope development for native Android and iOS applications',
];

export default function TodoListPage() {
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
        <h2 className="text-3xl font-bold tracking-tight">Project Progress & To-Do List</h2>
        <p className="text-muted-foreground">A tracker for what's done and what's next for the EduManage app.</p>
      </header>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="text-green-500" />Completed Tasks</CardTitle>
            <CardDescription>Features that have been implemented so far.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {completedTasks.sort().map((task, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{task}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="text-amber-500" />Upcoming Features</CardTitle>
            <CardDescription>The next set of features to be developed.</CardDescription>
          </CardHeader>
          <CardContent>
             <ul className="space-y-3">
              {upcomingFeatures.sort().map((task, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Circle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{task}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
