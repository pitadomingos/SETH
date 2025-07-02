'use client';
import { useAuth } from '@/context/auth-context';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import TeacherDashboard from '@/components/dashboard/teacher-dashboard';
import StudentDashboard from '@/components/dashboard/student-dashboard';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="animate-in fade-in-50">
      {role === 'Admin' && <AdminDashboard />}
      {role === 'Teacher' && <TeacherDashboard />}
      {role === 'Student' && <StudentDashboard />}
    </div>
  );
}
