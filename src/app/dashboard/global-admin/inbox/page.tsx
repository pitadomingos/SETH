
'use client';
import { useAuth } from '@/context/auth-context';
import { useSchoolData, Message, NewMessageData } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, CheckCircle, Hourglass, MoreHorizontal, PlusCircle, Eye, Paperclip, Send } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const messageSchema = z.object({
  targetSchoolId: z.string({ required_error: "Please select a recipient." }),
  subject: z.string().min(3, "Subject is required."),
  body: z.string().min(10, "Message body must be at least 10 characters."),
  attachmentUrl: z.string().optional(),
  attachmentName: z.string().optional(),
});

type MessageFormValues = z.infer<typeof messageSchema>;

function ComposeMessageDialog() {
  const { addMessage, allSchoolData } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      attachmentUrl: values.attachmentUrl,
      attachmentName: values.attachmentName,
    };
    addMessage(messageData);
    form.reset({
        targetSchoolId: '',
        subject: '',
        body: ''
    });
    setIsOpen(false);
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      form.setValue('attachmentUrl', `https://placehold.co/400x200.png?text=${encodeURIComponent(file.name)}`);
      form.setValue('attachmentName', file.name);
    }
  };

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
            <FormItem>
              <FormLabel>Attachment</FormLabel>
              <FormControl>
                <Input type="file" ref={fileInputRef} onChange={handleFileChange} />
              </FormControl>
            </FormItem>
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

function ViewMessageDialog({ message }: { message: Message & { schoolName: string } }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{message.subject}</DialogTitle>
          <DialogDescription>
            From: {message.fromUserName} ({message.schoolName})
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="p-4 bg-muted rounded-md max-h-64 overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">{message.body}</p>
          </div>
          {message.attachmentUrl && (
             <Button asChild variant="outline">
                <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer">
                    <Paperclip className="mr-2 h-4 w-4" /> {message.attachmentName || 'View Attachment'}
                </a>
            </Button>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
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
  
  const allMessages = useMemo(() => {
    if (!allSchoolData) return [];
    return Object.values(allSchoolData).flatMap(school => 
      school.messages.map(m => ({...m, schoolName: school.profile.name}))
    ).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [allSchoolData]);

  const inboxMessages = allMessages.filter(m => m.to === 'Developer');
  const sentMessages = allMessages.filter(m => m.fromUserRole === 'GlobalAdmin');

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
            <h2 className="text-3xl font-bold tracking-tight">Messaging Center</h2>
            <p className="text-muted-foreground">
              Communicate with School Administrators across the network.
            </p>
        </div>
        <ComposeMessageDialog />
      </header>

      <Tabs defaultValue="inbox">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inbox">Inbox ({inboxMessages.length})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({sentMessages.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">
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
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inboxMessages.length > 0 ? inboxMessages.map(msg => (
                        <TableRow key={msg.id}>
                          <TableCell className="font-medium">{msg.schoolName}</TableCell>
                          <TableCell>
                            <div className="font-medium">{msg.fromUserName}</div>
                            <div className="text-sm text-muted-foreground">{msg.fromUserRole}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                               {msg.attachmentUrl && <Paperclip className="h-4 w-4 text-muted-foreground" />}
                               <p className="font-medium">{msg.subject}</p>
                            </div>
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
                             <div className="flex items-center justify-end gap-2">
                                <ViewMessageDialog message={msg} />
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
                            </div>
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
        </TabsContent>
         <TabsContent value="sent">
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Send /> Sent Messages</CardTitle>
                  <CardDescription>A record of messages you have sent to administrators.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>To</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Sent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sentMessages.length > 0 ? sentMessages.map(msg => (
                        <TableRow key={msg.id}>
                          <TableCell className="font-medium">{msg.to}</TableCell>
                          <TableCell>{msg.schoolName}</TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2">
                               {msg.attachmentUrl && <Paperclip className="h-4 w-4 text-muted-foreground" />}
                               <p className="font-medium">{msg.subject}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">{formatDistanceToNow(msg.timestamp, { addSuffix: true })}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">No sent messages yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
