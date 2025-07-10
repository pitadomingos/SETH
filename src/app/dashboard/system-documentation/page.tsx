
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, GitBranch, LayoutTemplate, Palette, Rocket, Loader2, Database, Share2, Smartphone, Briefcase, Users, Cloud, Server, KeyRound, UploadCloud, BrainCircuit, MonitorPlay } from 'lucide-react';
import { useEffect } from 'react';

export default function SystemDocumentationPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'GlobalAdmin') {
    return (<div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>);
  }
  
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">System Documentation</h2>
        <p className="text-muted-foreground">Technical details about the EduManage application.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Rocket /> Tech Stack</CardTitle>
            <CardDescription>The core technologies used to build this application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Next.js & React</h3>
              <p className="text-sm text-muted-foreground">The framework for building the user interface and server-side logic, using the App Router.</p>
            </div>
            <div>
              <h3 className="font-semibold">ShadCN UI & Tailwind CSS</h3>
              <p className="text-sm text-muted-foreground">Used for the component library and styling, providing a consistent and modern look.</p>
            </div>
            <div>
              <h3 className="font-semibold">Genkit & Google AI</h3>
              <p className="text-sm text-muted-foreground">Powers all AI features, such as the AI Reports, Lesson Planner, and Test Grader by connecting to Google's generative models.</p>
            </div>
             <div>
              <h3 className="font-semibold">Recharts & Zod</h3>
              <p className="text-sm text-muted-foreground">Recharts is used for data visualization and charts. Zod is used for schema validation in forms and AI flows.</p>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GitBranch /> Project Structure</CardTitle>
            <CardDescription>An overview of the key directories in the codebase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold"><code>/src/app/dashboard</code></h3>
              <p className="text-sm text-muted-foreground">Contains all application routes, pages (including global admin routes), and layouts. Includes dynamic routes like <code>/test/[id]</code> for test-taking.</p>
            </div>
             <div>
              <h3 className="font-semibold"><code>/src/app/kiosk</code></h3>
              <p className="text-sm text-muted-foreground">Contains the dynamic route and layout for the fullscreen, public-facing Kiosk Mode.</p>
             </div>
            <div>
              <h3 className="font-semibold"><code>/src/components</code></h3>
              <p className="text-sm text-muted-foreground">Home to reusable React components, including UI elements from ShadCN and custom-built dashboard components.</p>
            </div>
             <div>
              <h3 className="font-semibold flex items-center gap-2"><BrainCircuit /> src/ai/flows</code></h3>
              <p className="text-sm text-muted-foreground">Houses the Genkit flows and AI-related logic, including: <code>create-lesson-plan</code>, <code>generate-test</code>, <code>grade-student-test</code>, <code>analyze-schedule-conflicts</code>, <code>analyze-school-performance</code>, <code>identify-struggling-students</code>, and more.</p>
             </div>
             <div>
              <h3 className="font-semibold"><code>/src/context</code></h3>
              <p className="text-sm text-muted-foreground">Contains React Context providers for managing global state like authentication (<code>AuthProvider</code>) and shared school data (<code>SchoolDataProvider</code>).</p>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database /> Data Management</CardTitle>
            <CardDescription>How application data is currently handled.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
              <h3 className="font-semibold">In-Memory Mock Database</h3>
              <p className="text-sm text-muted-foreground">The app currently uses static mock data from src/lib/mock-data.ts for rapid prototyping. To simulate persistence, this mock data object is mutated directly in the data context provider. This allows changes to persist throughout a user's session without a real backend.</p>
            </div>
            <div>
              <h3 className="font-semibold">Stateful Context Providers</h3>
              <p className="text-sm text-muted-foreground">The <code>AuthProvider</code> and <code>SchoolDataProvider</code> contexts work together to create a dynamic, in-memory state. Based on the logged-in user, the system loads the correct slice of data, simulating a real multi-tenant backend and allowing actions to update the UI instantly.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Share2 /> Key System Flows & Logic</CardTitle>
                <CardDescription>Core automated workflows and logic within the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <h3 className="font-semibold">Configurable Kiosk Mode</h3>
                    <p className="text-sm text-muted-foreground">A dynamic route at `/kiosk/[schoolId]` provides a fullscreen, automated slideshow for public displays. Admins can configure which slides (Dashboard, Leaderboards, etc.) are visible for their school. A special `/kiosk/global` view includes marketing slides for corporate display.</p>
                </div>
                <div>
                    <h3 className="font-semibold">Global Admin Impersonation</h3>
                    <p className="text-sm text-muted-foreground">The Global Admin can "Log in as" any user in the system. This provides an exact view of what the user sees, enabling efficient troubleshooting and support.</p>
                </div>
                <div>
                    <h3 className="font-semibold">Automated Student Enrollment</h3>
                    <p className="text-sm text-muted-foreground">When an Administrator approves an application in the Admissions module, the system automatically creates a new student record and adds them to the school's roster. This streamlines the onboarding process.</p>
                </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cloud /> Backend & Firebase Integration Roadmap</CardTitle>
            <CardDescription>A step-by-step plan to transition to a full Firebase backend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                  <KeyRound className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                      <h4 className="font-semibold">1. Firebase Authentication</h4>
                      <p className="text-sm text-muted-foreground">Replace the mock login system with Firebase Authentication. Implement email/password sign-up and sign-in, and manage user sessions and roles securely.</p>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <Server className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                      <h4 className="font-semibold">2. Firestore Database & Data Modeling</h4>
                      <p className="text-sm text-muted-foreground">Design and create Firestore collections for schools, users, students, grades, etc. Structure the data for efficient queries and scalability, replacing the <code>mock-data.ts</code> file.</p>
                  </div>
              </div>
               <div className="flex items-start gap-3">
                  <UploadCloud className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                      <h4 className="font-semibold">3. Cloud Storage & API Layer</h4>
                      <p className="text-sm text-muted-foreground">Implement Firebase Storage for file uploads (e.g., logos, expense receipts). Create a set of server-side functions (e.g., Server Actions) to handle all Create, Read, Update, and Delete (CRUD) operations with Firestore and Storage, governed by security rules.</p>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                      <h4 className="font-semibold">4. Data Fetching & Mutation</h4>
                      <p className="text-sm text-muted-foreground">Update the <code>SchoolDataProvider</code> to fetch data from the new API layer instead of local mock data. Wire up all forms and actions (e.g., adding a student, uploading a logo) to call the API for persistent changes.</p>
                  </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
