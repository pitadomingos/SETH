
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, Loader2, Download } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const completedTasks = [
  'AI Test Generator for teachers with a save/deploy workflow.',
  'AI-powered Lesson Planner for Teachers with auto-saving and syllabus integration.',
  'AI-powered academic reports suite for Admins (School, Class, Struggling Students, Teacher performance).',
  'AI-powered analysis and guidance for students who have not met graduation requirements.',
  'AI-powered test grading flow that calculates scores and updates student records.',
  'Automated student enrollment from the Admissions module.',
  'Centralized system data management (Fee Descriptions, Event Audiences, etc.) in the Settings page.',
  'Comprehensive admissions workflow from parent application to admin approval.',
  'Comprehensive, subject-specific Gradebook for teachers.',
  'Created a system-wide AI analysis tool for developers to get strategic insights.',
  'Dedicated management pages for Global Admins to oversee all students and parents.',
  'Dynamic Parent Portal with multi-child support, AI-powered advice, and fee tracking.',
  'Enabled interactive profile and picture updates on the Profile page.',
  'Enhanced the Sports page with dynamic team and competition management.',
  'Global Admin dashboard for viewing all schools and managing their status.',
  'Implemented Academics (with Syllabus), Examinations, and Attendance pages.',
  'Implemented academically and financially-gated student certificate and transcript downloads.',
  'Implemented grade-level capacity management and vacancy display on application forms.',
  'Multi-school simulation with dynamic data loading based on user role.',
  'Personalized leaderboards view for parents and school-wide view for staff.',
  'Personalized login loading screen with school and user details.',
  'Project Proposal page for developers outlining vision, roadmap, and funding needs.',
  'Role-based dashboards and side navigation with logical reordering.',
  'Role-based Activity Logs page for Admins (school-specific) and Developers (global).',
  'School status management (Active, Suspended, Inactive) for system owners.',
  'School-wide currency configuration for all Southern African currencies.',
  'Student test-taking interface with automated submission for AI grading.',
  'Upgraded Events page with an interactive calendar and event creation.',
  'Upgraded Finance module with partial payments, ad-hoc transaction creation, and expense tracking.',
  'User authentication with roles (Global Admin, Admin, Teacher, Student, Parent).',
  'Configurable annual awards with prize management and system-wide announcements.',
  'Added two new campuses to the MiniArte school group with full data.',
  'Localized all names and locations to a Portuguese/Mozambican context.',
  'Fixed parent impersonation logic for Global Admins.',
  'Added "Download as PDF" functionality to all documentation pages.',
  'Corrected and enhanced the multi-school "Manage Schools" dashboard for Premium Admins.',
  'Merged Syllabus management into Academics and Admin Panel into Settings.',
  'Moved Kiosk configuration to the Kiosk Showcase page.',
  'Fixed numerous bugs related to component imports, state management, and JSX syntax.',
  'Implemented a holistic, weighted scoring system (Academics, Attendance, Behavior) for student rankings.',
  'Renamed all instances of "EduManage" to "EduDesk" for brand consistency.',
  'Created a dedicated, full-screen presentation mode for the Project Proposal.',
  'Fixed Activity Log data isolation between Global Admins and School Admins.',
  'Implemented full CRUD operations for Teachers and Classes management modules.',
];

const upcomingFeatures = [
  // Foundational & Backend
  'Connect mock data to a real database (e.g., Firestore) to enable persistence.',
  'Re-enable and connect all AI functionalities to the new Firebase data layer.',
  
  // UI/UX & Navigation
  'Group all functionalities into clear sidebar categories with collapsible sections.',
  'Enhance mobile-first responsive design for a seamless experience on phones and tablets.',
  'Include a "Back" button in all modules for consistent navigation.',
  'Implement multi-language support (Portuguese/English) with a quick-toggle menu.',
  'Apply highlight colors in cards and alerts to reinforce information hierarchy.',
  
  // Admin & Management Features
  'Implement batch user/class import for Admins (bulk upload).',
  'Create a flexible custom report generator for financial and academic data.',
  'Develop list export (PDF/DOCX) for students, classes, and grades with custom branding.',
  'Incorporate an approval workflow with history for financial transactions.',
  
  // Teacher Features
  'Enhance the grade entry system to support concepts, weights, and modules per national standards.',
  'Build out analytics for the student test-taking results for teachers.',
  
  // Student & Parent Features
  'Implement a site-wide notification and communication hub for students and parents.',
  'Introduce student-centric features like goal setting and digital portfolios.',
  'Redesign the student schedule module with alerts and calendar integration.',

  // High-Level Features
  'Develop district, provincial, and national data views for higher-level administration.',
  'Validate and implement automatic data synchronization between accounts and profiles.',
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
            <p className="text-muted-foreground">A tracker for what's done and what's next for the EduDesk app.</p>
        </div>
        <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
      </header>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="text-green-500" />Completed Tasks ({completedTasks.length})</CardTitle>
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
            <CardTitle className="flex items-center gap-2"><Clock className="text-accent" />Upcoming Features ({upcomingFeatures.length})</CardTitle>
            <CardDescription>The next set of features to be developed, based on stakeholder feedback and priorities.</CardDescription>
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
