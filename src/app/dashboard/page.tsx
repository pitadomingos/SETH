
'use client';
import { useAuth } from '@/context/auth-context';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import TeacherDashboard from '@/components/dashboard/teacher-dashboard';
import StudentDashboard from '@/components/dashboard/student-dashboard';
import ParentDashboard from '@/components/dashboard/parent-dashboard';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useSchoolData } from '@/context/school-data-context';
import PremiumAdminDashboard from '@/components/dashboard/premium-admin-dashboard';

export default function DashboardPage() {
  const { role, user, isLoading: isAuthLoading, originalUser } = useAuth();
  const { schoolGroups, isLoading: isSchoolDataLoading } = useSchoolData();
  const router = useRouter();

  const isLoading = isAuthLoading || isSchoolDataLoading;

  const isPremiumAdmin = useMemo(() => {
    // A user is a premium admin if their original role was Admin (not an impersonated one)
    // and their school is part of any school group.
    if (role !== 'Admin' || !user?.schoolId || !schoolGroups) return false;
    // Check if the user is currently impersonating. If so, they are not a premium admin in this context.
    if (originalUser) return false;
    return Object.values(schoolGroups).some(groupSchools => groupSchools.includes(user.schoolId!));
  }, [role, user, schoolGroups, originalUser]);


  useEffect(() => {
    if (!isLoading) {
      if (role === 'GlobalAdmin') {
        router.replace('/dashboard/global-admin');
      }
    }
  }, [role, isLoading, router]);

  if (isLoading || role === 'GlobalAdmin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="animate-in fade-in-50">
      {role === 'Admin' && isPremiumAdmin && <PremiumAdminDashboard />}
      {role === 'Admin' && !isPremiumAdmin && <AdminDashboard />}
      {role === 'Teacher' && <TeacherDashboard />}
      {role === 'Student' && <StudentDashboard />}
      {role === 'Parent' && <ParentDashboard />}
    </div>
  );
}
