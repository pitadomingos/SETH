
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, Loader2, Download } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const completedTasks = [
  'AI Test Generator for teachers with a save/deploy workflow.',
  'AI-powered Lesson Planner for Teachers with auto-saving.',
  'AI-powered academic reports suite for Admins (School, Class, Struggling Students, Teacher performance).',
  'AI-powered analysis and guidance for students who have not met graduation requirements.',
  'AI-powered test grading flow that calculates scores and updates student records.',
  'Automated student enrollment from the Admissions module.',
  'Centralized system data management (Fee Descriptions, Event Audiences, etc.) in the Admin Panel.',
  'Comprehensive admissions workflow from parent application to admin approval.',
  'Comprehensive, subject-specific Gradebook for teachers.',
  'Created a system-wide AI analysis tool for developers to get strategic insights.',
  'Dedicated management pages for Global Admins to oversee all students and parents.',
  'Dynamic Parent Portal with multi-child support, AI-powered advice, and fee tracking.',
  'Enabled interactive profile and picture updates on the Profile page.',
  'Enhanced the Sports page with dynamic team and competition management.',
  'Global Admin dashboard for viewing all schools and managing their status.',
  'Implemented Academics, Examinations, and Attendance pages.',
  'Implemented academically and financially-gated student certificate and transcript downloads.',
  'Implemented grade-level capacity management and vacancy display on application forms.',
  'Multi-school simulation with dynamic data loading based on user role.',
  'Personalized leaderboards view for parents and school-wide view for staff.',
  'Personalized login loading screen with school and user details.',
  'Project Proposal page for developers outlining vision, roadmap, and funding needs.',
  'Role-based dashboards and side navigation.',
  'Role-based Activity Logs page for Admins (school-specific) and Developers (global).',
  'School status management (Active, Suspended, Inactive) for system owners.',
  'School-wide currency configuration (USD, ZAR, MZN) for financial management.',
  'Student test-taking interface with automated submission for AI grading.',
  'Upgraded Events page with an interactive calendar and event creation.',
  'Upgraded Finance module with partial payments, ad-hoc transaction creation, and expense tracking.',
  'User authentication with roles (Global Admin, Admin, Teacher, Student, Parent).',
  'Configurable annual awards with prize management and system-wide announcements.'
];

const upcomingFeatures = [
  // Phase 1: Production Readiness
  'Connect mock data to a real database (e.g., Firestore) to enable persistence.',
  'Implement full CRUD (Create, Read, Update, Delete) on all management pages.',
  'Develop a dedicated "Finance Proposal" page detailing payment gateway integration, automated invoicing, and billing cycles.',

  // Phase 2: Core Feature Enhancement
  'Build out analytics for the student test-taking results for teachers.',
  'Implement a site-wide notification and communication hub.',
  'Enhance mobile-first responsive design for a seamless experience on phones and tablets.',

  // Phase 3: Future Growth
  'Introduce student-centric features like goal setting and digital portfolios.',
  'Develop district, provincial, and national data views for higher-level administration.',
  'Plan and scope development for native Android and iOS applications.',
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Project Progress & To-Do List</h2>
            <p className="text-muted-foreground">A tracker for what's done and what's next for the EduManage app.</p>
        </div>
        <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
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
            <CardTitle className="flex items-center gap-2"><Clock className="text-accent" />Upcoming Features</CardTitle>
            <CardDescription>The next set of features to be developed, in order of priority.</CardDescription>
          </CardHeader>
          <CardContent>
             <ul className="space-y-3">
              {upcomingFeatures.map((task, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Circle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
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
