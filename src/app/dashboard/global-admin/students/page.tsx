
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, GraduationCap, MoreHorizontal, Search, TrendingUp, CheckCircle, ArrowRightLeft, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { useSchoolData, Student } from '@/context/school-data-context';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getGpaFromNumeric } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const PAGE_SIZE = 10;

export default function GlobalStudentsPage() {
  const { role, isLoading: authLoading, impersonateUser } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, updateStudentStatus } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = authLoading || schoolLoading;

  const allStudents = useMemo(() => {
    if (!allSchoolData) return [];
    return Object.values(allSchoolData).flatMap(school => 
      school.students.map(student => ({
        ...student,
        schoolName: school.profile.name,
        schoolId: school.profile.id,
      }))
    );
  }, [allSchoolData]);

  const availableGrades = useMemo(() => {
    const grades = new Set(allStudents.map(student => student.grade));
    return ['all', ...Array.from(grades).sort((a, b) => parseInt(a) - parseInt(b))];
  }, [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
        return matchesSearch && matchesGrade;
    });
  }, [allStudents, searchTerm, selectedGrade]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);

  const summaryStats = useMemo(() => {
    if (!allSchoolData) return { overallAvgGpa: 0, activeStudents: 0, transferredStudents: 0 };
    
    const allGrades = Object.values(allSchoolData).flatMap(school => school.grades);
    let overallAvgGpa = 0;
    if(allGrades.length > 0) {
        const totalGpaPoints = allGrades.reduce((acc, g) => acc + getGpaFromNumeric(parseFloat(g.grade)), 0);
        overallAvgGpa = totalGpaPoints / allGrades.length;
    }
    
    const activeStudents = allStudents.filter(s => s.status === 'Active').length;
    const transferredStudents = allStudents.filter(s => s.status === 'Transferred').length;
    
    return {
      overallAvgGpa: overallAvgGpa.toFixed(2),
      activeStudents,
      transferredStudents,
    }
  }, [allSchoolData, allStudents]);

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

  const handleStatusChange = (schoolId: string, studentId: string, status: Student['status']) => {
    updateStudentStatus(schoolId, studentId, status);
  };
  
  const handleImpersonate = (email: string) => {
    impersonateUser(email, 'Student');
  }

  const getStatusVariant = (status: Student['status']) => {
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
        <h2 className="text-3xl font-bold tracking-tight">Global Student Management</h2>
        <p className="text-muted-foreground">View and manage all students across the entire school network.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle><GraduationCap className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{allStudents.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Network Avg. GPA</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{summaryStats.overallAvgGpa}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Students</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-500">{summaryStats.activeStudents}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Transferred Students</CardTitle><ArrowRightLeft className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{summaryStats.transferredStudents}</div></CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
          <CardDescription>A complete list of every student enrolled in the system.</CardDescription>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by student, school, or parent..."
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
                <TableHead>School</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map(student => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.schoolName}</TableCell>
                  <TableCell>Grade {student.grade} - {student.class}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(student.status)}>{student.status}</Badge>
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
                        <DropdownMenuItem onClick={() => handleImpersonate(student.email)}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Log in as User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(student.schoolId, student.id, 'Active')}>Active</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(student.schoolId, student.id, 'Inactive')}>Inactive</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(student.schoolId, student.id, 'Transferred')}>Transferred</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredStudents.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No students found matching your search.</p>
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
