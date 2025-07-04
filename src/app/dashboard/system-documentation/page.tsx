'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, GitBranch, LayoutTemplate, Palette, Rocket, Loader2, Database, Share2, Smartphone, Briefcase, Users } from 'lucide-react';
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
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
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
              <h3 className="font-semibold">Genkit</h3>
              <p className="text-sm text-muted-foreground">Powers the AI features, such as the Lesson Planner, by connecting to generative models.</p>
            </div>
             <div>
              <h3 className="font-semibold">Recharts & Zod</h3>
              <p className="text-sm text-muted-foreground">Recharts is used for data visualization and charts. Zod is used for schema validation in forms.</p>
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
              <h3 className="font-semibold"><code>/src/app</code></h3>
              <p className="text-sm text-muted-foreground">Contains all the application routes, pages, and layouts, following the Next.js App Router convention.</p>
            </div>
            <div>
              <h3 className="font-semibold"><code>/src/components</code></h3>
              <p className="text-sm text-muted-foreground">Home to reusable React components, including UI elements from ShadCN and custom-built components.</p>
            </div>
             <div>
              <h3 className="font-semibold"><code>/src/ai</code></h3>
              <p className="text-sm text-muted-foreground">Houses the Genkit flows and AI-related logic for generative features.</p>
            </div>
             <div>
              <h3 className="font-semibold"><code>/src/context</code></h3>
              <p className="text-sm text-muted-foreground">Contains React Context providers for managing global state like authentication and shared school data.</p>
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
              <h3 className="font-semibold">Mock Data Simulation</h3>
              <p className="text-sm text-muted-foreground">The app currently uses static mock data from <code>src/lib/mock-data.ts</code> for rapid prototyping and to simulate a multi-school environment.</p>
            </div>
            <div>
              <h3 className="font-semibold">Stateful Context for Interactivity</h3>
              <p className="text-sm text-muted-foreground">React Context (<code>SchoolDataProvider</code>) now manages dynamic, in-memory state changes. This simulates a real backend by allowing actions like recording payments, adding expenses, managing sports teams, or creating events to persist and be reflected across the app for the duration of the user's session.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette /> Styling and Theming</CardTitle>
            <CardDescription>How colors, fonts, and dark mode are handled.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">The application uses Tailwind CSS with CSS variables for theming, defined in <code>src/app/globals.css</code>. This allows for easy customization of the color palette.</p>
            <p className="text-sm">Dark mode is supported out-of-the-box and can be toggled using the theme switcher in the header. The <code>next-themes</code> package manages the theme state and applies the `.dark` class to the HTML element.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users /> Role Definitions</CardTitle>
            <CardDescription>Understanding the different user roles in the system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Developer (System Owner)</h3>
              <p className="text-sm text-muted-foreground">Has complete oversight of the entire system. This role is for application developers and maintainers, with access to all schools, system documentation, and the project to-do list.</p>
            </div>
            <div>
              <h3 className="font-semibold">Global Admin (Enterprise)</h3>
              <p className="text-sm text-muted-foreground">A customer-facing role for the Enterprise tier. Manages a specific group of schools (e.g., a school district). Has a similar dashboard to the Developer but is focused on school management, not technical system details.</p>
            </div>
             <div>
              <h3 className="font-semibold">School Admin, Teacher, Student, Parent</h3>
              <p className="text-sm text-muted-foreground">Standard roles with access scoped to a single school or family context, each with their own tailored dashboard and features.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase /> Business Model (Proposed)</CardTitle>
            <CardDescription>A suggested SaaS pricing strategy for monetization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">The proposed business model is a tiered, "per student, per year" subscription that scales with school size. Each tier unlocks more advanced functionality.</p>
            <ul className="space-y-3 text-sm">
                <li className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-semibold">Starter Tier</h4>
                    <p className="text-muted-foreground">For small schools. Provides core management features like student, teacher, and class management, attendance, and basic finance tracking.</p>
                </li>
                <li className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-semibold">Pro Tier</h4>
                    <p className="text-muted-foreground">The standard offering. Includes all Starter features plus the full suite of AI tools (Lesson Planner, Test Generator, Performance Analysis), advanced reporting, and admissions management.</p>
                </li>
                <li className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-semibold">Premium / Enterprise Tier</h4>
                    <p className="text-muted-foreground">Custom pricing for large school districts. Includes all Pro features plus the **Global Admin** role for centralized, multi-school management, consolidated billing, and system-wide AI analysis.</p>
                </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
