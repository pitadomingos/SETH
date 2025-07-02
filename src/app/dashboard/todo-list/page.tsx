
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const completedTasks = [
  'User authentication with three roles (Admin, Teacher, Student)',
  'Role-based dashboards and side navigation',
  'Admin panel for user management',
  'Student, Teacher, and Class management pages for Admins',
  'AI-powered Lesson Planner for Teachers',
  'Schedule and Events pages for all roles',
  'Profile page for users to view their information',
  'Theme switching (light/dark/system)',
  'Initial placeholder pages for all sidebar links',
];

const upcomingFeatures = [
  'Fully implement Admissions, Academics, Examinations, Attendance, Finance, Sports, and Reports pages',
  'Add functionality to "Add User", "Add Student", "Add Teacher", and "Create Class" buttons',
  'Enable profile editing and picture uploading',
  'Implement a notification system',
  'Teacher functionality: Grade assignments, take attendance, manage resources',
  'Student functionality: Submit assignments, view detailed grades',
  'Connect mock data to a real database (e.g., Firestore)',
  'Expand AI features (e.g., grading assistance, student performance analysis)',
];

export default function TodoListPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Project Progress & To-Do List</h2>
        <p className="text-muted-foreground">A tracker for what's done and what's next for the EduManage app.</p>
      </header>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="text-green-500" />Completed Tasks</CardTitle>
            <CardDescription>Features that have been implemented so far.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {completedTasks.map((task, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{task}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="text-amber-500" />Upcoming Features</CardTitle>
            <CardDescription>The next set of features to be developed.</CardDescription>
          </CardHeader>
          <CardContent>
             <ul className="space-y-3">
              {upcomingFeatures.map((task, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Circle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{task}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
