'use client';
import { useAuth } from '@/context/auth-context';
import { studentCourses, teacherCourses } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function SchedulePage() {
  const { role } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Course Schedules</h2>
        <p className="text-muted-foreground">View your current course information.</p>
      </header>
      {role === 'Teacher' && <TeacherSchedule />}
      {role === 'Student' && <StudentSchedule />}
      {role === 'Admin' && 
        <Card>
          <CardHeader>
            <CardTitle>Administrator View</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Admins can view all schedules and student data via reporting tools and student/teacher profile pages.</p>
          </CardContent>
        </Card>
      }
    </div>
  );
}

function TeacherSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Teaching Schedule</CardTitle>
        <CardDescription>A list of courses you are currently teaching.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course ID</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead className="text-right">Enrolled Students</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacherCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell><Badge variant="outline">{course.id}</Badge></TableCell>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>{course.schedule}</TableCell>
                <TableCell className="text-right">{course.students}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StudentSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Enrolled Courses</CardTitle>
        <CardDescription>An overview of your current classes and progress.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Course Name</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>{course.teacher}</TableCell>
                <TableCell><Badge variant="secondary">{course.grade}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={course.progress} className="w-24" aria-label={`Course progress: ${course.progress}%`} />
                    <span className="text-muted-foreground">{course.progress}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
