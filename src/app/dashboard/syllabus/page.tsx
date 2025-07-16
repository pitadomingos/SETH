
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, BookCopy, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSchoolData, Syllabus, SyllabusTopic } from '@/context/school-data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const syllabusSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  grade: z.string().min(1, "Grade is required."),
});
type SyllabusFormValues = z.infer<typeof syllabusSchema>;

const topicSchema = z.object({
    topic: z.string().min(3, "Topic title is required."),
    week: z.coerce.number().min(1).max(52),
    subtopics: z.string().min(3, "Subtopics are required."),
});
type TopicFormValues = z.infer<typeof topicSchema>;


function NewSyllabusDialog() {
  const { addSyllabus, subjects, syllabi } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<SyllabusFormValues>({ resolver: zodResolver(syllabusSchema) });

  const onSubmit = (values: SyllabusFormValues) => {
    if (syllabi.some(s => s.subject === values.subject && s.grade === values.grade)) {
      form.setError('root', { message: 'A syllabus for this subject and grade already exists.' });
      return;
    }
    addSyllabus(values);
    form.reset();
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Create Syllabus</Button></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Syllabus</DialogTitle>
          <DialogDescription>Define a new syllabus for a subject and grade level.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="subject" render={({ field }) => (<FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="grade" render={({ field }) => (<FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger></FormControl><SelectContent>{Array.from({ length: 12 }, (_, i) => i + 1).map(g => <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            {form.formState.errors.root && <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>}
            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Create</Button></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function TopicDialog({ syllabus, topic, children }: { syllabus: Syllabus, topic?: SyllabusTopic, children: React.ReactNode }) {
  const { updateSyllabusTopic } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: topic
      ? { ...topic, subtopics: topic.subtopics.join('\n') }
      : { topic: '', week: 1, subtopics: '' }
  });

  const onSubmit = (values: TopicFormValues) => {
    const topicData = {
      ...values,
      subtopics: values.subtopics.split('\n').filter(s => s.trim() !== ''),
      id: topic?.id || `T${Date.now()}`
    };
    updateSyllabusTopic(syllabus.subject, syllabus.grade, topicData);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{topic ? 'Edit' : 'Add'} Topic</DialogTitle>
          <DialogDescription>Add or edit a weekly topic for {syllabus.subject} - Grade {syllabus.grade}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="topic" render={({ field }) => (<FormItem><FormLabel>Topic Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="week" render={({ field }) => (<FormItem><FormLabel>Week</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="subtopics" render={({ field }) => (<FormItem><FormLabel>Subtopics</FormLabel><FormDescription>Enter one subtopic per line.</FormDescription><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Save Topic</Button></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteTopicDialog({ syllabus, topic, children }: { syllabus: Syllabus, topic: SyllabusTopic, children: React.ReactNode }) {
    const { deleteSyllabusTopic } = useSchoolData();
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDesc>This will permanently delete the topic "{topic.topic}" from the syllabus. This action cannot be undone.</AlertDialogDesc>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteSyllabusTopic(syllabus.subject, syllabus.grade, topic.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default function SyllabusPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { syllabi, subjects } = useSchoolData();
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    if (!authLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  const filteredSyllabi = useMemo(() => {
    if (!selectedSubject) return [];
    return syllabi
      .filter(s => s.subject === selectedSubject)
      .sort((a, b) => parseInt(a.grade) - parseInt(b.grade));
  }, [syllabi, selectedSubject]);

  if (authLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap gap-2 justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Curriculum Syllabus</h2>
          <p className="text-muted-foreground">Manage the academic syllabus for each subject and grade level.</p>
        </div>
        <NewSyllabusDialog />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>View & Manage Syllabus</CardTitle>
          <CardDescription>Select a subject to see and manage its curriculum topics.</CardDescription>
          <div className="pt-4">
            <Select onValueChange={setSelectedSubject} value={selectedSubject}>
              <SelectTrigger className="w-full md:w-[280px]"><SelectValue placeholder="Select a subject..." /></SelectTrigger>
              <SelectContent>{subjects.map(subject => (<SelectItem key={subject} value={subject}>{subject}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedSubject ? (
            filteredSyllabi.length > 0 ? (
              <Accordion type="multiple" className="w-full space-y-4">
                {filteredSyllabi.map(syllabus => (
                  <Card key={`${syllabus.subject}-${syllabus.grade}`} className="overflow-hidden">
                    <AccordionItem value={`grade-${syllabus.grade}`} className="border-b-0">
                      <AccordionTrigger className="bg-muted px-4 py-3">
                        <div className="flex flex-1 items-center gap-3">
                            <BookCopy className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-lg">Grade {syllabus.grade}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 space-y-4">
                         <div className="text-right">
                             <TopicDialog syllabus={syllabus}>
                                <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Topic</Button>
                             </TopicDialog>
                         </div>
                        <ul className="space-y-3">
                          {syllabus.topics.sort((a, b) => a.week - b.week).map(topic => (
                            <li key={topic.id} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold">Week {topic.week}: {topic.topic}</p>
                                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                                    {topic.subtopics.map((subtopic, index) => (<li key={index}>{subtopic}</li>))}
                                  </ul>
                                </div>
                                <div className="flex gap-1">
                                    <TopicDialog syllabus={syllabus} topic={topic}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                                    </TopicDialog>
                                    <DeleteTopicDialog syllabus={syllabus} topic={topic}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                    </DeleteTopicDialog>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                         {syllabus.topics.length === 0 && <p className="text-muted-foreground text-center py-6">No topics have been added to this syllabus yet.</p>}
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-muted-foreground py-10">No syllabus found for {selectedSubject}.</p>
            )
          ) : (
            <p className="text-center text-muted-foreground py-10">Please select a subject to view its syllabus.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
