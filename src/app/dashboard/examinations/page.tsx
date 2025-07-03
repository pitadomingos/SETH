
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { examsData } from '@/lib/mock-data';
import { ClipboardList, BookOpen, GraduationCap, Calendar, Clock, MapPin, PlusCircle } from 'lucide-react';

export default function ExaminationsPage() {
  const { role } = useAuth();
  const router = useRouter();

  if (role && role !== 'Admin') {
      router.push('/dashboard');
      return null;
  }
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Examinations</h2>
            <p className="text-muted-foreground">Schedule and manage examinations.</p>
        </div>
        <Button><PlusCircle className="mr-2 h-4 w-4"/>Schedule Exam</Button>
      </header>
      
      <div className="grid gap-6">
        {examsData.map(exam => (
            <Card key={exam.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>{exam.title}</CardTitle>
                        <CardDescription>{exam.subject}</CardDescription>
                    </div>
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                        {exam.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Grade {exam.grade}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{exam.date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{exam.time} ({exam.duration})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Room {exam.room}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

    </div>
  );
}
