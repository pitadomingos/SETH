
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building, Users, Presentation, Settings, MoreHorizontal } from 'lucide-react';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function AllSchoolsPage() {
  const { role, isLoading: authLoading, switchSchoolContext } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, updateSchoolStatus } = useSchoolData();
  const router = useRouter();

  const isLoading = authLoading || schoolLoading;
  
  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  const handleManageSchool = (schoolId: string) => {
    switchSchoolContext(schoolId);
  };
  
  const handleStatusChange = (schoolId: string, status: SchoolProfile['status']) => {
    updateSchoolStatus(schoolId, status);
  };

  const getStatusVariant = (status: SchoolProfile['status']) => {
    switch (status) {
      case 'Active': return 'secondary';
      case 'Suspended': return 'default';
      case 'Inactive': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading || role !== 'GlobalAdmin' || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">All Schools Management</h2>
        <p className="text-muted-foreground">Oversee and manage all schools in the system.</p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(allSchoolData).map(school => (
            <Card key={school.profile.id}>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
                                <Image src={school.profile.logoUrl} alt={`${school.profile.name} Logo`} width={48} height={48} className="object-cover" data-ai-hint="school logo" />
                            </div>
                            <div>
                                <CardTitle>{school.profile.name}</CardTitle>
                                <CardDescription>{school.profile.address}</CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant={school.profile.tier === 'Premium' ? 'default' : school.profile.tier === 'Pro' ? 'secondary' : 'outline'}>
                                {school.profile.tier}
                            </Badge>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Badge variant={getStatusVariant(school.profile.status)} className="cursor-pointer">{school.profile.status}</Badge>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleStatusChange(school.profile.id, 'Active')}>Active</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(school.profile.id, 'Suspended')}>Suspended</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(school.profile.id, 'Inactive')}>Inactive</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                    <Button variant="outline" className="w-full" onClick={() => handleManageSchool(school.profile.id)}>
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
