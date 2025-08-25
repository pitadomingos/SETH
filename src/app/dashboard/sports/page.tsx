
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData, Team, Competition, Student } from '@/context/school-data-context';
import { Trophy, Users, PlusCircle, Loader2, User as UserIcon, X, Calendar as CalendarIcon, Clock, MapPin, Swords, Trash2, Check, Award, History } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';


const teamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters."),
  icon: z.string().emoji({ message: "Please enter a single, valid emoji." }).max(2, "Please enter a single emoji."),
  coach: z.string({ required_error: "Please select a coach for the team." }),
});
type TeamFormValues = z.infer<typeof teamSchema>;

const competitionSchema = z.object({
  title: z.string().min(3, "Title is required."),
  ourTeamId: z.string({ required_error: "Please select a team." }),
  opponent: z.string().min(2, "Opponent name is required."),
  date: z.date({ required_error: "A date is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)."),
  location: z.string().min(3, "Location is required."),
});
type CompetitionFormValues = z.infer<typeof competitionSchema>;

const resultSchema = z.object({
  ourScore: z.coerce.number().int().min(0, "Score must be positive."),
  opponentScore: z.coerce.number().int().min(0, "Score must be positive."),
});
type ResultFormValues = z.infer<typeof resultSchema>;

function NewTeamDialog() {
    const { addTeam, teachersData } = useSchoolData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const form = useForm<TeamFormValues>({
        resolver: zodResolver(teamSchema),
        defaultValues: { name: '', icon: '', coach: '' }
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

function NewCompetitionDialog() {
    const { addCompetition, teamsData } = useSchoolData();
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<CompetitionFormValues>({
        resolver: zodResolver(competitionSchema),
        defaultValues: {
            title: '',
            ourTeamId: '',
            opponent: '',
            time: '14:00',
            location: '',
        },
    });

    function onSubmit(values: CompetitionFormValues) {
        addCompetition(values);
        form.reset();
        setIsOpen(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Schedule Competition</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Schedule New Competition</DialogTitle>
                    <DialogDescription>Enter the details for the upcoming sports event.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Event Title</FormLabel><FormControl><Input placeholder="e.g., Regional Finals" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="ourTeamId" render={({ field }) => ( <FormItem><FormLabel>Our Team</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Team" /></SelectTrigger></FormControl><SelectContent>{teamsData.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="opponent" render={({ field }) => ( <FormItem><FormLabel>Opponent</FormLabel><FormControl><Input placeholder="e.g., Rival High" {...field} /></FormControl><FormMessage /></FormItem> )} />
                             <FormField control={form.control} name="date" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="time" render={({ field }) => ( <FormItem><FormLabel>Time</FormLabel><FormControl><Input placeholder="HH:MM" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <FormField control={form.control} name="location" render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Central Stadium" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <DialogFooter className="mt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}> {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Schedule</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function RecordResultDialog({ competition, team }: { competition: Competition, team?: Team }) {
    const { addCompetitionResult } = useSchoolData();
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<ResultFormValues>({
        resolver: zodResolver(resultSchema),
        defaultValues: { ourScore: 0, opponentScore: 0 }
    });

    function onSubmit(values: ResultFormValues) {
        addCompetitionResult(competition.id, values);
        form.reset();
        setIsOpen(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Award className="mr-2 h-4 w-4" /> Record Result</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Competition Result</DialogTitle>
                    <DialogDescription>
                        {team?.name || 'Our Team'} vs {competition.opponent}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="ourScore" render={({ field }) => ( <FormItem><FormLabel>{team?.name || 'Our Score'}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="opponentScore" render={({ field }) => ( <FormItem><FormLabel>Opponent Score</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit">Save Result</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteTeamDialog({ team, onDelete }: { team: Team; onDelete: (teamId: string) => void; }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" /> Delete Team
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the team "{team.name}" and any competitions it is scheduled for. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(team.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, delete team
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ManageTeamDialog({ team, students, allTeams, addPlayerToTeam, removePlayerFromTeam, deleteTeam }: { team: Team, students: Student[], allTeams: Team[], addPlayerToTeam: (teamId: string, studentId: string) => void, removePlayerFromTeam: (teamId: string, studentId: string) => void, deleteTeam: (teamId: string) => void }) {
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
        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center border-t pt-4">
           <DeleteTeamDialog team={team} onDelete={deleteTeam} />
           <DialogClose asChild><Button>Done</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CompetitionCard({ competition, team }: { competition: Competition, team?: Team }) {
  const getOutcomeBadge = (outcome: 'Win' | 'Loss' | 'Draw') => {
    switch(outcome) {
      case 'Win': return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Win</Badge>;
      case 'Loss': return <Badge variant="destructive">Loss</Badge>;
      case 'Draw': return <Badge variant="outline">Draw</Badge>;
    }
  };

  const competitionDate = competition.date.toDate ? competition.date.toDate() : new Date(competition.date);

  return (
    <li className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{competition.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            {team && <span className="text-2xl">{team.icon}</span>}
            <span>{team?.name || 'School Team'}</span>
            <Swords className="h-4 w-4 text-primary" />
            <span>{competition.opponent}</span>
        </div>
        {competition.result && (
          <div className="mt-2 text-sm flex items-center gap-2">
            <span className="font-bold">{competition.result.ourScore} - {competition.result.opponentScore}</span>
            {getOutcomeBadge(competition.result.outcome)}
          </div>
        )}
      </div>
      <div className="w-full sm:w-auto flex items-center gap-4 mt-3 sm:mt-0">
          <div className="text-sm text-right flex-1">
              <p>{format(competitionDate, 'EEEE, MMM d')}</p>
              <p className="text-muted-foreground">{competition.time} at {competition.location}</p>
          </div>
          {competitionDate < new Date() && !competition.result && <RecordResultDialog competition={competition} team={team} />}
      </div>
    </li>
  )
}

export default function SportsPage() {
  const { role, isLoading } = useAuth();
  const { teamsData, studentsData, addPlayerToTeam, removePlayerFromTeam, competitionsData, deleteTeam } = useSchoolData();
  const router = useRouter();
  
  const isAuthorized = role === 'Admin' || role === 'SportsDirector';

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.push('/dashboard');
    }
  }, [role, isLoading, router, isAuthorized]);

  if (isLoading || !isAuthorized) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  const upcomingCompetitions = competitionsData.filter(c => (c.date.toDate ? c.date.toDate() : new Date(c.date)) >= new Date()).sort((a, b) => (a.date.toDate ? a.date.toDate() : new Date(a.date)).getTime() - (b.date.toDate ? b.date.toDate() : new Date(b.date)).getTime());
  const pastCompetitions = competitionsData.filter(c => (c.date.toDate ? c.date.toDate() : new Date(c.date)) < new Date()).sort((a, b) => (b.date.toDate ? b.date.toDate() : new Date(b.date)).getTime() - (a.date.toDate ? a.date.toDate() : new Date(a.date)).getTime());

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap gap-2 justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Sports</h2>
            <p className="text-muted-foreground">Manage sports activities, teams, and competitions.</p>
        </div>
        <div className="flex gap-2">
            <NewTeamDialog />
            <NewCompetitionDialog />
        </div>
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
                                deleteTeam={deleteTeam}
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
            {upcomingCompetitions.length > 0 ? (
                <ul className="space-y-4">
                    {upcomingCompetitions.map(comp => {
                        const team = teamsData.find(t => t.id === comp.ourTeamId);
                        return <CompetitionCard key={comp.id} competition={comp} team={team} />;
                    })}
                </ul>
            ) : (
                <p className="text-muted-foreground text-center py-8">No upcoming sports events scheduled.</p>
            )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><History /> Competition Results</CardTitle>
            <CardDescription>A record of past competitions and their outcomes.</CardDescription>
        </CardHeader>
        <CardContent>
            {pastCompetitions.length > 0 ? (
                <ul className="space-y-4">
                    {pastCompetitions.map(comp => {
                        const team = teamsData.find(t => t.id === comp.ourTeamId);
                        return <CompetitionCard key={comp.id} competition={comp} team={team} />;
                    })}
                </ul>
            ) : (
                <p className="text-muted-foreground text-center py-8">No past competitions found.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
