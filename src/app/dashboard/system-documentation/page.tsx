
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, Layers, Cloud, KeyRound, Server, UploadCloud, GitBranch } from 'lucide-react';
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
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">System Documentation</h2>
        <p className="text-muted-foreground">Technical details about the EduManage application.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Architecture</CardTitle>
          <CardDescription>A high-level overview of the technologies and structure of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Layers /> Frontend Stack</h3>
                <ul className="list-disc pl-6 text-muted-foreground text-sm space-y-1">
                    <li>**Framework:** Next.js with the App Router for server-centric rendering and routing.</li>
                    <li>**Language:** TypeScript for robust type-safety and developer experience.</li>
                    <li>**UI Components:** ShadCN UI, a collection of accessible and composable components built on Radix UI.</li>
                    <li>**Styling:** Tailwind CSS for a utility-first styling approach.</li>
                    <li>**State Management:** React Context API for managing global state like authentication and school data.</li>
                </ul>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Cloud /> AI & Backend Logic</h3>
                <ul className="list-disc pl-6 text-muted-foreground text-sm space-y-1">
                    <li>**Generative AI:** Google's Genkit framework, using the Gemini family of models (Gemini 2.0 Flash) for all AI-powered analysis, content generation, and grading.</li>
                    <li>**Server Actions:** Next.js Server Actions are used for secure, server-side data mutations without the need for traditional API endpoints.</li>
                    <li>**Data Layer (Prototype):** All application data is currently mocked and managed in-memory via React Context. This simulates a real database for rapid prototyping and is designed to be swapped with a production backend.</li>
                </ul>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2"><GitBranch /> Proposed Production Backend (Firebase)</h3>
                 <p className="text-sm text-muted-foreground">The application is architected for a seamless transition to a full Firebase backend. The proposed integration plan is as follows:</p>
                <ul className="list-disc pl-6 text-muted-foreground text-sm space-y-2 mt-2">
                     <li className="flex items-start gap-3">
                        <KeyRound className="h-4 w-4 text-accent mt-1 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-card-foreground">Firebase Authentication</h4>
                            <p>Replace the mock login system with Firebase Authentication for real user management.</p>
                        </div>
                    </li>
                     <li className="flex items-start gap-3">
                        <Server className="h-4 w-4 text-accent mt-1 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-card-foreground">Firestore Database</h4>
                            <p>Transition all data from `mock-data.ts` to Firestore collections, designed for multi-tenancy and secure data access.</p>
                        </div>
                    </li>
                     <li className="flex items-start gap-3">
                        <UploadCloud className="h-4 w-4 text-accent mt-1 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-card-foreground">Cloud Storage & API Layer</h4>
                            <p>Use Firebase Storage for file uploads (logos, receipts) and Cloud Functions (or Server Actions with a Firebase adapter) to handle all database interactions.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
