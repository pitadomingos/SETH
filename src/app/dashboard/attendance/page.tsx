
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, UserCheck, UserX, Clock, Loader2 } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { cn } from '@/lib/utils';

export default function AttendancePage() {
  const { role, isLoading } = useAuth();
  const { studentsData, classesData } = useSchoolData();
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const selectedClassInfo = selectedClassId ? classesData.find(c => c.id === selectedClassId) : null;
  
  const studentsInClass = selectedClassInfo
    ? studentsData.filter(student => 
        student.grade === selectedClassInfo.grade && 
        student.class === selectedClassInfo.name.split('-')[1].trim()
      )
    : [];

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
        <p className="text-muted-foreground">Track and manage student attendance.</p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Take Attendance</CardTitle>
            <CardDescription>Select a class and date to mark attendance.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-center">
            <Select onValueChange={setSelectedClassId} value={selectedClassId ?? ''}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                    {classesData.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
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
        </CardContent>
      </Card>
      
      {selectedClassInfo && (
        <Card>
            <CardHeader>
                <CardTitle>Attendance for {selectedClassInfo.name} on {format(date, "PPP")}</CardTitle>
                <CardDescription>
                    {studentsInClass.length > 0 
                        ? "Mark each student as present, absent, or late."
                        : "There are no students assigned to this class."
                    }
                </CardDescription>
            </CardHeader>
            {studentsInClass.length > 0 && (
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
                                        <RadioGroup defaultValue="present" className="flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="present" id={`${student.id}-present`} />
                                                <Label htmlFor={`${student.id}-present`} className="flex items-center gap-1"><UserCheck className="h-4 w-4 text-green-500"/> Present</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="absent" id={`${student.id}-absent`} />
                                                <Label htmlFor={`${student.id}-absent`} className="flex items-center gap-1"><UserX className="h-4 w-4 text-red-500"/> Absent</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="late" id={`${student.id}-late`} />
                                                <Label htmlFor={`${student.id}-late`} className="flex items-center gap-1"><Clock className="h-4 w-4 text-orange-500"/> Late</Label>
                                            </div>
                                        </RadioGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-end mt-6">
                        <Button>Save Attendance</Button>
                    </div>
                </CardContent>
            )}
        </Card>
      )}
    </div>
  );
}
