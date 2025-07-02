'use client';
import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { events } from '@/lib/mock-data';

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const eventDates = events.map(event => event.date);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Academic Calendar</h2>
        <p className="text-muted-foreground">Stay up-to-date with important school dates.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-4 w-full"
              modifiers={{
                event: eventDates,
              }}
              modifiersClassNames={{
                event: 'bg-primary text-primary-foreground rounded-full',
              }}
            />
          </CardContent>
        </Card>
        <Card>
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
