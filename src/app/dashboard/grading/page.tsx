
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData } from '@/context/school-data-context';
import { Loader2, FileCheck, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getLetterGrade } from '@/lib/utils';
import { Input } from '@/components/ui/input';


// Generate options from 20 down to 0 with letter equivalents
const gradeOptions = Array.from({ length: 21 }, (_, i) => {
  const value = 20 - i;
  return { value: String(value), label: `${value} (${getLetterGrade(value)})` };
});

export default function GradingPage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { classesData, studentsData, teachersData, coursesData, addGrade } = useSchoolData();
  const { toast } = useToast();
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
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

  const teacherCourses = useMemo(() => {
    if (!teacherInfo) return [];
    return coursesData
      .filter(c => c.teacherId === teacherInfo.id)
      .map(course => {
        const classInfo = classesData.find(c => c.id === course.classId);
        return {
          ...course,
          label: `${course.subject} - ${classInfo?.name || 'Unknown Class'}`
        }
      });
  }, [coursesData, teacherInfo, classesData]);

  const selectedCourse = useMemo(() => {
    return teacherCourses.find(c => c.id === selectedCourseId);
  }, [selectedCourseId, teacherCourses]);

  const studentsInClass = useMemo(() => {
    if (!selectedCourse) return [];
    const classInfo = classesData.find(c => c.id === selectedCourse.classId);
    if (!classInfo) return [];
    return studentsData.filter(student =>
      student.grade === classInfo.grade &&
      student.class === classInfo.name.split('-')[1].trim()
    );
  }, [selectedCourse, classesData, studentsData]);

  useEffect(() => {
    form.reset();
  }, [selectedCourseId, form]);

  async function onSubmit(data: Record<string, any>) {
    if (!selectedCourse) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a course.' });
        return;
    }
    setIsSubmitting(true);
    let gradesAdded = 0;
    
    for (const studentId of Object.keys(data)) {
      const studentData = data[studentId];
      if (studentData && studentData.grade) {
        const success = await addGrade({
          studentId: studentId,
          subject: selectedCourse.subject,
          grade: studentData.grade,
          type: studentData.type || 'Coursework',
          description: studentData.description || 'General Grade',
        });
        if (success) gradesAdded++;
      }
    }
    
    if(gradesAdded > 0) {
      toast({
        title: 'Grades Saved',
        description: `${gradesAdded} grade(s) for ${selectedCourse.subject} have been successfully recorded.`,
      });
    }

    form.reset();
    setIsSubmitting(false);
  }
  
  if (authLoading || role !== 'Teacher') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Gradebook</h2>
        <p className="text-muted-foreground">Select a course to enter grades for your students.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Enter Grades</CardTitle>
          <CardDescription>
            {selectedCourse 
              ? `Entering grades for ${selectedCourse.label}`
              : "Select a course to begin."
            }
          </CardDescription>
          <div className="pt-4 flex flex-wrap gap-4">
            <Select onValueChange={setSelectedCourseId} value={selectedCourseId}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a course..." />
              </SelectTrigger>
              <SelectContent>
                {teacherCourses.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        {selectedCourseId && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                {studentsInClass.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Assessment Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[180px]">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsInClass.map(student => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <FormField control={form.control} name={`${student.id}.type`} render={({ field }) => (
                                <FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Coursework">Coursework</SelectItem><SelectItem value="Test">Test</SelectItem><SelectItem value="Exam">Exam</SelectItem></SelectContent></Select></FormItem>
                            )}/>
                          </TableCell>
                           <TableCell>
                            <FormField control={form.control} name={`${student.id}.description`} render={({ field }) => (
                                <FormItem><FormControl><Input placeholder="e.g., Mid-Term Exam" {...field} /></FormControl></FormItem>
                            )}/>
                           </TableCell>
                          <TableCell>
                            <FormField control={form.control} name={`${student.id}.grade`} render={({ field }) => (
                                <FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger></FormControl><SelectContent>{gradeOptions.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent></Select></FormItem>
                            )}/>
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
        {!selectedCourseId && (
          <CardContent className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <FileCheck className="h-10 w-10 mb-4" />
            <p>Please select a course to view the gradebook.</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
