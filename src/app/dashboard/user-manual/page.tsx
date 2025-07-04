'use client';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, PenSquare, GraduationCap, HeartHandshake, Globe, Loader2 } from 'lucide-react';

const userGuides = {
  GlobalAdmin: {
    icon: Globe,
    title: 'Developer / System Owner Guide',
    points: [
      'Developer Dashboard: Get a high-level overview of all schools in the system from a single dashboard.',
      'School Management Simulation: View key statistics for each school and access their individual management dashboards by clicking "Manage School".',
      'System Documentation: Access technical documentation about the application\'s architecture and technology stack.',
      'Project Proposal: Review the high-level business and development proposal for EduManage.',
      'To-Do List: View the project\'s development progress and upcoming features.',
      'Role Distinction: This "Developer" role is for demo purposes and is distinct from the "Global Admin" role which would be part of an Enterprise tier for customers managing multiple schools.',
    ],
  },
  Admin: {
    icon: ShieldCheck,
    title: 'School Administrator Guide',
    points: [
        'Dashboard: Get a high-level overview of your school\'s statistics, including student counts, financial summaries, and performance charts.',
        'School Profile: View and edit your school\'s core information like name, address, and contact details. Upload a school logo and manage your subscription plan.',
        'User Management: Add and view student and teacher profiles.',
        'Course Management (Academics): Define courses by assigning a subject, teacher, and a recurring weekly schedule to a class section.',
        'Class Management (Classes): Define and manage student groups (e.g., "Class 9-A").',
        'Finance: Track school-wide revenue and expenses. Record partial or full payments for student fees and create new ad-hoc fee transactions. Add and categorize expenses with proof of payment.',
        'Admissions, Examinations, etc: Manage all core school functions from their respective pages in the sidebar.',
        'Sports Management: Create sports teams, assign coaches, and manage player rosters. Schedule new competitions and view upcoming matches.',
        'Event Management: Create and schedule new school events from the Events page, including details like location, organizer, and target audience.',
        'Admin Panel: Configure system-wide data, including the Academic Calendar (Terms & Holidays), Examination Boards, Fee Descriptions, and Event Audiences.',
        'Settings: Configure application-wide behavior, such as the grading display format (e.g., 20-Point Scale, Letter Grades, GPA).',
    ]
  },
  Teacher: {
    icon: PenSquare,
    title: 'Teacher Guide',
    points: [
      'Dashboard: Quickly access common actions, view your courses, see upcoming deadlines, and analyze class performance with AI.',
      'AI Lesson Planner: Generate performance-aware weekly lesson plans. Plans are automatically saved and can be printed for classroom use.',
      'AI Test Generator: Create ad-hoc multiple-choice tests on any topic. The AI generates questions and answers for your review.',
      'Grading: Access a dedicated gradebook to enter grades for students in your classes. These grades are instantly reflected throughout the app.',
      'Schedules: View your teaching schedule based on the courses assigned to you.',
      'Leaderboards: Check academic rankings to see how students are performing.',
      'Profile: View your personal information.',
    ]
  },
  Student: {
    icon: GraduationCap,
    title: 'Student Guide',
    points: [
      'Dashboard: See a summary of your academic progress, upcoming assignments, recent grades, and your current school rank.',
      'Schedules: Check your course schedule, see your teachers, and track your progress in each class.',
      'Leaderboards: See where you rank among your peers in overall, class, and subject-specific leaderboards.',
      'Events: Stay up-to-date with important school events and holidays.',
      'Completion Documents: Preview and download your official certificate and transcript. Access is granted only after all academic (passing grades) and financial (paid fees) requirements have been met.',
      'AI-Powered Guidance: If you do not meet academic requirements, the system provides an AI-generated analysis of your record and offers encouraging suggestions for how to prepare for re-sits.',
      'Profile: View your personal details.',
    ]
  },
  Parent: {
    icon: HeartHandshake,
    title: 'Parent Guide',
    points: [
      'Dashboard: Get a complete overview of your children\'s school life. Click on a child\'s card to update the dashboard with their specific information.',
      'AI-Powered Insights: Receive AI-generated advice on how to support your selected child\'s learning, including their strengths and areas for improvement.',
      'Finance Portal: View detailed fee information for each child, including total amount, amount paid, and outstanding balance.',
      'Leaderboards: View a personalized report of your children\'s academic rankings in their school, class, and subjects.',
      'Events: Keep track of important school events, with clear labels for which school an event belongs to.',
      'Profile: View your personal details.',
    ]
  },
};

export default function UserManualPage() {
  const { role, isLoading } = useAuth();
  const guide = role ? userGuides[role] : null;
  const GuideIcon = guide?.icon;

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">User Manual</h2>
        <p className="text-muted-foreground">A guide on how to use EduManage, tailored for your role. The application is designed to be fully responsive on desktops, tablets, and mobile devices.</p>
      </header>

      <Card>
        {guide && GuideIcon ? (
           <>
            <CardHeader>
                <div className="flex items-center gap-3">
                  <GuideIcon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{guide.title}</CardTitle>
                </div>
                <CardDescription>Key features and functionalities available to you.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc space-y-3 pl-6 text-muted-foreground">
                    {guide.points.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </CardContent>
           </>
        ) : (
            <CardContent className="p-6 text-center text-muted-foreground">
                <p>User guide not available for your role.</p>
            </CardContent>
        )}
      </Card>
    </div>
  );
}
