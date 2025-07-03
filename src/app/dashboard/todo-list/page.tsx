'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const completedTasks = [
  'User authentication with roles (Global Admin, Admin, Teacher, Student, Parent)',
  'Role-based dashboards and side navigation',
  'Multi-school simulation with dynamic data loading based on user role',
  'Global Admin dashboard for viewing all schools',
  'Admin panel for user viewing and system data management',
  'Student, Teacher, and Class management pages (view-only)',
  'AI-powered Lesson Planner for Teachers',
  'AI-powered, ad-hoc Test Generator for teachers',
  'AI-powered class performance analysis and intervention recommendations on Teacher Dashboard',
  'Comprehensive, subject-specific Gradebook for teachers with dual (letter & numeric) grading support',
  'Dynamic Parent Portal with multi-child support, AI-powered advice, and fee tracking',
  'Personalized leaderboards view for parents and school-wide view for staff',
  'Schedule, Profile, and Events pages for all roles',
  'Implemented Admissions, Academics, Examinations, and Attendance pages',
  'Upgraded Finance module with partial payments and ad-hoc transaction creation',
  'Added Asset Management, Sports, and Reports pages',
  'Added a "School Profile" page for admins',
  'Implemented fee-gated student certificate and transcript downloads on the Student Dashboard.',
  'Personalized login loading screen with school and user details',
  'Defined a tiered, per-student pricing strategy for future monetization',
];

const upcomingFeatures = [
  'Build out student online test-taking, auto-grading, and result-publishing based on the AI Test Generator',
  'Implement full CRUD (Create, Read, Update, Delete) on all management pages',
  'Develop a configurable fee management system for admins (e.g., termly tuition, ad-hoc fees)',
  'Build a subscription and billing management system based on defined pricing tiers',
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
              {upcomingFeatures.map((task, index) => (
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
