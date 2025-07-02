import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { PenSquare, BookMarked, Bell } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function TeacherDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PenSquare className="h-5 w-5 text-primary" /> Create a Lesson Plan</CardTitle>
            <CardDescription>Use our AI-powered tool to generate lesson plans quickly.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/lesson-planner" passHref className="w-full">
              <Button className="w-full">Create Plan</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookMarked className="h-5 w-5 text-primary" /> Your Courses</CardTitle>
            <CardDescription>View and manage your course schedules and materials.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 Courses</div>
            <p className="text-xs text-muted-foreground">2 new announcements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Upcoming Events</CardTitle>
            <CardDescription>Stay updated with the latest school events.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">Parent-Teacher Conference</p>
            <p className="text-sm text-muted-foreground">Friday, 3:00 PM</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
