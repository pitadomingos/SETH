
'use client';
import { useAuth } from '@/context/auth-context';
import { useSchoolData } from '@/context/school-data-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';


export default function SchedulePage() {
  const { role } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Course Schedules</h2>
        <p className="text-muted-foreground">View your assigned class sections. Detailed course timetables are configured in the Academics section.</p>
      </header>
      {role === 'Teacher' && <TeacherSchedule />}
      {role === 'Student' && <StudentSchedule />}
      {role === 'Admin' && 
        <Card>
          <CardHeader>
            <CardTitle>Administrator View</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Admins can create class sections on the "Classes" page. Detailed, subject-specific course schedules for these sections will be managed under "Academics".</p>
          </CardContent>
        </Card>
      }
    </div>
  );
}

function TeacherSchedule() {
  const { courses } = useSchoolData();
  const teacherCourses = courses.teacher;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Assigned Classes</CardTitle>
        <CardDescription>A list of class sections where you are the homeroom teacher.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead className="text-right">Enrolled Students</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacherCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>Grade {course.grade}</TableCell>
                <TableCell className="text-right">{course.students}</TableCell>
              </TableRow>
            ))}
             {teacherCourses.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                        You are not currently assigned as a homeroom teacher to any classes.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StudentSchedule() {
  const { courses } = useSchoolData();
  // Note: This 'courses.student' is currently just the student's homeroom class.
  // It will be replaced by a full course list later.
  const studentClass = courses.student.length > 0 ? courses.student[0] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Class Section</CardTitle>
        <CardDescription>Your assigned class section and homeroom teacher.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Homeroom Teacher</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentClass ? (
              <TableRow key={studentClass.id}>
                <TableCell className="font-medium">{studentClass.name}</TableCell>
                <TableCell>{studentClass.teacher}</TableCell>
                <TableCell><Badge variant="secondary">Grade {studentClass.grade}</Badge></TableCell>
              </TableRow>
            ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                        You are not currently enrolled in any class section.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
