'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, GitBranch, LayoutTemplate, Palette, Rocket, Loader2, Database, Share2 } from 'lucide-react';
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
              <h3 className="font-semibold">Mock Data</h3>
              <p className="text-sm text-muted-foreground">The app currently uses static mock data from <code>/src/lib/mock-data.ts</code> for rapid prototyping and demonstration.</p>
            </div>
            <div>
              <h3 className="font-semibold">Shared State via Context</h3>
              <p className="text-sm text-muted-foreground">React Context (<code>SchoolDataProvider</code>) is used to manage and share application-wide data like subjects and exam boards, laying the groundwork for a more dynamic, database-driven system.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette /> Styling and Theming</CardTitle>
            <CardDescription>How colors, fonts, and dark mode are handled.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">The application uses Tailwind CSS with CSS variables for theming, defined in <code>/src/app/globals.css</code>. This allows for easy customization of the color palette.</p>
            <p className="text-sm">Dark mode is supported out-of-the-box and can be toggled using the theme switcher in the header. The <code>next-themes</code> package manages the theme state and applies the `.dark` class to the HTML element.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
