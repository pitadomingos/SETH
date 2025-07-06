
'use client';
import { useAuth } from '@/context/auth-context';
import { useSchoolData, Message, NewMessageData } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, CheckCircle, Hourglass, MoreHorizontal, PlusCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const messageSchema = z.object({
  targetSchoolId: z.string({ required_error: "Please select a recipient." }),
  subject: z.string().min(3, "Subject is required."),
  body: z.string().min(10, "Message body must be at least 10 characters."),
});

type MessageFormValues = z.infer<typeof messageSchema>;

function ComposeMessageDialog() {
  const { addMessage, allSchoolData } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
        targetSchoolId: '',
        subject: '',
        body: ''
    }
  });
  
  const adminRecipients = useMemo(() => {
    if (!allSchoolData) return [];
    return Object.values(allSchoolData).map(school => ({
      schoolId: school.profile.id,
      adminName: school.profile.head,
      schoolName: school.profile.name,
    }));
  }, [allSchoolData]);

  function onSubmit(values: MessageFormValues) {
    const messageData: NewMessageData = {
      to: 'Admin',
      subject: values.subject,
      body: values.body,
      targetSchoolId: values.targetSchoolId,
    };
    addMessage(messageData);
    form.reset({
        targetSchoolId: '',
        subject: '',
        body: ''
    });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Compose Message</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compose Message</DialogTitle>
          <DialogDescription>
            Send a message to a School Administrator.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="targetSchoolId" render={({ field }) => ( <FormItem> <FormLabel>Recipient</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an administrator..." /></SelectTrigger></FormControl><SelectContent>{adminRecipients.map(r => <SelectItem key={r.schoolId} value={r.schoolId}>{r.adminName} ({r.schoolName})</SelectItem>)}</SelectContent></Select> <FormMessage /></FormItem> )} />
            <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="body" render={({ field }) => ( <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem> )} />
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Send Message
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function GlobalMessagingPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: dataLoading, updateMessageStatus } = useSchoolData();
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
      <header className="flex flex-wrap gap-2 justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Messaging</h2>
            <p className="text-muted-foreground">
              Messages from School Administrators across the network.
            </p>
        </div>
        <ComposeMessageDialog />
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail /> Incoming Messages</CardTitle>
          <CardDescription>Review messages from school admins and manage their status.</CardDescription>
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
                <TableHead><span className="sr-only">Actions</span></TableHead>
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
                  <TableCell colSpan={6} className="h-24 text-center">No messages yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
