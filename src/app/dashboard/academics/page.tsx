
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { BookOpen, Calendar, ChevronRight, Loader2, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSchoolData } from '@/context/school-data-context';

const subjectSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters."),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

export default function AcademicsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { subjects, addSubject, teachersData, events } = useSchoolData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: SubjectFormValues) {
    addSubject(values.name);
    form.reset();
    setIsDialogOpen(false);
  }

  if (authLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Academics</h2>
            <p className="text-muted-foreground">Manage curriculum, subjects, and academic programs.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Subject</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Enter the name of the new subject to add it to the curriculum.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Subject
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BookOpen /> Subjects Offered</CardTitle>
                  <CardDescription>An overview of all subjects taught at the institution.</CardDescription>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-3">
                      {subjects.map(subject => (
                          <li key={subject} className="flex items-center justify-between p-3 bg-muted rounded-md">
                              <span className="font-medium">{subject}</span>
                              <span className="text-sm text-muted-foreground">{teachersData.filter(t => t.subject === subject).length} Teachers</span>
                          </li>
                      ))}
                  </ul>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Calendar /> Academic Calendar</CardTitle>
                  <CardDescription>Key dates in the current academic year.</CardDescription>
              </CardHeader>
              <CardContent>
                   <ul className="space-y-4">
                      {events
                        .filter(e => e.date >= new Date())
                        .sort((a,b) => a.date.getTime() - b.date.getTime())
                        .slice(0, 4)
                        .map((event, index) => (
                        <li key={index} className="flex items-start gap-4">
                          <div className="flex flex-col items-center p-2 bg-muted rounded-md w-14">
                            <span className="font-bold text-lg">{event.date.toLocaleDateString('en-US', { day: '2-digit' })}</span>
                            <span className="text-xs uppercase">{event.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                          </div>
                          <div>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.date.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
              </CardContent>
          </Card>
      </div>

    </div>
  );
}
