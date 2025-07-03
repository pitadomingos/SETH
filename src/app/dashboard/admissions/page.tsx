
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { admissionsData } from '@/lib/mock-data';
import { MoreHorizontal, Check, X, FileText, UserPlus } from 'lucide-react';

export default function AdmissionsPage() {
  const { role } = useAuth();
  const router = useRouter();

  if (role && role !== 'Admin') {
      router.push('/dashboard');
      return null;
  }
  
  const stats = admissionsData.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, { Pending: 0, Approved: 0, Rejected: 0 });

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Admissions</h2>
            <p className="text-muted-foreground">Manage student admission applications and enrollment.</p>
        </div>
        <Button><UserPlus className="mr-2 h-4 w-4"/>New Application</Button>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.Pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.Approved}</div>
             <p className="text-xs text-muted-foreground">Ready for enrollment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.Rejected}</div>
             <p className="text-xs text-muted-foreground">Did not meet criteria</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>A list of the latest admission applications.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Applicant Name</TableHead>
                        <TableHead>Applied For</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {admissionsData.map((application) => (
                        <TableRow key={application.id}>
                            <TableCell className="font-medium">{application.name}</TableCell>
                            <TableCell>{application.appliedFor}</TableCell>
                            <TableCell>{application.date}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    application.status === 'Approved' ? 'secondary' :
                                    application.status === 'Rejected' ? 'destructive' : 'outline'
                                }>{application.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Application</DropdownMenuItem>
                                        <DropdownMenuItem>Approve</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Reject</DropdownMenuItem>
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
