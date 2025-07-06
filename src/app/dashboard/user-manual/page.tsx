
'use client';
import { useAuth, Role } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, PenSquare, GraduationCap, HeartHandshake, Globe, Loader2, List } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { roleLinks, type NavLink } from '@/components/layout/app-sidebar';

const userGuides: Record<string, { icon: LucideIcon, title: string, points: string[] }> = {
  GlobalAdmin: {
    icon: Globe,
    title: 'Developer / System Owner Guide',
    points: [
      'System Dashboard: Get a high-level overview of network-wide statistics and run AI-powered analyses across multiple schools.',
      'All Schools Management: View all schools in the system. From here, you can manage a school\'s status (Active, Suspended) and switch context to manage a school directly.',
      'Inbox: Receive, view, and track messages from School Administrators across the network.',
      'Global User Management: Access dedicated pages to view and manage every student and parent account across the entire network, including suspending access.',
      'Activity Logs: View a global feed of all significant actions taken by users across all schools for complete system oversight.',
      'Project Proposal: Review the high-level business and development proposal for EduManage.',
      'System Documentation: Access technical documentation about the application\'s architecture and technology stack.',
      'To-Do List: View the project\'s development progress and upcoming features.',
    ],
  },
  Admin: {
    icon: ShieldCheck,
    title: 'School Administrator Guide',
    points: [
        'Dashboard: Get a high-level overview of your school\'s statistics. You can also contact the developer from here.',
        'AI Academic Reports: Access a suite of AI-powered reports, including a School-Wide Analysis, Class Performance breakdowns, a list of Struggling Students, and data-driven Teacher Performance reviews.',
        'School Profile: View and edit your school\'s core information like name, address, and contact details. Upload a school logo and manage your subscription plan.',
        'User Management: View student and teacher profiles. New teachers can be added, and students are enrolled automatically through Admissions.',
        'Admissions: Review and process new student applications. Approving an application automatically creates the student\'s record and links them to their parent\'s account.',
        'Course Management (Academics): Define courses by assigning a subject, teacher, and a recurring weekly schedule to a class section.',
        'Class Management (Classes): Define and manage student groups (e.g., "Class 9-A").',
        'Finance: Track school-wide revenue and expenses. Record partial or full payments for student fees and create new ad-hoc fee transactions.',
        'Sports Management: Create sports teams, assign coaches, and manage player rosters. You can also delete teams, which will remove associated competitions.',
        'Event Management: Create and schedule new school events from the Events page, including details like location, organizer, and target audience.',
        'Admin Panel: Configure system-wide data. You can now add and delete items like Examination Boards, Fee Descriptions, and Event Audiences.',
        'Inbox: Receive and manage messages from your school\'s teachers. You can mark messages as resolved.',
        'Activity Logs: Review a log of all recent activities within your school to track user actions and system changes.',
        'Leaderboards: Check academic rankings to see how students are performing.',
        'Settings: Configure application-wide behavior, such as the grading display format (e.g., 20-Point Scale, Letter Grades, GPA).',
    ]
  },
  Teacher: {
    icon: PenSquare,
    title: 'Teacher Guide',
    points: [
      'Dashboard: Quickly access common actions, view your courses, see upcoming deadlines, and run AI analysis on your classes. You can also contact your School Administrator from here.',
      'AI Lesson Planner: Generate performance-aware weekly lesson plans. Plans are automatically saved and can be printed for classroom use.',
      'AI Test Generator: Create, save, and delete ad-hoc tests. Deploy your saved tests to classes with specific deadlines.',
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
      'Take Assigned Tests: View tests assigned to you on your dashboard, complete them through a dedicated interface, and receive your AI-generated score immediately upon submission.',
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
      'New Child Applications: Submit new admission applications for your other children. The form will show you available vacancies for the selected grade.',
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

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (role === 'GlobalAdmin') {
    return (
       <div className="space-y-6 animate-in fade-in-50">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">System User Manuals</h2>
          <p className="text-muted-foreground">A comprehensive guide for all user roles in the EduManage system.</p>
        </header>
        <div className="space-y-6">
          {Object.entries(userGuides).map(([roleKey, guide]) => {
            const GuideIcon = guide.icon;
            const menuItems = roleLinks[roleKey as Role] || [];
            const uniqueMenuItems = menuItems.filter((link, index, self) =>
              index === self.findIndex((l) => l.href === link.href)
            );

            return (
              <Card key={guide.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GuideIcon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">{guide.title}</CardTitle>
                  </div>
                  <CardDescription>Key features and functionalities available to this role.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">Core Features</h4>
                    <ul className="list-disc space-y-3 pl-6 text-muted-foreground">
                      {guide.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><List className="h-4 w-4"/> Sidebar Menu</h4>
                    <div className="space-y-2 p-3 bg-muted rounded-md">
                      {uniqueMenuItems.map((item, index) => {
                        const ItemIcon = item.icon;
                        return (
                          <div key={index} className="flex items-center gap-3 text-sm">
                            <ItemIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{item.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const guide = role ? userGuides[role] : null;
  const GuideIcon = guide?.icon;
  
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
