'use client';
import { useAuth } from '@/context/auth-context';
import { useSchoolData } from '@/context/school-data-context';
import { Loader2 } from 'lucide-react';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import TeacherDashboard from '@/components/dashboard/teacher-dashboard';
import StudentDashboard from '@/components/dashboard/student-dashboard';
import ParentDashboard from '@/components/dashboard/parent-dashboard';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PremiumAdminDashboard from '@/components/dashboard/premium-admin-dashboard';

export default function DashboardPage() {
  const { user, role, isLoading } = useAuth();
  const { schoolGroups } = useSchoolData();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role === 'GlobalAdmin') {
      router.push('/dashboard/global-admin');
    }
  }, [role, isLoading, router]);

  const isPremiumAdmin = useMemo(() => {
    if (role !== 'Admin' || !user?.schoolId || !schoolGroups) return false;
    return Object.values(schoolGroups).some(group => group.includes(user.schoolId!));
  }, [role, user, schoolGroups]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (role === 'GlobalAdmin') {
    // This state is temporary while the redirect happens, to avoid flashing other dashboards.
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (isPremiumAdmin) {
    return <PremiumAdminDashboard />;
  }

  switch (role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Teacher':
      return <TeacherDashboard />;
    case 'Student':
      return <StudentDashboard />;
    case 'Parent':
      return <ParentDashboard />;
    default:
      return (
        <div className="flex h-full items-center justify-center">
          <p>No dashboard available for your role.</p>
        </div>
      );
  }
}
