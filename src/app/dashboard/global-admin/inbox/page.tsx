
'use client';
import { useAuth } from '@/context/auth-context';
import { useSchoolData, Message } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, CheckCircle, Hourglass } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function GlobalInboxPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: dataLoading } = useSchoolData();
  const router = useRouter();
  
  const isLoading = authLoading || dataLoading;

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  const developerMessages = useMemo(() => {
    if (!allSchoolData) return [];
    return Object.values(allSchoolData).flatMap(school => 
      school.messages
        .filter(m => m.to === 'Developer')
        .map(m => ({...m, schoolName: school.profile.name}))
    ).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [allSchoolData]);

  const getStatusVariant = (status: Message['status']) => {
    return status === 'Resolved' ? 'secondary' : 'default';
  };

  const getStatusIcon = (status: Message['status']) => {
    return status === 'Resolved' ? <CheckCircle className="h-4 w-4" /> : <Hourglass className="h-4 w-4" />;
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Developer Inbox</h2>
        <p className="text-muted-foreground">
          Messages from School Administrators across the network.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail /> Incoming Messages</CardTitle>
          <CardDescription>This inbox is read-only in the prototype. Status updates are not supported for the developer role yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {developerMessages.length > 0 ? developerMessages.map(msg => (
                <TableRow key={msg.id}>
                  <TableCell className="font-medium">{msg.schoolName}</TableCell>
                  <TableCell>
                    <div className="font-medium">{msg.fromUserName}</div>
                    <div className="text-sm text-muted-foreground">{msg.fromUserRole}</div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{msg.subject}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">{msg.body}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatDistanceToNow(msg.timestamp, { addSuffix: true })}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(msg.status)} className="flex items-center gap-2">
                      {getStatusIcon(msg.status)}
                      {msg.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">No messages yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
