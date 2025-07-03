'use client';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, PenSquare, GraduationCap, HeartHandshake, Globe, Loader2 } from 'lucide-react';

const userGuides = {
  GlobalAdmin: {
    icon: Globe,
    title: 'Global Administrator Guide',
    points: [
      'Global Dashboard: Get a high-level overview of all schools in the system.',
      'School Management: View key statistics for each school and access their individual management dashboards (simulation).',
      'System Documentation: Access technical documentation about the application\'s architecture and technology stack.',
      'To-Do List: View the project\'s development progress and upcoming features.',
    ],
  },
  Admin: {
    icon: ShieldCheck,
    title: 'School Administrator Guide',
    points: [
        'Dashboard: Get a high-level overview of your school\'s statistics, including student counts, financial summaries, and performance charts.',
        'School Profile: View your school\'s core information like name, address, and contact details.',
        'User Management: View student and teacher profiles via the Students and Teachers pages.',
        'Finance: Track school-wide revenue and expenses. Record partial or full payments for student fees and create new ad-hoc fee transactions (e.g., for lab fees or field trips).',
        'Admissions, Academics, etc: Manage all core school functions from their respective pages in the sidebar.',
        'Leaderboards: View top student rankings across the school by overall GPA, class, and subject.',
        'Admin Panel: Manage system-wide data, such as adding new Examination Boards.',
    ]
  },
  Teacher: {
    icon: PenSquare,
    title: 'Teacher Guide',
    points: [
      'Dashboard: Quickly access common actions, view your courses, see upcoming deadlines, and analyze grade distributions.',
      'Grading: Access a dedicated page to enter grades for students in your classes. These grades are instantly reflected throughout the app.',
      'AI Lesson Planner: Use the AI-powered tool to automatically generate detailed lesson plans.',
      'AI Test Generator: Create ad-hoc multiple-choice tests on any topic for your classes. The AI generates questions and answers for your review before deployment.',
      'Schedules: View your teaching schedule and assigned courses.',
      'Leaderboards: Check academic rankings to see how students are performing overall, within classes, and by subject.',
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
