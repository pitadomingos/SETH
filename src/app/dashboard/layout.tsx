
'use client';
import { ProtectedRoute } from '@/context/auth-context';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SchoolDataProvider } from '@/context/school-data-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SchoolDataProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
              <Sidebar className="print:hidden">
              <AppSidebar />
              </Sidebar>
              <SidebarInset>
                  <AppHeader className="print:hidden"/>
                  <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                      {children}
                  </main>
              </SidebarInset>
          </div>
        </SidebarProvider>
      </SchoolDataProvider>
    </ProtectedRoute>
  );
}
