'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, GitBranch, LayoutTemplate, Palette, Rocket, Loader2, Database, Share2, Smartphone, Briefcase, Users, Cloud, Server, KeyRound, UploadCloud } from 'lucide-react';
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
              <p className="text-sm text-muted-foreground">The `SchoolDataProvider` context manages a dynamic, in-memory state. This simulates a real backend by allowing actions like adding students, recording payments, or creating events to persist and be reflected across the app for the duration of the user's session without a page refresh.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cloud /> Backend & Firebase Integration Roadmap</CardTitle>
            <CardDescription>A step-by-step plan to transition to a full Firebase backend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                  <KeyRound className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-semibold">1. Firebase Authentication</h4>
                      <p className="text-sm text-muted-foreground">Replace the mock login system with Firebase Authentication. Implement email/password sign-up and sign-in, and manage user sessions and roles securely.</p>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <Server className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-semibold">2. Firestore Database & Data Modeling</h4>
                      <p className="text-sm text-muted-foreground">Design and create Firestore collections for schools, users, students, grades, etc. Structure the data for efficient queries and scalability, replacing the `mock-data.ts` file.</p>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <UploadCloud className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-semibold">3. API Layer for Data Interaction</h4>
                      <p className="text-sm text-muted-foreground">Create a set of server-side functions (e.g., Next.js API Routes or Server Actions) to handle all Create, Read, Update, and Delete (CRUD) operations with Firestore, governed by security rules.</p>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-semibold">4. Data Fetching & Mutation</h4>
                      <p className="text-sm text-muted-foreground">Update the `SchoolDataProvider` to fetch data from the new API layer instead of local mock data. Wire up all forms and actions (e.g., adding a student, recording a payment) to call the API for persistent changes.</p>
                  </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
