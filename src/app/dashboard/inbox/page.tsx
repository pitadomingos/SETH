
'use client';
import { useAuth } from '@/context/auth-context';
import { useSchoolData, Message } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, MoreHorizontal, CheckCircle, Hourglass } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export default function MessagingPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { messages, updateMessageStatus, isLoading: dataLoading } = useSchoolData();
  const router = useRouter();
  
  const isLoading = authLoading || dataLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const adminMessages = useMemo(() => {
    return messages.filter(m => m.to === 'Admin').sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [messages]);

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
        <h2 className="text-3xl font-bold tracking-tight">Messaging</h2>
        <p className="text-muted-foreground">
          Messages from staff members.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail /> Incoming Messages</CardTitle>
          <CardDescription>Review messages and mark them as resolved.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminMessages.length > 0 ? adminMessages.map(msg => (
                <TableRow key={msg.id}>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => updateMessageStatus(msg.id, 'Pending')} disabled={msg.status === 'Pending'}>
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateMessageStatus(msg.id, 'Resolved')} disabled={msg.status === 'Resolved'}>
                          Mark as Resolved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
