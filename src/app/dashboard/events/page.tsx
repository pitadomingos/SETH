
'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useSchoolData } from '@/context/school-data-context';
import { useAuth } from '@/context/auth-context';
import { Building, MapPin, Users, PlusCircle, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  date: z.date({ required_error: "An event date is required." }),
  location: z.string().min(2, "Location is required."),
  organizer: z.string().min(2, "Organizer is required."),
  audience: z.string({ required_error: "Audience is required." }),
  type: z.string({ required_error: "Event type is required." }),
});
type EventFormValues = z.infer<typeof eventSchema>;

function NewEventDialog() {
    const { addEvent, audiences } = useSchoolData();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const { toast } = useToast();
    
    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: { type: 'Academic' },
    });

    function onSubmit(values: EventFormValues) {
        addEvent(values);
        toast({
            title: "Event Scheduled",
            description: `${values.title} has been added to the calendar.`
        });
        form.reset();
        setIsDialogOpen(false);
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Event</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule New Event</DialogTitle>
                    <DialogDescription>Enter the details for the new school event.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Event Title</FormLabel><FormControl><Input placeholder="e.g., Annual Science Fair" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="date" render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}
                                    >
                                    {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="location" render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Main Hall" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="organizer" render={({ field }) => ( <FormItem><FormLabel>Organizer</FormLabel><FormControl><Input placeholder="e.g., Science Dept." {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <FormField control={form.control} name="audience" render={({ field }) => ( 
                            <FormItem>
                                <FormLabel>Audience</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {audiences.map(aud => <SelectItem key={aud} value={aud}>{aud}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem> 
                        )} />
                        <FormField control={form.control} name="type" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Academic">Academic</SelectItem>
                                        <SelectItem value="Sports">Sports</SelectItem>
                                        <SelectItem value="Cultural">Cultural</SelectItem>
                                        <SelectItem value="Meeting">Meeting</SelectItem>
                                        <SelectItem value="Holiday">Holiday</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter className="mt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}> {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Schedule Event</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function EventsPage() {
  const { events, studentsData } = useSchoolData();
  const { role, user } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const eventDates = events.map(event => event.date);

  const student = React.useMemo(() => {
    if (role !== 'Student' || !user?.email) return null;
    return studentsData.find(s => s.email === user.email);
  }, [role, user, studentsData]);

  const displayedEvents = React.useMemo(() => {
    const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    let filteredByRole = sortedEvents;

    if (role === 'Student' && student) {
      filteredByRole = sortedEvents.filter(event => {
        const audience = event.audience.toLowerCase();
        const studentGrade = parseInt(student.grade, 10);
        if (audience.includes('all student')) return true;
        if (audience.includes('whole school')) return true;
        
        if (audience.includes('grades')) {
            const matches = audience.match(/(\d+)-(\d+)/);
            if (matches) {
                const min = parseInt(matches[1], 10);
                const max = parseInt(matches[2], 10);
                if (!isNaN(min) && !isNaN(max) && studentGrade >= min && studentGrade <= max) {
                    return true;
                }
            }
        }
        if (audience.includes(`grade ${student.grade}`)) return true;

        return false;
      });
    }

    if (date) {
      return filteredByRole.filter(e => e.date.toDateString() === date.toDateString());
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return filteredByRole.filter(e => e.date >= today);
  }, [date, events, role, student]);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">School Events</h2>
            <p className="text-muted-foreground">Stay up-to-date with important school dates and events.</p>
        </div>
        {role === 'Admin' && <NewEventDialog />}
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
                {displayedEvents.map((event) => (
                  <li key={event.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md w-14">
                      <span className="font-bold text-lg">{format(event.date, 'dd')}</span>
                      <span className="text-xs uppercase">{format(event.date, 'MMM')}</span>
                    </div>
                    <div>
                        <p className="font-semibold">{event.title}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                            <span>{format(event.date, 'EEEE')}</span>
                            <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /><span>{event.location}</span></div>
                            <div className="flex items-center gap-1.5"><Users className="h-3 w-3" /><span>For: {event.audience}</span></div>
                        </div>
                        {role === 'Parent' && event.schoolName && (
                            <div className="flex items-center text-xs text-primary font-medium mt-1.5">
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
