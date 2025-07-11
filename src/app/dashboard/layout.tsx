
'use client';
import { ProtectedRoute } from '@/context/auth-context';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useSchoolData } from '@/context/school-data-context';
import { Loader2 } from 'lucide-react';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isLoading } = useSchoolData();

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return <>{children}</>;
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
