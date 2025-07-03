
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData } from '@/context/school-data-context';
import { Trophy, Users, CalendarPlus, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SportsPage() {
  const { role } = useAuth();
  const { events } = useSchoolData();
  const router = useRouter();

  if (role && role !== 'Admin') {
      router.push('/dashboard');
      return null;
  }
  
  const sportsEvents = events.filter(e => e.type === 'Sports');

  const teams = [
      { name: 'Basketball', players: 25, icon: '🏀' },
      { name: 'Football', players: 30, icon: '⚽' },
      { name: 'Swimming', players: 18, icon: '🏊' },
      { name: 'Athletics', players: 40, icon: '🏃' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Sports</h2>
            <p className="text-muted-foreground">Manage sports activities, teams, and competitions.</p>
        </div>
        <Button><PlusCircle className="mr-2 h-4 w-4"/>Add Team</Button>
      </header>

        <Card>
            <CardHeader>
                <CardTitle>School Teams</CardTitle>
                <CardDescription>Overview of all official school sports teams.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {teams.map(team => (
                    <div key={team.name} className="p-4 bg-muted rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">{team.icon}</span>
                            <div>
                                <h3 className="font-semibold">{team.name}</h3>
                                <p className="text-sm text-muted-foreground">{team.players} Players</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">Manage</Button>
                    </div>
                ))}
            </CardContent>
        </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy /> Upcoming Competitions</CardTitle>
            <CardDescription>A list of scheduled sports events and competitions.</CardDescription>
        </CardHeader>
        <CardContent>
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
                             <Badge variant="outline">Inter-school</Badge>
                             <Button>View Details</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
