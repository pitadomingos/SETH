
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/auth-context';
import { useSchoolData } from '@/context/school-data-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Smile, Frown, Meh, Save, Users } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

const assessmentSchema = z.object({
  studentId: z.string().min(1, 'Please select a student.'),
  respect: z.number().min(1).max(5).default(3),
  participation: z.number().min(1).max(5).default(3),
  socialSkills: z.number().min(1).max(5).default(3),
  conduct: z.number().min(1).max(5).default(3),
  comment: z.string().max(200, 'Comment must be 200 characters or less.').optional(),
});
type AssessmentFormValues = z.infer<typeof assessmentSchema>;

const ratingLabels = {
  1: { label: 'Poor', icon: <Frown className="h-5 w-5 text-red-500" /> },
  2: { label: 'Fair', icon: <Frown className="h-5 w-5 text-orange-500" /> },
  3: { label: 'Average', icon: <Meh className="h-5 w-5 text-yellow-500" /> },
  4: { label: 'Good', icon: <Smile className="h-5 w-5 text-green-500" /> },
  5: { label: 'Excellent', icon: <Smile className="h-5 w-5 text-green-600" /> },
};

export default function BehavioralAssessmentPage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const {
    studentsData,
    classesData,
    coursesData,
    teachersData,
    addBehavioralAssessment,
    isLoading: dataLoading,
  } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: { studentId: '', respect: 3, participation: 3, socialSkills: 3, conduct: 3, comment: '' },
  });

  const isLoading = authLoading || dataLoading;
  const teacher = useMemo(() => teachersData.find(t => t.email === user?.email), [teachersData, user]);

  const teacherClasses = useMemo(() => {
    if (!teacher) return [];
    const teacherCourseClassIds = coursesData.filter(c => c.teacherId === teacher.id).map(c => c.classId);
    return classesData.filter(c => teacherCourseClassIds.includes(c.id));
  }, [teacher, coursesData, classesData]);

  const studentsInClass = useMemo(() => {
    if (!selectedClassId) return [];
    const classInfo = classesData.find(c => c.id === selectedClassId);
    if (!classInfo) return [];
    return studentsData.filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim());
  }, [selectedClassId, classesData, studentsData]);

  useEffect(() => {
    if (!isLoading && role !== 'Teacher') router.push('/dashboard');
  }, [role, isLoading, router]);
  
  useEffect(() => {
    form.reset({ studentId: '', respect: 3, participation: 3, socialSkills: 3, conduct: 3, comment: '' });
  }, [selectedClassId, form]);

  const onSubmit = (values: AssessmentFormValues) => {
    if (!teacher) return;
    addBehavioralAssessment({
      ...values,
      teacherId: teacher.id,
    });
    const studentName = studentsData.find(s => s.id === values.studentId)?.name || 'the student';
    toast({ title: 'Assessment Saved', description: `Behavioral assessment for ${studentName} has been recorded.` });
    form.reset({ studentId: '', respect: 3, participation: 3, socialSkills: 3, conduct: 3, comment: '' });
  };
  
  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Behavioral Assessments</h2>
        <p className="text-muted-foreground">Periodically assess student conduct and social skills.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Select a Class</CardTitle>
          <CardDescription>Choose a class to begin assessing students.</CardDescription>
          <div className="pt-4">
            <Select onValueChange={setSelectedClassId} value={selectedClassId}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a class..." />
              </SelectTrigger>
              <SelectContent>
                {teacherClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {selectedClassId && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                {studentsInClass.length > 0 ? (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Student</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a student to assess..." /></SelectTrigger></FormControl>
                            <SelectContent>{studentsInClass.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('studentId') && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t">
                        {(['respect', 'participation', 'socialSkills', 'conduct'] as const).map((trait) => (
                           <FormField
                            key={trait}
                            control={form.control}
                            name={trait}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex justify-between items-center">
                                  <FormLabel className="capitalize">{trait.replace('Skills', ' Skills')}</FormLabel>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {ratingLabels[field.value]?.icon}
                                    <span>{ratingLabels[field.value]?.label}</span>
                                  </div>
                                </div>
                                <FormControl>
                                  <Slider
                                    defaultValue={[field.value]}
                                    value={[field.value]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                    min={1}
                                    max={5}
                                    step={1}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                         <FormField
                          control={form.control}
                          name="comment"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Additional Comments</FormLabel>
                              <FormControl>
                                <Textarea placeholder="(Optional) Provide specific examples or notes..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No students found in this class.</p>
                )}
              </CardContent>
              {form.watch('studentId') && (
                 <CardFooter className="border-t pt-6">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Assessment
                  </Button>
                </CardFooter>
              )}
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
