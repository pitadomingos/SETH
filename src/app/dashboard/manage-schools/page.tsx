'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building, Users, Presentation, Settings, Search, PlusCircle, LogIn } from 'lucide-react';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { NewSchoolDialog, EditSchoolDialog, DeleteSchoolDialog } from '@/components/global-admin/new-school-dialog';
import { mockUsers } from '@/lib/mock-data';

export default function ManageSchoolsPage() {
  const { role, user, isLoading: authLoading, impersonateUser } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, schoolGroups, updateSchoolStatus, removeSchool } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const isLoading = authLoading || schoolLoading;

  const userGroupId = useMemo(() => {
    if (!user || !user.schoolId || !schoolGroups) return null;
    return Object.keys(schoolGroups).find(groupId => schoolGroups[groupId].includes(user.schoolId!));
  }, [user, schoolGroups]);

  const schoolsToDisplay = useMemo(() => {
    if (!allSchoolData) return [];
    if (role === 'GlobalAdmin') {
        return Object.values(allSchoolData);
    }
    if (role === 'Admin' && userGroupId && schoolGroups[userGroupId]) {
        return schoolGroups[userGroupId].map(id => allSchoolData[id]).filter(Boolean);
    }
    return [];
  }, [allSchoolData, role, userGroupId, schoolGroups]);
  
  const filteredSchools = useMemo(() => {
    return schoolsToDisplay.filter(school =>
      school.profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [schoolsToDisplay, searchTerm]);
  
  const handleImpersonate = (email: string, role: any) => {
    impersonateUser(email, role);
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

  useEffect(() => {
    const isPremiumAdmin = role === 'Admin' && !!userGroupId;
    if (!isLoading && role !== 'GlobalAdmin' && !isPremiumAdmin) {
        router.push('/dashboard');
    }
  }, [role, isLoading, userGroupId, router]);


  if (isLoading || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const pageTitle = role === 'GlobalAdmin' ? 'All Schools Management' : 'Group School Management';
  const pageDescription = role === 'GlobalAdmin' ? 'Oversee and manage all schools in the system.' : 'Oversee and manage all schools in your group.';

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">{pageTitle}</h2>
            <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        <NewSchoolDialog groupId={role === 'Admin' ? userGroupId || undefined : undefined} />
      </header>

       <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search schools by name..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSchools.map(school => {
            const schoolUsers = Object.values(mockUsers).filter(u => u.user.schoolId === school.profile.id && u.user.role !== 'Student' && u.user.role !== 'Parent');
            return (
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
                <CardFooter className="flex justify-between items-center">
                    <div className="flex w-full justify-between items-center">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Manage
                                </Button>
                            </DropdownMenuTrigger>
                             <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        <span>Impersonate User</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                        {schoolUsers.map(u => (
                                             <DropdownMenuItem key={u.user.email} onClick={() => handleImpersonate(u.user.email, u.user.role)}>
                                                {u.user.name} ({u.user.role})
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <EditSchoolDialog school={school.profile} />
                                <DeleteSchoolDialog schoolId={school.profile.id} schoolName={school.profile.name} removeSchool={removeSchool} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardFooter>
            </Card>
        )})}
        {filteredSchools.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-10">No schools found matching your search.</p>
        )}
      </div>
    </div>
  );
}
