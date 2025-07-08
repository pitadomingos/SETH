
'use client';
import { useAuth, mockUsers } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building, Users, Presentation, Settings, School } from 'lucide-react';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function PremiumAdminDashboard() {
  const { role, user, isLoading: authLoading, impersonateUser } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, schoolGroups } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();

  const isLoading = authLoading || schoolLoading;
  
  const managedSchoolIds = useMemo(() => {
    if (!user || !user.groupId || !schoolGroups) return [];
    return schoolGroups[user.groupId] || [];
  }, [user, schoolGroups]);

  const managedSchools = useMemo(() => {
    if (!allSchoolData || managedSchoolIds.length === 0) return [];
    return managedSchoolIds.map(id => allSchoolData[id]).filter(Boolean);
  }, [allSchoolData, managedSchoolIds]);

  const summaryStats = useMemo(() => {
    const totalStudents = managedSchools.reduce((sum, school) => sum + school.students.length, 0);
    const totalTeachers = managedSchools.reduce((sum, school) => sum + school.teachers.length, 0);
    return {
      totalSchools: managedSchools.length,
      totalStudents,
      totalTeachers,
    };
  }, [managedSchools]);

  const handleManageSchool = (schoolId: string) => {
    const adminRecord = Object.values(mockUsers).find(
      (record) => record.user.schoolId === schoolId && record.role === 'Admin'
    );
    if (adminRecord) {
        impersonateUser(adminRecord.user.username);
    } else {
        toast({
            variant: 'destructive',
            title: "Operation Failed",
            description: `Could not find an administrator for this school.`,
        });
    }
  };

  useEffect(() => {
    if (!isLoading && role !== 'PremiumAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);


  if (isLoading || role !== 'PremiumAdmin' || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
        <header>
            <h2 className="text-3xl font-bold tracking-tight">Group Dashboard</h2>
            <p className="text-muted-foreground">Management overview for your school group.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                    <School className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summaryStats.totalSchools}</div>
                    <p className="text-xs text-muted-foreground">Schools in your group</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summaryStats.totalStudents.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Across all your schools</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                    <Presentation className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summaryStats.totalTeachers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Across all your schools</p>
                </CardContent>
            </Card>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Managed Schools</CardTitle>
                <CardDescription>Select a school to manage its operations.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {managedSchools.map(school => (
                    <Card key={school.profile.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
                                        <Image src={school.profile.logoUrl} alt={`${school.profile.name} Logo`} width={48} height={48} className="object-cover" data-ai-hint="school logo"/>
                                    </div>
                                    <div>
                                        <CardTitle>{school.profile.name}</CardTitle>
                                        <CardDescription>{school.profile.address}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant="secondary">{school.profile.status}</Badge>
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
                            <Button variant="outline" className="w-full" onClick={() => handleManageSchool(school.profile.id)}>
                                <Settings className="mr-2 h-4 w-4" />
                                Manage School
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                {managedSchools.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-10">No schools are assigned to your group.</p>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
