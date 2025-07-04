
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData, Team } from '@/context/school-data-context';
import { Trophy, Users, PlusCircle, Loader2, User as UserIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const teamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters."),
  icon: z.string().emoji({ message: "Please enter a single, valid emoji." }).max(2, "Please enter a single emoji."),
  coach: z.string({ required_error: "Please select a coach for the team." }),
});
type TeamFormValues = z.infer<typeof teamSchema>;

function NewTeamDialog() {
    const { addTeam, teachersData } = useSchoolData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const form = useForm<TeamFormValues>({
        resolver: zodResolver(teamSchema),
        defaultValues: { name: '', icon: '' }
    });

    function onSubmit(values: TeamFormValues) {
        addTeam(values);
        form.reset();
        setIsDialogOpen(false);
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Team</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Sports Team</DialogTitle>
                    <DialogDescription>Enter the details for the new team.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Team Name</FormLabel><FormControl><Input placeholder="e.g., Varsity Eagles" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="icon" render={({ field }) => ( <FormItem><FormLabel>Team Icon (Emoji)</FormLabel><FormControl><Input placeholder="e.g., 🦅" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="coach" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Coach</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a coach" /></SelectTrigger></FormControl>
                                    <SelectContent>{teachersData.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter className="col-span-2 mt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}> {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Team</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function ManageTeamDialog({ team, students, allTeams, addPlayerToTeam, removePlayerFromTeam }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [studentToAdd, setStudentToAdd] = useState('');

  const teamPlayers = students.filter(s => team.playerIds.includes(s.id));
  
  const allPlayerIds = allTeams.flatMap(t => t.playerIds);
  const availableStudents = students.filter(s => !allPlayerIds.includes(s.id));

  const handleAddPlayer = () => {
    if (studentToAdd) {
      addPlayerToTeam(team.id, studentToAdd);
      setStudentToAdd('');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Manage Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage {team.name}</DialogTitle>
          <DialogDescription>Add or remove players from the team roster.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Current Players ({teamPlayers.length})</h4>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {teamPlayers.map(player => (
                  <li key={player.id} className="flex justify-between items-center bg-muted p-2 rounded-md">
                    <span>{player.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removePlayerFromTeam(team.id, player.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
                {teamPlayers.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No players on this team yet.</p>}
              </ul>
            </div>
            <div className="mt-4">
               <h4 className="font-semibold mb-2 text-sm">Add New Player</h4>
               <div className="flex gap-2">
                <Select onValueChange={setStudentToAdd} value={studentToAdd}>
                  <SelectTrigger><SelectValue placeholder="Select a student..." /></SelectTrigger>
                  <SelectContent>
                    {availableStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.name} (Grade {s.grade})</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddPlayer} disabled={!studentToAdd}>Add</Button>
               </div>
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button>Done</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function SportsPage() {
  const { role, isLoading } = useAuth();
  const { events, teamsData, studentsData, addPlayerToTeam, removePlayerFromTeam } = useSchoolData();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  const sportsEvents = events.filter(e => e.type === 'Sports');

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Sports</h2>
            <p className="text-muted-foreground">Manage sports activities, teams, and competitions.</p>
        </div>
        <NewTeamDialog />
      </header>

        <Card>
            <CardHeader>
                <CardTitle>School Teams</CardTitle>
                <CardDescription>Overview of all official school sports teams.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teamsData.map(team => (
                    <Card key={team.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <span className="text-4xl">{team.icon}</span>
                                <span className="flex-1">{team.name}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 flex-grow">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="mr-3 h-4 w-4" />
                                <span>{team.playerIds.length} Players</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <UserIcon className="mr-3 h-4 w-4" />
                                <span>Coach: {team.coach}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                           <ManageTeamDialog
                                team={team}
                                students={studentsData}
                                allTeams={teamsData}
                                addPlayerToTeam={addPlayerToTeam}
                                removePlayerFromTeam={removePlayerFromTeam}
                            />
                        </CardFooter>
                    </Card>
                ))}
                 {teamsData.length === 0 && (
                    <p className="text-muted-foreground col-span-full text-center py-8">No sports teams have been created yet.</p>
                )}
            </CardContent>
        </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy /> Upcoming Competitions</CardTitle>
            <CardDescription>A list of scheduled sports events and competitions.</CardDescription>
        </CardHeader>
        <CardContent>
            {sportsEvents.length > 0 ? (
                <ul className="space-y-4">
                    {sportsEvents.map(event => (
                        <li key={event.title} className="flex flex-wrap items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                                <h3 className="font-semibold">{event.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {event.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                <Button>View Details</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-center py-8">No upcoming sports events scheduled.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
