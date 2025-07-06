
'use client';
import { useAuth } from '@/context/auth-context';
import { useSchoolData, Message, NewMessageData } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, MoreHorizontal, CheckCircle, Hourglass, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const replySchema = z.object({
  body: z.string().min(10, "Reply must be at least 10 characters long."),
});
type ReplyFormValues = z.infer<typeof replySchema>;

function ViewAndReplyDialog({ message }: { message: Message }) {
  const { addMessage } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { body: '' },
  });

  function onSubmit(values: ReplyFormValues) {
    const replyData: NewMessageData = {
      to: 'Developer',
      subject: `Re: ${message.subject}`,
      body: values.body,
    };
    addMessage(replyData);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View & Reply</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{message.subject}</DialogTitle>
          <DialogDescription>
            From: {message.fromUserName} ({message.fromUserRole})
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="p-4 bg-muted rounded-md max-h-48 overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">{message.body}</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Reply</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type your reply here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Reply className="mr-2 h-4 w-4" />}
                  Send Reply
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
          Messages from staff members and developers.
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
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right space-x-2">
                    <ViewAndReplyDialog message={msg} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
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
