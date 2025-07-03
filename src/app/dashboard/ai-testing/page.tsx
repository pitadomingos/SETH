'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, FlaskConical, ChevronRight } from 'lucide-react';
import { generateTest, type GenerateTestOutput } from '@/ai/flows/generate-test';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const GenerateTestInputSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  topic: z.string().min(1, 'Topic is required.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
  numQuestions: z.coerce.number().int().min(1).max(10),
});

export default function AiTestingPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [generatedTest, setGeneratedTest] = useState<GenerateTestOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && role !== 'Teacher') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  const form = useForm<z.infer<typeof GenerateTestInputSchema>>({
    resolver: zodResolver(GenerateTestInputSchema),
    defaultValues: {
      subject: '',
      topic: '',
      gradeLevel: '',
      numQuestions: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof GenerateTestInputSchema>) {
    setIsSubmitting(true);
    setGeneratedTest(null);
    try {
      const result = await generateTest(values);
      setGeneratedTest(result);
      toast({
        title: 'Test Generated!',
        description: 'Review the generated test below.',
      });
    } catch (error) {
      console.error('Failed to generate test:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate test. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDeployTest() {
    toast({
      title: 'Test Deployed!',
      description: 'The test is now available to students. (This is a demo feature)',
    });
  }

  if (authLoading || role !== 'Teacher') {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">AI Test Generator</h2>
        <p className="text-muted-foreground">
          Generate, review, and deploy ad-hoc tests for your classes.
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Test Parameters</CardTitle>
                  <CardDescription>Define the test you want to create.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Biology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cell Mitosis" {...field} />
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
                          <Input placeholder="e.g., 10th Grade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="numQuestions"
                    render={({ field }) => (
                       <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={String(field.value)}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select number of questions" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {[...Array(10)].map((_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Test
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-[500px]">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>Generated Test</CardTitle>
                <CardDescription>Review the questions before deploying the test.</CardDescription>
              </div>
               {generatedTest && (
                <Button onClick={handleDeployTest}>
                  Deploy Test <ChevronRight className="ml-2 h-4 w-4"/>
                </Button>
               )}
            </CardHeader>
            <CardContent>
              {isSubmitting && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                  <p>Our AI is crafting your test questions...</p>
                </div>
              )}
              {generatedTest ? (
                <div className="space-y-8">
                  {generatedTest.questions.map((q, index) => (
                    <div key={index} className="space-y-3">
                      <p className="font-semibold">{index + 1}. {q.questionText}</p>
                       <RadioGroup value={q.correctAnswer} disabled>
                          {q.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                                  <Label htmlFor={`q${index}-o${optionIndex}`} className={option === q.correctAnswer ? 'text-primary font-bold' : ''}>
                                      {option}
                                  </Label>
                                  {option === q.correctAnswer && (
                                    <Badge variant="secondary" className="ml-2">Correct Answer</Badge>
                                  )}
                              </div>
                          ))}
                       </RadioGroup>
                    </div>
                  ))}
                </div>
              ) : (
                !isSubmitting && (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <FlaskConical className="h-10 w-10 mb-4" />
                    <p>Your generated test will appear here.</p>
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
