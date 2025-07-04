
'use client';
import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useSchoolData } from '@/context/school-data-context';
import { useAuth } from '@/context/auth-context';
import { Building } from 'lucide-react';
import { format } from 'date-fns';

export default function EventsPage() {
  const { events } = useSchoolData();
  const { role } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const eventDates = events.map(event => event.date);

  const displayedEvents = React.useMemo(() => {
    const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

    if (date) {
      return sortedEvents.filter(e => e.date.toDateString() === date.toDateString());
    }
    
    // Default view: show upcoming events from today onwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sortedEvents.filter(e => e.date >= today);
  }, [date, events]);

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
            <CardTitle>
              {date ? `Events for ${format(date, 'PPP')}` : 'Upcoming Events'}
            </CardTitle>
            <CardDescription>
              {date ? 'A list of events for the selected day. Click the date again to see all upcoming events.' : 'A list of key upcoming dates and events.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displayedEvents.length > 0 ? (
              <ul className="space-y-4">
                {displayedEvents.map((event, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md w-14">
                      <span className="font-bold text-lg">{format(event.date, 'dd')}</span>
                      <span className="text-xs uppercase">{format(event.date, 'MMM')}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{format(event.date, 'EEEE')}</p>
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
            ) : (
                <p className="text-center text-muted-foreground py-10">
                  {date ? 'No events scheduled for this day.' : 'No upcoming events.'}
                </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
