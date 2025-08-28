
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building, Users, Presentation, Settings, Search, PlusCircle, MoreHorizontal, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { NewSchoolDialog, EditSchoolDialog, DeleteSchoolDialog } from '@/components/global-admin/new-school-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUsersFromFirestore } from '@/lib/firebase/firestore-service';

const PAGE_SIZE = 10;

export default function AllSchoolsPage() {
  const { role, isLoading: authLoading, impersonateUser } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, updateSchoolStatus, removeSchool } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState({});

  useEffect(() => {
    async function fetchUsers() {
      const users = await getUsersFromFirestore();
      setAllUsers(users);
    }
    fetchUsers();
  }, []);

  const isLoading = authLoading || schoolLoading;
  
  const filteredSchools = useMemo(() => {
    if (!allSchoolData) return [];
    return Object.values(allSchoolData).filter(school =>
      school && school.profile && school.profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allSchoolData, searchTerm]);

  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredSchools.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredSchools, currentPage]);

  const totalPages = Math.ceil(filteredSchools.length / PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
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
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);


  if (isLoading || role !== 'GlobalAdmin' || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">All Schools Management</h2>
            <p className="text-muted-foreground">Oversee and manage all schools in the system.</p>
        </div>
        <NewSchoolDialog />
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle>All Schools ({filteredSchools.length})</CardTitle>
            <CardDescription>A complete list of every school in the system.</CardDescription>
             <div className="relative pt-4">
                <Search className="absolute left-2.5 top-6.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search schools by name..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>School Name</TableHead>
                        <TableHead>Head of School</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedSchools.map(school => {
                       const schoolUsers = Object.values(allUsers).filter((u:any) => u.user.schoolId === school.profile.id && u.user.role !== 'Student' && u.user.role !== 'Parent');
                       return (
                        <TableRow key={school.profile.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image src={school.profile.logoUrl} alt={school.profile.name} width={40} height={40} className="rounded-sm" data-ai-hint="school logo"/>
                                    <span className="font-medium">{school.profile.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{school.profile.head}</TableCell>
                            <TableCell>{school.profile.address}</TableCell>
                            <TableCell><Badge variant={school.profile.tier === 'Premium' ? 'default' : school.profile.tier === 'Pro' ? 'secondary' : 'outline'}>{school.profile.tier}</Badge></TableCell>
                            <TableCell>{school.students.length}</TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <LogIn className="mr-2 h-4 w-4" />
                                                <span>Impersonate User</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                {schoolUsers.map((u: any) => (
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
                            </TableCell>
                        </TableRow>
                    )})}
                     {paginatedSchools.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">No schools found matching your search.</TableCell>
                        </TableRow>
                     )}
                </TableBody>
            </Table>
        </CardContent>
        {totalPages > 1 && (
            <CardFooter className="flex items-center justify-end space-x-2 border-t pt-4">
                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next <ChevronRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
