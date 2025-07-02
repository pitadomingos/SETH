'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookCopy, Clock, Star, FileText, Award } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { assignments, grades } from "@/lib/mock-data";

export default function StudentDashboard() {
  const { user } = useAuth();
  const pendingAssignments = assignments.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
            <p className="text-xs text-muted-foreground">{pendingAssignments.filter(a => new Date(a.dueDate) < new Date()).length} overdue</p>
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
      </div>
       <div className="grid gap-6 lg:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>Upcoming Assignments</CardTitle>
                  <CardDescription>Tasks that are due soon.</CardDescription>
              </CardHeader>
              <CardContent>
                   <ul className="space-y-4">
                      {pendingAssignments.slice(0, 3).map((item) => (
                        <li key={item.id} className="flex items-start gap-4">
                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.subject} &middot; Due {new Date(item.dueDate).toLocaleDateString()}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle>Recent Grades</CardTitle>
                  <CardDescription>Your latest graded assignments.</CardDescription>
              </CardHeader>
              <CardContent>
                   <ul className="space-y-4">
                      {grades.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <Award className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-semibold">{item.subject}</p>
                                <p className="text-sm text-muted-foreground">{item.points}/100</p>
                              </div>
                            </div>
                           <Badge variant="secondary" className="text-base font-bold">{item.grade}</Badge>
                        </li>
                      ))}
                    </ul>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
