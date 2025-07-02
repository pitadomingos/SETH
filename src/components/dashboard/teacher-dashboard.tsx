import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { PenSquare, BookMarked, Bell } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { teacherCourses, events } from "@/lib/mock-data";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const nextEvent = events.filter(e => e.date >= new Date()).sort((a,b) => a.date.getTime() - b.date.getTime())[0];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><PenSquare className="h-6 w-6 text-primary" /> Create Lesson Plan</CardTitle>
            <CardDescription className="pt-2">Use our AI-powered tool to generate detailed lesson plans for your classes quickly and efficiently.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/lesson-planner" passHref className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><BookMarked className="h-6 w-6 text-primary" /> Your Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold">{teacherCourses.length} Courses</div>
            <p className="text-sm text-muted-foreground">You are currently teaching {teacherCourses.reduce((acc, c) => acc + c.students, 0)} students this semester.</p>
          </CardContent>
          <CardFooter>
             <Link href="/dashboard/schedule" passHref className="w-full">
              <Button variant="outline" className="w-full">View Schedule</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><Bell className="h-6 w-6 text-primary" /> Upcoming Event</CardTitle>
          </CardHeader>
           <CardContent>
            {nextEvent ? (
              <>
                <p className="text-lg font-semibold">{nextEvent.title}</p>
                <p className="text-sm text-muted-foreground">{nextEvent.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No upcoming events.</p>
            )}
          </CardContent>
          <CardFooter>
             <Link href="/dashboard/events" passHref className="w-full">
              <Button variant="outline" className="w-full">View All Events</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
