'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MoreHorizontal, Search, Presentation, CheckCircle, XCircle, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { useSchoolData, Teacher } from '@/context/school-data-context';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

const PAGE_SIZE = 10;

export default function GlobalTeachersPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, updateTeacherStatus } = useSchoolData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = authLoading || schoolLoading;

  const allTeachers = useMemo(() => {
    if (!allSchoolData) return [];
    return Object.values(allSchoolData).flatMap(school => 
      school.teachers.map(teacher => ({
        ...teacher,
        schoolName: school.profile.name,
        schoolId: school.profile.id,
      }))
    );
  }, [allSchoolData]);

  const filteredTeachers = useMemo(() => {
    return allTeachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allTeachers, searchTerm]);

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredTeachers.slice(startIndex, endIndex);
  }, [filteredTeachers, currentPage]);

  const totalPages = Math.ceil(filteredTeachers.length / PAGE_SIZE);

  const summaryStats = useMemo(() => {
    const activeTeachers = allTeachers.filter(t => t.status === 'Active').length;
    const inactiveTeachers = allTeachers.length - activeTeachers;
    const uniqueSubjects = new Set(allTeachers.map(t => t.subject)).size;
    return {
      totalTeachers: allTeachers.length,
      activeTeachers,
      inactiveTeachers,
      uniqueSubjects
    };
  }, [allTeachers]);

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading || role !== 'GlobalAdmin' || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const handleStatusChange = (schoolId: string, teacherId: string, status: Teacher['status']) => {
    updateTeacherStatus(schoolId, teacherId, status);
  };

  const getStatusVariant = (status: Teacher['status']) => {
    switch (status) {
      case 'Active': return 'secondary';
      case 'Transferred': return 'outline';
      case 'Inactive': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Global Teacher Management</h2>
        <p className="text-muted-foreground">Oversee and manage all teaching staff across the network.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Teachers</CardTitle><Presentation className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{summaryStats.totalTeachers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Teachers</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-500">{summaryStats.activeTeachers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Inactive/Transferred</CardTitle><XCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-500">{summaryStats.inactiveTeachers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Subject Diversity</CardTitle><Briefcase className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{summaryStats.uniqueSubjects}</div></CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Teachers ({filteredTeachers.length})</CardTitle>
          <CardDescription>A complete list of every teacher in the system.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by teacher, school, or subject..."
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
                <TableHead>Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeachers.map(teacher => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.schoolName}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(teacher.status)}>{teacher.status}</Badge>
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
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(teacher.schoolId, teacher.id, 'Active')}>Active</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(teacher.schoolId, teacher.id, 'Inactive')}>Inactive</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(teacher.schoolId, teacher.id, 'Transferred')}>Transferred</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTeachers.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No teachers found matching your search.</p>
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
