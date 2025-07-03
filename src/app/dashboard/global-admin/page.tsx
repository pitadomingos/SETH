'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building, Users, Presentation, Settings } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';

export default function GlobalAdminDashboard() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();

  const isLoading = authLoading || schoolLoading;

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (role !== 'GlobalAdmin') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Global Administration</h2>
        <p className="text-muted-foreground">Manage all schools in the EduManage system.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(allSchoolData).map(school => (
            <Card key={school.profile.id}>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                            <Building className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>{school.profile.name}</CardTitle>
                            <CardDescription>{school.profile.address}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{school.students.length} Students</span>
                    </div>
                     <div className="flex items-center text-sm text-muted-foreground">
                        <Presentation className="mr-2 h-4 w-4" />
                        <span>{school.teachers.length} Teachers</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Manage School
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
