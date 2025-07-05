
'use client';

import { useAuth } from '@/context/auth-context';
import { useSchoolData } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, Loader2, User, Building, Edit, Plus, Trash2, BarChart, LogIn } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const actionIcons = {
    Login: <LogIn className="h-4 w-4" />,
    Create: <Plus className="h-4 w-4" />,
    Update: <Edit className="h-4 w-4" />,
    Delete: <Trash2 className="h-4 w-4" />,
    Analysis: <BarChart className="h-4 w-4" />,
    Default: <History className="h-4 w-4" />,
};

const getActionIcon = (action: string) => {
    return actionIcons[action] || actionIcons.Default;
}

export default function ActivityLogsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { activityLogs, isLoading: dataLoading, allSchoolData } = useSchoolData();
  const router = useRouter();
  
  const isLoading = authLoading || dataLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Admin' && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const sortedLogs = useMemo(() => {
    return [...activityLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [activityLogs]);

  const getSchoolName = (schoolId: string) => {
    return allSchoolData?.[schoolId]?.profile.name || schoolId;
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
        <header>
            <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
            <p className="text-muted-foreground">
            {role === 'GlobalAdmin' ? 'A log of all activities across the entire system.' : 'A log of all recent activities within your school.'}
            </p>
        </header>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> Recent Activities</CardTitle>
                <CardDescription>Actions performed by users are recorded here for review.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Timestamp</TableHead>
                            {role === 'GlobalAdmin' && <TableHead>School</TableHead>}
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell className="text-muted-foreground text-xs">{formatDistanceToNow(log.timestamp, { addSuffix: true })}</TableCell>
                                {role === 'GlobalAdmin' && <TableCell className="font-medium">{getSchoolName(log.schoolId)}</TableCell>}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{log.user}</p>
                                            <p className="text-xs text-muted-foreground">{log.role}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="flex items-center gap-2">
                                        {getActionIcon(log.action)}
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell>{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
