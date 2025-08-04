
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, Layers, Cloud, KeyRound, Server, UploadCloud, GitBranch, FolderTree, Puzzle, UserCheck, BrainCircuit, Download, Trophy } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function SystemDocumentationPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);


  if (isLoading || role !== 'GlobalAdmin') {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">System Documentation</h2>
            <p className="text-muted-foreground">A detailed technical overview of the EduDesk application.</p>
        </div>
        <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Layers /> Core Technologies</CardTitle>
          <CardDescription>The foundational technology stack used to build the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 list-disc pl-10 text-sm text-muted-foreground">
          <li><b>Framework:</b> Next.js 15 with the App Router for server-centric rendering and routing.</li>
          <li><b>Language:</b> TypeScript for robust type-safety and developer experience.</li>
          <li><b>UI Components:</b> ShadCN UI, a collection of accessible and composable components built on Radix UI.</li>
          <li><b>Styling:</b> Tailwind CSS for a utility-first styling approach.</li>
          <li><b>AI Integration:</b> Google's Genkit framework with Gemini models for all AI-powered features.</li>
          <li><b>Data Layer:</b> A hybrid approach using an initial data load from a mock file (`mock-data.ts`) with all subsequent state managed in-memory via React Context.</li>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FolderTree /> Project Structure</CardTitle>
          <CardDescription>An overview of the key directories and their purpose.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
            <li><code>/src/app/dashboard/</code>: Contains all the application's pages, following the Next.js App Router file-based routing convention.</li>
            <li><code>/src/components/</code>: Holds reusable React components, organized into `ui` (from ShadCN), `layout`, `dashboard`, etc.</li>
            <li><code>/src/context/</code>: Manages global state.
              <ul className="list-disc pl-6 mt-1">
                <li><code>auth-context.tsx</code>: Handles user authentication, roles, and impersonation.</li>
                <li><code>school-data-context.tsx</code>: Acts as the central in-memory database for the prototype.</li>
              </ul>
            </li>
            <li><code>/src/lib/</code>: Contains utility functions (`utils.ts`), mock data (`mock-data.ts`), and Firebase service stubs.</li>
            <li><code>/src/ai/flows/</code>: Contains all the server-side Genkit flows that define the AI's capabilities.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database /> Data Flow & State Management (In-Memory)</CardTitle>
          <CardDescription>How the application manages its data during a session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">For prototype stability and speed, EduDesk uses a "session-based" in-memory data store. Changes are **not** persisted between page reloads.</p>
            <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-2">
                <li><b>Initialization:</b> When the app first loads, <code>SchoolDataProvider</code> in <code>school-data-context.tsx</code> reads the entire dataset from <code>/src/lib/mock-data.ts</code> into React state variables.</li>
                <li><b>Data Slicing & Isolation:</b> The context then uses the authenticated user's role and school ID to "slice" this global dataset, providing each component with only the data it's authorized to see (e.g., a teacher only sees their students). Global Admin activity logs are isolated to a specific school record to prevent them from appearing in individual school feeds.</li>
                <li><b>In-Memory Mutations:</b> When a user performs an action (like adding a student), the corresponding function (e.g., <code>addStudent</code>) updates the state variable directly. It does **not** write back to the mock data file.</li>
                <li><b>Re-rendering:</b> Because the data is in React state, any component consuming that data via the <code>useSchoolData</code> hook will automatically re-render to reflect the changes.</li>
            </ol>
             <p className="text-sm text-muted-foreground">This architecture ensures a fast, responsive user experience for demonstration purposes and is designed for a straightforward transition to a persistent backend.</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCheck /> Authentication & Authorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Authentication is handled by <code>AuthProvider</code>. It uses the <code>mockUsers</code> object from `mock-data.ts` as its source of truth. The user's role and school affiliation are stored in sessionStorage to persist the login state.</p>
                <p>Role-based access control (RBAC) is implemented throughout the app, primarily in two ways:</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li><b>Page-Level:</b> Each page component checks the user's role from <code>useAuth()</code> and redirects if they are not authorized.</li>
                    <li><b>Component-Level:</b> The sidebar and other components conditionally render UI elements (like buttons and menu items) based on the user's role.</li>
                </ul>
                <p>The <b>Impersonation</b> feature allows a Global Admin to temporarily assume the role of another user to view the application from their perspective. The original user's session is stored and can be reverted to.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BrainCircuit /> AI Integration with Genkit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>All AI capabilities are powered by Google's Genkit framework, defined in the <code>/src/ai/flows/</code> directory. Each file in this directory represents a distinct, server-side AI capability.</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li><b>Flow Definition:</b> Each flow uses <code>ai.defineFlow()</code> to create a server function that can be called from client components.</li>
                    <li><b>Schema-Driven I/O:</b> Zod schemas are used to define the expected input and output structures, ensuring type safety and enabling the LLM to return structured JSON data.</li>
                    <li><b>Prompts:</b> The core logic is defined in a Handlebars template string within <code>ai.definePrompt()</code>. The prompt instructs the LLM on its persona, the task, and the data it needs to analyze from the input schema.</li>
                    <li><b>API Key:</b> Genkit requires a <code>GOOGLE_API_KEY</code> to be set in the <code>.env</code> file to communicate with the Gemini models.</li>
                </ul>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trophy /> System-Wide Awards & Persistent State</CardTitle>
          <CardDescription>How global settings like the annual awards are managed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>To ensure system-wide settings are persistent and not lost, the application uses a "master record" approach within the prototype's architecture.</p>
            <ul className="list-disc pl-6 mt-1 space-y-2">
                <li><b>Master Record:</b> The "Northwood High" school record serves as the central storage for global configurations. For example, the `awardsAnnounced` flag is stored in `northwood.profile.kioskConfig.showAwardWinner`.</li>
                <li><b>State Initialization:</b> On application startup, the `SchoolDataProvider` reads this value from the Northwood record to determine if the awards have been announced, ensuring the state persists across sessions.</li>
                <li><b>Safeguard:</b> To make this approach robust, the "Delete School" functionality is disabled for the Northwood High record, preventing accidental deletion of critical system settings.</li>
            </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GitBranch /> Backend Integration Roadmap (Next Steps)</CardTitle>
          <CardDescription>The path to transitioning from the mock data layer to a full Firebase backend.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
                <KeyRound className="h-4 w-4 text-accent mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold text-card-foreground">1. Firebase Authentication</h4>
                    <p className="text-muted-foreground">Replace the mock login system with Firebase Authentication. Implement email/password sign-up and sign-in, and manage user sessions and roles securely.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Server className="h-4 w-4 text-accent mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold text-card-foreground">2. Firestore Database & Data Modeling</h4>
                    <p className="text-muted-foreground">Design and create Firestore collections for schools, users, students, grades, etc. A dedicated `global_settings` collection will be created to replace the "master record" approach used in the prototype.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <UploadCloud className="h-4 w-4 text-accent mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold text-card-foreground">3. Cloud Storage & API Layer</h4>
                    <p className="text-muted-foreground">Implement Firebase Storage for file uploads (e.g., logos, expense receipts). Create a set of server-side functions (e.g., Server Actions or Cloud Functions) to handle all Create, Read, Update, and Delete (CRUD) operations with Firestore and Storage, governed by security rules.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Database className="h-4 w-4 text-accent mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold text-card-foreground">4. Data Fetching & Mutation</h4>
                    <p className="text-muted-foreground">Update the `SchoolDataProvider` to fetch data from the new API layer instead of local mock data. All in-memory state manipulation functions (e.g., `addStudent`) must be refactored to call the new API layer, making all changes fully persistent.</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
