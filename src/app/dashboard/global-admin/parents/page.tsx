
'use client';

import { useAuth, mockUsers } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MoreHorizontal, Search, HeartHandshake, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const PAGE_SIZE = 10;

export default function GlobalParentsPage() {
  const { role, isLoading: authLoading, impersonateUser } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, parentStatusOverrides, updateParentStatus } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = authLoading || schoolLoading;

  const allParents = useMemo(() => {
    if (!allSchoolData) return [];
    
    const parentMap = new Map();

    Object.values(allSchoolData).forEach(school => {
      school.students.forEach(student => {
        if (student.parentEmail) {
          if (!parentMap.has(student.parentEmail)) {
            parentMap.set(student.parentEmail, {
              name: student.parentName,
              email: student.parentEmail,
              children: [],
              schools: new Set(),
            });
          }
          const parent = parentMap.get(student.parentEmail);
          parent.children.push({ name: student.name, grade: student.grade });
          parent.schools.add(school.profile.name);
        }
      });
    });

    return Array.from(parentMap.values()).map(p => ({
      ...p,
      schools: Array.from(p.schools).join(', '),
      status: parentStatusOverrides[p.email] || 'Active',
      childrenGrades: [...new Set(p.children.map(c => c.grade))]
    }));
  }, [allSchoolData, parentStatusOverrides]);

  const availableGrades = useMemo(() => {
    if (!allParents) return [];
    const grades = new Set(allParents.flatMap(p => p.childrenGrades));
    return ['all', ...Array.from(grades).sort((a, b) => parseInt(a) - parseInt(b))];
  }, [allParents]);
  
  const filteredParents = useMemo(() => {
    return allParents.filter(parent => {
      const matchesSearch = parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.schools.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = selectedGrade === 'all' || parent.childrenGrades.includes(selectedGrade);
      return matchesSearch && matchesGrade;
    });
  }, [allParents, searchTerm, selectedGrade]);

  const paginatedParents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredParents.slice(startIndex, endIndex);
  }, [filteredParents, currentPage]);

  const totalPages = Math.ceil(filteredParents.length / PAGE_SIZE);

  const summaryStats = useMemo(() => {
    const totalChildren = allParents.reduce((acc, parent) => acc + parent.children.length, 0);
    const activeParents = allParents.filter(p => p.status === 'Active').length;
    const suspendedParents = allParents.length - activeParents;
    return {
      totalParents: allParents.length,
      totalChildren,
      activeParents,
      suspendedParents,
    };
  }, [allParents]);

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGrade]);

  if (isLoading || role !== 'GlobalAdmin' || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const handleStatusChange = (email: string, status: 'Active' | 'Suspended') => {
    updateParentStatus(email, status);
  };
  
  const handleImpersonate = (email: string) => {
    const username = Object.keys(mockUsers).find(key => mockUsers[key].user.email === email);
    if (username) {
        impersonateUser(username);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find a login for this user.' });
    }
  }

  const getStatusVariant = (status: 'Active' | 'Suspended') => {
    return status === 'Active' ? 'secondary' : 'destructive';
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Global Parent Management</h2>
        <p className="text-muted-foreground">View and manage all parent accounts across the network.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Parents</CardTitle><HeartHandshake className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{summaryStats.totalParents}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Children Linked</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{summaryStats.totalChildren}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Accounts</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-500">{summaryStats.activeParents}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Suspended Accounts</CardTitle><XCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-500">{summaryStats.suspendedParents}</div></CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Parents ({filteredParents.length})</CardTitle>
          <CardDescription>A complete list of every parent with children enrolled in the system.</CardDescription>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search parent, email, or school..."
                className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by grade..." /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {availableGrades.filter(g => g !== 'all').map(grade => (
                        <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Children</TableHead>
                <TableHead>School(s)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedParents.map(parent => (
                <TableRow key={parent.email}>
                  <TableCell className="font-medium">{parent.name}</TableCell>
                  <TableCell>{parent.email}</TableCell>
                  <TableCell>{parent.children.length}</TableCell>
                  <TableCell>{parent.schools}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(parent.status)}>{parent.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleImpersonate(parent.email)}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Log in as User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(parent.email, 'Active')}>Active</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(parent.email, 'Suspended')}>Suspended</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredParents.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No parents found matching your search.</p>
          )}
        </CardContent>
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 p-4 border-t">
            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
