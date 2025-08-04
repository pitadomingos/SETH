
'use client';

import { useAuth } from '@/context/auth-context';
import { useSchoolData } from '@/context/school-data-context';
import { useRouter } from '@/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, Loader2, User, Building, Edit, Plus, Trash2, BarChart, LogIn, Search, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';

const actionIcons = {
    Login: <LogIn className="h-4 w-4" />,
    Create: <Plus className="h-4 w-4" />,
    Update: <Edit className="h-4 w-4" />,
    Delete: <Trash2 className="h-4 w-4" />,
    Analysis: <BarChart className="h-4 w-4" />,
    Message: <Mail className="h-4 w-4" />,
    Default: <History className="h-4 w-4" />,
};

const getActionIcon = (action: string) => {
    return actionIcons[action] || actionIcons.Default;
}

export default function ActivityLogsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { activityLogs, isLoading: dataLoading, allSchoolData } = useSchoolData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const isLoading = authLoading || dataLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Admin' && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const sortedLogs = useMemo(() => {
    return [...activityLogs].sort((a, b) => {
        const dateA = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
    });
  }, [activityLogs]);

  const filteredLogs = useMemo(() => {
    return sortedLogs.filter(log =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedLogs, searchTerm]);

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
                 <div className="relative mt-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search logs..."
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
                            <TableHead className="w-[150px]">Timestamp</TableHead>
                            {role === 'GlobalAdmin' && <TableHead>School</TableHead>}
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell className="text-muted-foreground text-xs">{formatDistanceToNow(log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp), { addSuffix: true })}</TableCell>
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
                {filteredLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-10">No logs found matching your search.</p>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
