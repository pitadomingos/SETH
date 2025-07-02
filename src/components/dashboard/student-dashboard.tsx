import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookCopy, Clock, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth-context";

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Mid-terms are next week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 overdue</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8</div>
            <p className="text-xs text-muted-foreground">Up from 3.7 last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
             <Progress value={75} className="w-full" aria-label="75% of courses completed" />
             <p className="text-xs text-muted-foreground mt-2">75% of courses completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
