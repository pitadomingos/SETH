
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { teachersData, events } from '@/lib/mock-data';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';

export default function AcademicsPage() {
  const { role } = useAuth();
  const router = useRouter();

  if (role && role !== 'Admin') {
      router.push('/dashboard');
      return null;
  }
  
  const subjects = [...new Set(teachersData.map(t => t.subject))];

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Academics</h2>
            <p className="text-muted-foreground">Manage curriculum, subjects, and academic programs.</p>
        </div>
        <Button>Add Subject</Button>
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
