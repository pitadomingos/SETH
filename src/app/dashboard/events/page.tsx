
'use client';
import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useSchoolData } from '@/context/school-data-context';
import { useAuth } from '@/context/auth-context';
import { Building } from 'lucide-react';

export default function EventsPage() {
  const { events } = useSchoolData();
  const { role } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const eventDates = events.map(event => event.date);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">School Events</h2>
        <p className="text-muted-foreground">Stay up-to-date with important school dates and events.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardContent className="p-0 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-4"
              modifiers={{
                event: eventDates,
              }}
              modifiersClassNames={{
                event: 'bg-primary text-primary-foreground rounded-full',
              }}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>A list of key dates and events.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {events
                .filter(e => e.date >= new Date())
                .sort((a,b) => a.date.getTime() - b.date.getTime())
                .map((event, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md w-14">
                    <span className="font-bold text-lg">{event.date.toLocaleDateString('en-US', { day: '2-digit' })}</span>
                    <span className="text-xs uppercase">{event.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                    {role === 'Parent' && event.schoolName && (
                        <div className="flex items-center text-xs text-primary font-medium mt-1">
                            <Building className="mr-1.5 h-3 w-3" />
                            <span>{event.schoolName}</span>
                        </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
