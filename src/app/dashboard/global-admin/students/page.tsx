
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, GraduationCap, MoreHorizontal, Search } from 'lucide-react';
import { useSchoolData, Student } from '@/context/school-data-context';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

export default function GlobalStudentsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, updateStudentStatus } = useSchoolData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allStudents, searchTerm]);

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'GlobalAdmin' || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const handleStatusChange = (schoolId: string, studentId: string, status: Student['status']) => {
    updateStudentStatus(schoolId, studentId, status);
  };

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
      
      <Card>
        <CardHeader>
          <CardTitle>All Students ({allStudents.length})</CardTitle>
          <CardDescription>A complete list of every student enrolled in the system.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by student, school, or parent..."
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
                <TableHead>Grade</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map(student => (
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
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
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
      </Card>
    </div>
  );
}
