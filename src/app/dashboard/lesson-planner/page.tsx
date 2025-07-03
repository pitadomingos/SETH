'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createLessonPlan, CreateLessonPlanOutput } from '@/ai/flows/create-lesson-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, BookCopy, Hammer, FlaskConical } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  gradeLevel: z.string().min(1, { message: 'Grade level is required.' }),
});

export default function LessonPlannerPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [lessonPlan, setLessonPlan] = useState<CreateLessonPlanOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && role !== 'Teacher') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      gradeLevel: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setLessonPlan(null);
    try {
      const result = await createLessonPlan(values);
      setLessonPlan(result);
    } catch (error) {
      console.error('Failed to create lesson plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate lesson plan. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading || role !== 'Teacher') {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">AI Lesson Planner</h2>
        <p className="text-muted-foreground">Generate a complete lesson plan with objectives, activities, and materials.</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Plan</CardTitle>
                  <CardDescription>Enter a topic and grade level to get started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., The Solar System" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gradeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Level</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5th Grade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Plan
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-[500px]">
            <CardHeader>
              <CardTitle>Generated Lesson Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitting && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                  <p>Our AI is crafting your lesson plan...</p>
                </div>
              )}
              {lessonPlan ? (
                <div className="space-y-6 text-sm">
                  <div>
                    <h3 className="flex items-center text-lg font-semibold mb-2"><BookCopy className="mr-2 h-5 w-5 text-primary"/>Objectives</h3>
                    <p className="p-3 bg-muted rounded-md whitespace-pre-wrap">{lessonPlan.objectives}</p>
                  </div>
                   <div>
                    <h3 className="flex items-center text-lg font-semibold mb-2"><Hammer className="mr-2 h-5 w-5 text-primary"/>Activities</h3>
                    <p className="p-3 bg-muted rounded-md whitespace-pre-wrap">{lessonPlan.activities}</p>
                  </div>
                   <div>
                    <h3 className="flex items-center text-lg font-semibold mb-2"><FlaskConical className="mr-2 h-5 w-5 text-primary"/>Materials</h3>
                    <p className="p-3 bg-muted rounded-md whitespace-pre-wrap">{lessonPlan.materials}</p>
                  </div>
                </div>
              ) : (
                !isSubmitting && (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <Sparkles className="h-10 w-10 mb-4" />
                    <p>Your generated lesson plan will appear here.</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
