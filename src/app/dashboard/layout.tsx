
'use client';
import { ProtectedRoute } from '@/context/auth-context';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isLoading, usedFallback, schoolProfile } = useSchoolData();

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <>
            {usedFallback && (
                <div className="bg-yellow-200 text-black px-4 py-2 text-sm font-semibold">
                  ⚠️ You are seeing fallback data from{" "}
                  <strong>{schoolProfile?.name || "Unknown School"}</strong>.  
                  Please update this user’s <code>schoolId</code> in Firestore.
                </div>
             )}
            {children}
        </>
    );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
              <Sidebar className="print:hidden">
              <AppSidebar />
              </Sidebar>
              <SidebarInset>
                  <AppHeader className="print:hidden"/>
                  <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                      <DashboardContent>{children}</DashboardContent>
                  </main>
              </SidebarInset>
          </div>
        </SidebarProvider>
    </ProtectedRoute>
  );
}
