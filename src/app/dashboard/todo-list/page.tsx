'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';

const completedTasks = [
  'User authentication with three roles (Admin, Teacher, Student)',
  'Role-based dashboards and side navigation',
  'Admin panel for user viewing and system data management',
  'Student, Teacher, and Class management pages (view-only)',
  'AI-powered Lesson Planner for Teachers',
  'Schedule, Profile, and Events pages for all roles',
  'Implemented Admissions page with "New Application" form',
  'Implemented Academics page with "Add Subject" form',
  'Implemented Examinations page with scheduling and multi-board support',
  'Implemented Attendance page with class/date filtering',
  'Implemented Finance, Sports, and Reports pages with data overviews',
  'Added Asset Management page for tracking school resources',
  'Enhanced dashboards with relevant charts and data cards for each role',
  'Created a "Leaderboards" page for academic rankings',
  'Added a "School Profile" page for admins',
  'Personalized login loading screen with school and user details',
];

const upcomingFeatures = [
  'Implement full CRUD (Create, Read, Update, Delete) on all management pages',
  'Connect mock data to a real database (e.g., Firestore) to enable persistence',
  'Implement a site-wide notification and communication hub for announcements and messaging',
  'Develop a Parent/Guardian Portal for viewing student progress and communicating with teachers',
  'Enable profile editing with photo uploads for all users',
  'Expand AI features with student performance analysis and an early warning system to identify at-risk students',
  'Implement an advanced report generation engine for custom data exports',
  'Build a resource booking system for labs, projectors, and other shared assets',
  'Introduce student-centric features like goal setting and digital portfolios to boost motivation',
  'Develop district, provincial, and national data views for higher-level administration',
];

export default function TodoListPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!isLoading && role !== 'Admin') {
    router.push('/dashboard');
    return null;
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
              {completedTasks.map((task, index) => (
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
