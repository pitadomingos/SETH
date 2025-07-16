
'use client';
import { useAuth } from '@/context/auth-context';
import { useSchoolData, Message, NewMessageData } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Reply, Paperclip, Send, PlusCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const messageSchema = z.object({
  recipientUsername: z.string({ required_error: "Please select a recipient." }),
  subject: z.string().min(3, "Subject is required."),
  body: z.string().min(10, "Message body must be at least 10 characters long."),
  attachmentUrl: z.string().optional(),
  attachmentName: z.string().optional(),
});
type MessageFormValues = z.infer<typeof messageSchema>;

interface PrefillData {
  recipientUsername?: string;
  subject?: string;
  body?: string;
}

function ComposeMessageDialog({ open, onOpenChange, replyTo, prefillData }: { open?: boolean, onOpenChange?: (open: boolean) => void, replyTo?: Message, prefillData?: PrefillData }) {
  const { addMessage, teachersData, studentsData, schoolProfile, coursesData, classesData } = useSchoolData();
  const { user, role } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
  });
  
  useEffect(() => {
    let defaultValues: Partial<MessageFormValues> = { body: '', attachmentName: '', attachmentUrl: '' };

    if (replyTo) {
      defaultValues.recipientUsername = replyTo.senderUsername;
      defaultValues.subject = `Re: ${replyTo.subject}`;
    } else if (prefillData) {
      defaultValues.recipientUsername = prefillData.recipientUsername;
      defaultValues.subject = prefillData.subject;
      defaultValues.body = prefillData.body;
    }
    form.reset(defaultValues);
  }, [replyTo, prefillData, open, form]);

  const recipientList = useMemo(() => {
    if (!user || !role) return [];
    
    if (role === 'Admin') {
      return teachersData.map(t => ({ value: t.email, label: `${t.name} (Teacher)` }));
    }
    
    if (role === 'Teacher') {
        const adminEmail = schoolProfile?.email || '';
        const adminName = schoolProfile?.head || 'Administrator';
        
        const parentSet = new Set<string>();
        const teacherId = teachersData.find(t => t.email === user.email)?.id;
        const teacherCourses = coursesData.filter(c => c.teacherId === teacherId);
        const teacherClassIds = teacherCourses.map(c => c.classId);
        
        const taughtStudents = studentsData.filter(s => {
            const studentClass = classesData.find(c => c.grade === s.grade && c.name.split('-')[1].trim() === s.class);
            return studentClass && teacherClassIds.includes(studentClass.id);
        });

        taughtStudents.forEach(s => {
            if (s.parentEmail) parentSet.add(s.parentEmail);
        });
        
        const parents = Array.from(parentSet).map(email => {
            const student = studentsData.find(s => s.parentEmail === email);
            return { value: email, label: `${student?.parentName} (Parent)` };
        });

        const recipients = [...parents];
        if (adminEmail) recipients.unshift({ value: adminEmail, label: `${adminName} (Admin)` });
        return recipients;
    }

    if (role === 'Parent') {
        const adminEmail = schoolProfile?.email || '';
        const adminName = schoolProfile?.head || 'Administrator';
        const children = studentsData.filter(s => s.parentEmail === user.email);
        const teacherSet = new Set<string>();
        children.forEach(child => {
            const studentClass = classesData.find(c => c.grade === child.grade && c.name.split('-')[1].trim() === child.class);
            if(studentClass) {
                const teachers = coursesData.filter(course => course.classId === studentClass.id).map(c => c.teacherId);
                teachers.forEach(teacherId => {
                    const teacher = teachersData.find(t => t.id === teacherId);
                    if (teacher) teacherSet.add(teacher.email);
                });
            }
        });

        const teachers = Array.from(teacherSet).map(email => {
            const teacher = teachersData.find(t => t.email === email);
            return { value: email, label: `${teacher?.name} (Teacher)` };
        });

        const recipients = [...teachers];
        if(adminEmail) recipients.unshift({ value: adminEmail, label: `${adminName} (Admin)` });
        return recipients;
    }

    return [];
  }, [role, user, teachersData, studentsData, schoolProfile, coursesData, classesData]);

  function onSubmit(values: MessageFormValues) {
    const messageData: NewMessageData = {
      recipientUsername: values.recipientUsername,
      subject: values.subject,
      body: values.body,
      attachmentUrl: values.attachmentUrl,
      attachmentName: values.attachmentName,
    };
    addMessage(messageData);
    form.reset();
    onOpenChange?.(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      form.setValue('attachmentUrl', `https://placehold.co/400x200.png?text=${encodeURIComponent(file.name)}`);
      form.setValue('attachmentName', file.name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{replyTo ? 'Reply to Message' : 'Compose Message'}</DialogTitle>
          <DialogDescription>
            {replyTo ? `Replying about "${replyTo.subject}"` : "Send a message to a member of the school."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="recipientUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={!!replyTo || !!prefillData?.recipientUsername}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a recipient..." /></SelectTrigger></FormControl>
                    <SelectContent>{recipientList.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="body" render={({ field }) => ( <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem> )} />
             <FormItem>
              <FormLabel>Attachment</FormLabel>
              <FormControl><Input type="file" ref={fileInputRef} onChange={handleFileChange} /></FormControl>
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

function ViewMessageDialog({ message, onReply }: { message: Message, onReply: (message: Message) => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4"/> View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{message.subject}</DialogTitle>
          <DialogDescription>From: {message.senderName} ({message.senderRole})</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="p-4 bg-muted rounded-md max-h-48 overflow-y-auto">
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
          <DialogClose asChild><Button type="button" variant="secondary">Close</Button></DialogClose>
          <DialogClose asChild><Button onClick={() => onReply(message)}><Reply className="mr-2 h-4 w-4" /> Reply</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MessagingPage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const { messages, schoolProfile, isLoading: dataLoading } = useSchoolData();
  const router = useRouter();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | undefined>(undefined);
  const [prefillData, setPrefillData] = useState<PrefillData | undefined>(undefined);

  const isLoading = authLoading || dataLoading;

  useEffect(() => {
    if (!isLoading && !['Admin', 'Teacher', 'Parent'].includes(role || '')) {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  useEffect(() => {
    const storedPrefill = sessionStorage.getItem('prefillMessage');
    if (storedPrefill) {
      try {
        const parsedData = JSON.parse(storedPrefill);
        const adminEmail = schoolProfile?.email || '';
        setPrefillData({ ...parsedData, recipientUsername: adminEmail });
        setIsComposeOpen(true);
      } catch (e) {
        console.error("Failed to parse prefill data", e);
      } finally {
        sessionStorage.removeItem('prefillMessage');
      }
    }
  }, [schoolProfile]);

  const { inboxMessages, sentMessages } = useMemo(() => {
    if (!user) return { inboxMessages: [], sentMessages: [] };
    
    const userIdentifier = user.email;

    const inbox = messages
      .filter(m => m.recipientUsername === userIdentifier)
      .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());

    const sent = messages
      .filter(m => m.senderUsername === userIdentifier)
      .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
      
    return { inboxMessages: inbox, sentMessages: sent };
  }, [messages, user]);
  
  const handleReply = (message: Message) => {
    setReplyToMessage(message);
    setPrefillData(undefined);
    setIsComposeOpen(true);
  };
  
  const handleOpenCompose = () => {
    setReplyToMessage(undefined);
    setPrefillData(undefined);
    setIsComposeOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Clear any state when dialog is closed
      setReplyToMessage(undefined);
      setPrefillData(undefined);
    }
    setIsComposeOpen(open);
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap gap-2 justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Messaging Center</h2>
            <p className="text-muted-foreground">Communicate with staff and parents.</p>
        </div>
        <Button onClick={handleOpenCompose}><PlusCircle className="mr-2 h-4 w-4" /> Compose Message</Button>
        <ComposeMessageDialog open={isComposeOpen} onOpenChange={handleDialogChange} replyTo={replyToMessage} prefillData={prefillData} />
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
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>From</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inboxMessages.length > 0 ? inboxMessages.map(msg => (
                        <TableRow key={msg.id}>
                          <TableCell>
                            <div className="font-medium">{msg.senderName}</div>
                            <div className="text-sm text-muted-foreground">{msg.senderRole}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                               {msg.attachmentUrl && <Paperclip className="h-4 w-4 text-muted-foreground" />}
                               <p className="font-medium">{msg.subject}</p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">{msg.body}</p>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">{formatDistanceToNow(msg.timestamp, { addSuffix: true })}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <ViewMessageDialog message={msg} onReply={handleReply} />
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">Your inbox is empty.</TableCell>
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
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>To</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Sent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sentMessages.length > 0 ? sentMessages.map(msg => (
                        <TableRow key={msg.id}>
                          <TableCell>
                             <div className="font-medium">{msg.recipientName}</div>
                             <div className="text-sm text-muted-foreground">{msg.recipientRole}</div>
                          </TableCell>
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
                          <TableCell colSpan={3} className="h-24 text-center">You haven't sent any messages.</TableCell>
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
