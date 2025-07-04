
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData } from '@/context/school-data-context';
import { Loader2, FileCheck, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getLetterGrade } from '@/lib/utils';


// Generate options from 20 down to 0 with letter equivalents
const gradeOptions = Array.from({ length: 21 }, (_, i) => {
  const value = 20 - i;
  return { value: String(value), label: `${value} (${getLetterGrade(value)})` };
});

export default function GradingPage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { classesData, studentsData, teachersData, subjects, addGrade } = useSchoolData();
  const { toast } = useToast();
  
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm();

  useEffect(() => {
    if (!authLoading && role !== 'Teacher') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  const teacherInfo = useMemo(() => {
    return teachersData.find(t => t.name === user?.name);
  }, [teachersData, user]);

  const teacherClasses = useMemo(() => {
    if (!teacherInfo) return [];
    return classesData.filter(c => c.teacher === teacherInfo.name);
  }, [classesData, teacherInfo]);

  const studentsInClass = useMemo(() => {
    if (!selectedClassId) return [];
    const selectedClass = classesData.find(c => c.id === selectedClassId);
    if (!selectedClass) return [];
    return studentsData.filter(student =>
      student.grade === selectedClass.grade &&
      student.class === selectedClass.name.split('-')[1].trim()
    );
  }, [selectedClassId, classesData, studentsData]);

  useEffect(() => {
    form.reset();
    setSelectedSubject('');
  }, [selectedClassId, form]);
  
  useEffect(() => {
    form.reset(); 
  }, [studentsInClass, selectedSubject, form]);

  async function onSubmit(data: Record<string, string>) {
    if (!selectedSubject) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a subject.' });
        return;
    }
    setIsSubmitting(true);
    let gradesAdded = 0;
    Object.entries(data).forEach(([studentId, grade]) => {
      if (grade) {
        addGrade({
          studentId,
          subject: selectedSubject,
          grade,
        });
        gradesAdded++;
      }
    });
    
    toast({
      title: 'Grades Saved',
      description: `${gradesAdded} grade(s) for ${selectedSubject} have been successfully recorded.`,
    });
    form.reset();
    setIsSubmitting(false);
  }
  
  if (authLoading || role !== 'Teacher') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const selectedClassName = classesData.find(c => c.id === selectedClassId)?.name;

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Gradebook</h2>
        <p className="text-muted-foreground">Select a class and subject to enter grades for your students.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Enter Grades</CardTitle>
          <CardDescription>
            {selectedClassName && selectedSubject 
              ? `Entering grades for ${selectedClassName} - Subject: ${selectedSubject}`
              : "Select a class and subject to begin."
            }
          </CardDescription>
          <div className="pt-4 flex flex-wrap gap-4">
            <Select onValueChange={setSelectedClassId} value={selectedClassId}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a class..." />
              </SelectTrigger>
              <SelectContent>
                {teacherClasses.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedSubject} value={selectedSubject} disabled={!selectedClassId}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a subject..." />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        {selectedClassId && selectedSubject && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                {studentsInClass.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="w-[180px]">Enter Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsInClass.map(student => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={student.id}
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Grade" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {gradeOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No students found in this class.</p>
                )}
              </CardContent>
              {studentsInClass.length > 0 && (
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save All Grades
                  </Button>
                </CardFooter>
              )}
            </form>
          </Form>
        )}
        {(!selectedClassId || !selectedSubject) && (
          <CardContent className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <FileCheck className="h-10 w-10 mb-4" />
            <p>Please select a class and a subject to view the gradebook.</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
