
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, Layers, Cloud, KeyRound, Server, UploadCloud, GitBranch, FolderTree, Puzzle, UserCheck, BrainCircuit, Download, Trophy, DollarSign, LifeBuoy, Lightbulb, TrendingUp, BookCopy, Award, School, Baby, Briefcase, Smartphone, LineChart, Club, KeyRound as KeyRoundIcon, MonitorPlay, Users, Radio, Mail, FileText } from 'lucide-react';
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
           <li><b>Real-time Communication:</b> Node.js WebSocket server for live alerts and notifications.</li>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FolderTree /> Project Structure</CardTitle>
          <CardDescription>An overview of the key directories and their purpose.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">The project follows a feature-centric structure within the Next.js App Router. This approach keeps related logic, components, and services organized and easy to locate.</p>
            <pre className="text-xs p-4 bg-muted rounded-md overflow-x-auto">
{`src
├── app
│   ├── (public)
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Public homepage
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard
│   │   ├── (routes)          # Each feature page (e.g., finance, students, etc.)
│   │   ├── layout.tsx        # Main dashboard layout with sidebar and header
│   │   └── page.tsx          # Root dashboard page that routes to specific role dashboards
│   └── actions/              # Next.js Server Actions for all database mutations
├── components
│   ├── ui/                   # Core, unstyled components from ShadCN
│   ├── layout/               # App layout components (Sidebar, Header, Providers)
│   ├── dashboard/            # Components specific to dashboard pages
│   └── auth/                 # Authentication-related components (Login Form)
├── context
│   ├── auth-context.tsx      # Handles user session, roles, and impersonation
│   └── school-data-context.tsx # Central client-side data cache and action dispatcher
├── lib
│   ├── firebase/
│   │   ├── config.ts         # Firebase initialization and emulator connections
│   │   └── firestore-service.ts # All direct interactions with Firestore (CRUD functions)
│   ├── initial-seed-data.ts  # The complete initial dataset for seeding Firestore
│   ├── email-service.ts      # (Simulated) Service for sending emails via Server Actions
│   ├── websocketClient.ts    # Client-side class for managing WebSocket connections
│   └── utils.ts              # General utility functions (cn, formatters, etc.)
└── ai
    └── flows/                # All Genkit AI flow definitions
`}
            </pre>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database /> Data Flow & State Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">EduDesk uses a Firebase-backed, server-authoritative data model. All data is persistent and managed through a clear client-server flow.</p>
                <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-2">
                    <li><b>Initialization:</b> On app load, `SchoolDataProvider` triggers the `getSchoolsFromFirestore` function. This is the single entry point for fetching all school-related data. If the database is empty, it's automatically seeded from `initial-seed-data.ts`.</li>
                    <li><b>Data Slicing & Isolation:</b> The `SchoolDataContext` uses the authenticated user's role and school ID to "slice" the global dataset, providing each component with only the data it's authorized to see. This is critical for the multi-tenant architecture.</li>
                    <li><b>Server-Side Mutations:</b> When a user performs a CRUD action (e.g., adding a teacher), the UI calls a corresponding server action from the `src/app/actions/` directory.</li>
                    <li><b>Database Interaction:</b> The Server Action calls a dedicated function in `src/lib/firebase/firestore-service.ts`, which executes the final write, update, or delete operation in Firestore. This isolates all database logic in one place.</li>
                    <li><b>State Synchronization:</b> Because all data fetching is centralized in `getSchoolsFromFirestore` and Next.js revalidates paths on action completion, the data is refreshed from the server, ensuring the UI always reflects the persistent state.</li>
                </ol>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Radio className="text-primary"/> Real-time Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>The application features a real-time notification system for broadcasting important alerts from administrators to staff and parents.</p>
                 <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-2">
                    <li><b>WebSocket Server:</b> A simple Node.js WebSocket server runs as a separate process to handle real-time connections. It is not part of this codebase.</li>
                    <li><b>Client Connection:</b> When a user logs in, the `WebSocketProvider` in `app-providers.tsx` initializes a `RoleBasedWebSocketClient`. This client connects to the server and identifies itself with the user's role (e.g., 'Admin', 'Teacher').</li>
                    <li><b>Broadcasting:</b> An administrator can use the "Broadcast" feature in their dashboard. This uses the connected `wsClient` to send a message to the WebSocket server with a target audience.</li>
                    <li><b>Targeted Delivery:</b> The server receives the message and broadcasts it to all connected clients whose role matches the target audience (e.g., 'all', 'teachers').</li>
                    <li><b>UI Updates:</b> The `LiveAlertsCard` component subscribes to the `useWebSocket` hook. When a relevant message is received, the component's state is updated, and the new alert is displayed instantly without a page refresh.</li>
                </ol>
            </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCheck /> Authentication & Authorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Authentication is handled by the `AuthProvider`, which validates against user profiles in Firestore. Upon successful login, the user's details are stored in sessionStorage to persist the session.</p>
                <p>Role-based access control (RBAC) is implemented throughout the app. The primary roles are Global Admin, Admin, Teacher, Student, and Parent. The system is designed to support more granular school-level roles like Academic Dean, Counselor, and Finance Officer.</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li><b>Page-Level Security:</b> Each page component checks the user's role and redirects if they are not authorized. This is enforced in the `useEffect` hooks of each page.</li>
                    <li><b>UI-Level Security:</b> The sidebar (`AppSidebar`) and other components conditionally render UI elements based on the user's role and school's subscription tier.</li>
                    <li><b>Impersonation:</b> Allows a Global Admin or Premium Admin to temporarily assume another user's role for support and verification by calling the `impersonateUser` function from the `AuthContext`.</li>
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
    </div>
  );
}
