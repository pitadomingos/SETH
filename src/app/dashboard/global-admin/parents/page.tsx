
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, HeartHandshake, MoreHorizontal } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function GlobalParentsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, parentStatusOverrides, updateParentStatus } = useSchoolData();
  const router = useRouter();

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
          parent.children.push(student.name);
          parent.schools.add(school.profile.name);
        }
      });
    });

    return Array.from(parentMap.values()).map(p => ({
      ...p,
      schools: Array.from(p.schools).join(', '),
      status: parentStatusOverrides[p.email] || 'Active', // Get override or default to Active
    }));
  }, [allSchoolData, parentStatusOverrides]);


  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'GlobalAdmin' || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const handleStatusChange = (email: string, status: 'Active' | 'Suspended') => {
    updateParentStatus(email, status);
  };

  const getStatusVariant = (status: 'Active' | 'Suspended') => {
    return status === 'Active' ? 'secondary' : 'destructive';
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Global Parent Management</h2>
        <p className="text-muted-foreground">View and manage all parent accounts across the network.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>All Parents ({allParents.length})</CardTitle>
          <CardDescription>A complete list of every parent with children enrolled in the system.</CardDescription>
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
              {allParents.map(parent => (
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
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(parent.email, 'Active')}>Active</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(parent.email, 'Suspended')}>Suspended</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
