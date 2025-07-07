
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, UserCheck, UserX, Clock, Loader2, Save, FileCheck } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

export default function AttendancePage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const { teachersData, coursesData, classesData, studentsData, attendance, addLessonAttendance, isLoading: dataLoading } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  
  const isLoading = authLoading || dataLoading;
  
  const form = useForm();
  
  useEffect(() => {
    if (!isLoading && role !== 'Teacher') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  const teacherInfo = useMemo(() => {
      return teachersData.find(t => t.name === user?.name);
  }, [teachersData, user]);

  const teacherCourses = useMemo(() => {
    if (!teacherInfo) return [];
    return coursesData
      .filter(c => c.teacherId === teacherInfo.id)
      .map(course => ({
          ...course,
          className: classesData.find(c => c.id === course.classId)?.name || 'Unknown Class'
      }));
  }, [coursesData, teacherInfo, classesData]);

  const studentsInClass = useMemo(() => {
    if (!selectedCourseId) return [];
    const course = coursesData.find(c => c.id === selectedCourseId);
    if (!course) return [];
    const classInfo = classesData.find(c => c.id === course.classId);
    if (!classInfo) return [];
    
    return studentsData.filter(student => 
        student.grade === classInfo.grade && 
        student.class === classInfo.name.split('-')[1].trim()
    );
  }, [selectedCourseId, coursesData, classesData, studentsData]);

  const formattedDate = format(date, 'yyyy-MM-dd');

  useEffect(() => {
    const defaultValues = {};
    const attendanceForDate = attendance.filter(a => a.date === formattedDate && a.courseId === selectedCourseId);

    studentsInClass.forEach(student => {
      const record = attendanceForDate.find(a => a.studentId === student.id);
      defaultValues[student.id] = record?.status || 'Present';
    });
    
    form.reset(defaultValues);
  }, [studentsInClass, formattedDate, selectedCourseId, attendance, form]);


  const onSubmit = (data: Record<string, 'Present' | 'Late' | 'Absent'>) => {
    addLessonAttendance(selectedCourseId, formattedDate, data);
    toast({
        title: 'Attendance Saved',
        description: `Attendance for ${formattedDate} has been recorded successfully.`
    });
  };
  
  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Lesson Attendance</h2>
        <p className="text-muted-foreground">Take attendance for your specific class lessons.</p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Select Course and Date</CardTitle>
            <CardDescription>Choose one of your courses and a date to take attendance.</CardDescription>
             <div className="pt-4 flex flex-wrap gap-4 items-center">
                <Select onValueChange={setSelectedCourseId} value={selectedCourseId}>
                    <SelectTrigger className="w-full md:w-[300px]">
                        <SelectValue placeholder="Select a course..." />
                    </SelectTrigger>
                    <SelectContent>
                        {teacherCourses.map(c => <SelectItem key={c.id} value={c.id}>{c.subject} - {c.className}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn("w-full md:w-[240px] justify-start text-left font-normal",!date && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => setDate(d || new Date())}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
        </CardHeader>
      </Card>
      
      {selectedCourseId && (
        <Card>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Attendance Register</CardTitle>
                    <CardDescription>
                        {studentsInClass.length > 0 
                            ? "Mark each student as present, absent, or late for this lesson."
                            : "There are no students assigned to this course's class section."
                        }
                    </CardDescription>
                </CardHeader>
                {studentsInClass.length > 0 ? (
                    <>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsInClass.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>
                                             <Controller
                                                name={student.id}
                                                control={form.control}
                                                render={({ field }) => (
                                                    <RadioGroup 
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex gap-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Present" id={`${student.id}-present`} />
                                                            <Label htmlFor={`${student.id}-present`} className="flex items-center gap-1"><UserCheck className="h-4 w-4 text-green-500"/> Present</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Late" id={`${student.id}-late`} />
                                                            <Label htmlFor={`${student.id}-late`} className="flex items-center gap-1"><Clock className="h-4 w-4 text-orange-500"/> Late</Label>
                                                        </div>
                                                         <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Absent" id={`${student.id}-absent`} />
                                                            <Label htmlFor={`${student.id}-absent`} className="flex items-center gap-1"><UserX className="h-4 w-4 text-red-500"/> Absent</Label>
                                                        </div>
                                                    </RadioGroup>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex justify-end mt-6">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                            Save Attendance
                        </Button>
                    </CardFooter>
                    </>
                ) : (
                    <CardContent className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                        <FileCheck className="h-10 w-10 mb-4" />
                        <p>No students to display for this class.</p>
                    </CardContent>
                )}
            </form>
        </Card>
      )}
    </div>
  );
}
