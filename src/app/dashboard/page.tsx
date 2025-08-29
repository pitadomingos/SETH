
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

export default function DashboardPage() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role === 'GlobalAdmin') {
      router.push('/dashboard/global-admin/dashboard');
    }
  }, [role, isLoading, router]);

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

  switch (role) {
    case 'Admin':
    case 'FinanceOfficer':
    case 'AcademicDean':
    case 'AdmissionsOfficer':
    case 'Counselor':
    case 'SportsDirector':
    case 'ITAdmin':
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
