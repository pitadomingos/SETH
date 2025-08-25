
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, Layers, Cloud, KeyRound, Server, UploadCloud, GitBranch, FolderTree, Puzzle, UserCheck, BrainCircuit, Download, Trophy, DollarSign, LifeBuoy, Lightbulb, TrendingUp } from 'lucide-react';
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
          <li><b>Database:</b> Google Firebase (Firestore) for a scalable, real-time NoSQL database.</li>
           <li><b>Authentication:</b> Firebase Authentication for managing user identity and sessions.</li>
           <li><b>File Storage:</b> Firebase Cloud Storage for handling all file uploads (e.g., logos, documents).</li>
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
            <li><code>/src/app/actions/</code>: Contains all Next.js Server Actions used for server-side mutations.</li>
            <li><code>/src/components/</code>: Holds reusable React components, organized into `ui` (from ShadCN), `layout`, `dashboard`, etc.</li>
            <li><code>/src/context/</code>: Manages global state.
              <ul className="list-disc pl-6 mt-1">
                <li><code>auth-context.tsx</code>: Handles user authentication, roles, and impersonation.</li>
                <li><code>school-data-context.tsx</code>: Acts as the central client-side data provider, fetching data and calling server actions.</li>
              </ul>
            </li>
            <li><code>/src/lib/</code>: Contains utility functions (`utils.ts`), mock data for seeding (`mock-data.ts`), and Firebase service functions.</li>
            <li><code>/src/ai/flows/</code>: Contains all the server-side Genkit flows that define the AI's capabilities.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database /> Data Flow & State Management</CardTitle>
          <CardDescription>How the application manages and persists its data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">EduDesk uses a Firebase-backed, server-authoritative data model. All data is persistent and managed through a clear client-server flow.</p>
            <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-2">
                <li><b>Initialization:</b> On app load, <code>SchoolDataProvider</code> fetches the entire dataset from Firestore. If the database is empty, it's automatically seeded from <code>/src/lib/mock-data.ts</code>.</li>
                <li><b>Data Slicing & Isolation:</b> The context uses the authenticated user's role and school ID to "slice" the global dataset, providing each component with only the data it's authorized to see. This is critical for the multi-tenant architecture.</li>
                <li><b>Server-Side Mutations:</b> When a user performs a CRUD action (e.g., adding a student), the UI calls a function in <code>SchoolDataProvider</code>. This function then invokes a Next.js Server Action.</li>
                <li><b>Database Interaction:</b> The Server Action calls a corresponding function in s<code>/src/lib/firebase/firestore-service.ts</code>, which executes the write, update, or delete operation in Firestore.</li>
                 <li><b>State Synchronization:</b> After a successful database operation, the local state in <code>SchoolDataProvider</code> is updated to match, ensuring the UI re-renders instantly to reflect the persistent change without needing a full data refetch.</li>
            </ol>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCheck /> Authentication & Authorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Authentication is handled by the <code>AuthProvider</code>, which now validates against user profiles in Firestore. Upon successful login, the user's role and school affiliation are stored in sessionStorage to persist the session.</p>
                <p>Role-based access control (RBAC) is implemented throughout the app, with an expanding set of roles to delegate responsibilities effectively. The primary roles are Global Admin, Admin, Teacher, Student, and Parent. The system is designed to support more granular school-level roles like Academic Dean, Counselor, and Finance Officer, as well as future higher-level roles for District, Provincial, and National oversight.</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li><b>Page-Level Security:</b> Each page component checks the user's role and redirects if they are not authorized.</li>
                    <li><b>UI-Level Security:</b> The sidebar and other components conditionally render UI elements based on the user's role.</li>
                    <li><b>Impersonation:</b> Allows a Global Admin to temporarily assume another user's role for support and verification.</li>
                </ul>
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
            <p>To ensure system-wide settings are persistent and not lost, the application uses a "master record" approach within its Firebase architecture.</p>
            <ul className="list-disc pl-6 mt-1 space-y-2">
                <li><b>Master Record:</b> The "Northwood High" school record (`documentId: northwood`) serves as the central storage for global configurations. For example, the `awardsAnnounced` flag is stored in `northwood.profile.awards`.</li>
                <li><b>State Initialization:</b> On application startup, the `SchoolDataProvider` reads this value from the Northwood record to determine if the awards have been announced, ensuring the state persists across sessions.</li>
                <li><b>Safeguard:</b> To make this approach robust, the "Delete School" functionality is disabled for the Northwood High record, preventing accidental deletion of critical system settings.</li>
            </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GitBranch /> Backend Architecture</CardTitle>
          <CardDescription>An overview of the server-side components and data persistence strategy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
                <KeyRound className="h-4 w-4 text-accent mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold text-card-foreground">1. Firebase Authentication</h4>
                    <p className="text-muted-foreground">Manages all user identities, sessions, and provides the foundation for role-based access control. All user profiles are stored in Firestore.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Server className="h-4 w-4 text-accent mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold text-card-foreground">2. Firestore Database & Data Modeling</h4>
                    <p className="text-muted-foreground">A single `schools` collection holds all data. Each school is a document, and its related data (students, teachers, etc.) are stored in arrays within that document. This model simplifies data fetching and ensures tenancy.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <UploadCloud className="h-4 w-4 text-accent mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold text-card-foreground">3. Next.js Server Actions</h4>
                    <p className="text-muted-foreground">Serve as the primary API layer. All database mutations (CRUD operations) are handled through these server-side functions, ensuring that sensitive logic and database interaction code never runs on the client.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Database className="h-4 w-4 text-accent mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold text-card-foreground">4. Firestore Service Layer</h4>
                    <p className="text-muted-foreground">Located in s<code>/lib/firebase/firestore-service.ts</code>, this layer abstracts the direct Firebase SDK calls. Server Actions call functions in this service to interact with the database, centralizing all Firestore logic.</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users /> Suggested Corporate Roles</CardTitle>
          <CardDescription>A blueprint for the Pixel Digital Solutions team as the platform scales.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2"><Server className="text-primary"/> Chief Technology Officer (CTO)</h4>
                <p className="text-sm text-muted-foreground">Oversees technical vision, architecture, platform security, and scalability. Manages the development lifecycle and major integrations like payment gateways.</p>
            </div>
            <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="text-primary"/> Head of Product</h4>
                <p className="text-sm text-muted-foreground">Defines the product roadmap based on user feedback and market analysis. Prioritizes new features, analyzes usage data, and ensures the product meets user needs.</p>
            </div>
            <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2"><TrendingUp className="text-primary"/> Head of Sales & Partnerships</h4>
                <p className="text-sm text-muted-foreground">Drives customer acquisition and revenue. Manages the sales team, builds strategic partnerships, and uses platform dashboards to track growth and inform strategy.</p>
            </div>
            <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2"><LifeBuoy className="text-primary"/> Head of Customer Success & Support</h4>
                <p className="text-sm text-muted-foreground">Focuses on customer onboarding, training, and retention. Manages the support team, develops user documentation, and uses platform tools like impersonation to resolve issues.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
