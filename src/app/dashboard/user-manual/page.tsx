
'use client';
import { useAuth, Role } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Rocket, Lightbulb, Layers, Target, CalendarClock, DollarSign as DollarSignIcon, BrainCircuit, Users, ShieldCheck, Gem, TrendingUp, BookCopy, Award, Trophy, School, Baby, Briefcase, Smartphone, LineChart, Club, KeyRound, Server, UploadCloud, Database, GitBranch, Cloud, Download, Languages, MonitorPlay, CloudCog, Mail, FileText, LifeBuoy, List, HeartHandshake, PenSquare, GraduationCap, Package, UserPlus, History, CalendarCheck, Tv, BarChart, Globe } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { roleLinks, type NavLink } from '@/components/layout/app-sidebar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const userGuides: Record<string, { icon: LucideIcon, title: string, points: string[] }> = {
  GlobalAdmin: {
    icon: Globe,
    title: 'Developer / System Owner Guide',
    points: [
      'System Dashboard: Get a high-level overview of network-wide statistics and run AI-powered analyses across multiple schools.',
      'All Schools Management: View and provision new schools. From here, you can manage a school\'s status (Active, Suspended) and switch context to manage a school directly using the "Log in as user" feature.',
      'System Finance: A comprehensive financial module to manage the platform\'s finances (Annual Recurring Revenue from subscriptions) and the company\'s internal finances (Corporate Ledger and Asset Inventory).',
      'Inbox: Receive, view, and track messages from School Administrators across the network.',
      'Global User Management: Access dedicated pages to view and manage every student and parent account across the entire network, including suspending access.',
      'EduDesk Awards: Configure prizes and announce the annual system-wide awards for top-performing schools, students, and teachers. Click on any winner to get a detailed AI analysis of their success.',
      'Public Kiosk: Access and view the public-facing kiosk display for your corporate headquarters. This includes marketing slides and network-wide data.',
      'System Settings: A dedicated page to configure global settings, such as which slides are visible on the corporate kiosk display.',
      'Activity Logs: View a global feed of all significant actions taken by users across all schools for complete system oversight.',
      'Project Proposal: Review the high-level business and development proposal for EduDesk.',
      'System Documentation: Access technical documentation about the application\'s architecture and technology stack.',
      'To-Do List: View the project\'s development progress and upcoming features.',
    ],
  },
  Admin: {
    icon: ShieldCheck,
    title: 'School Administrator Guide',
    points: [
        'Dashboard: Get a high-level overview of your school\'s statistics. You can also contact the developer from here.',
        'Premium Dashboard: If your school has a Premium subscription, your dashboard shows a multi-school management view. You can see aggregate stats for your group, add new schools to it, and manage each school individually.',
        'AI Academic Reports: Access a suite of AI-powered reports, including a School-Wide Analysis, Class Performance breakdowns, a list of Struggling Students, and data-driven Teacher Performance reviews.',
        'School Profile: View and edit your school\'s core information like name, address, and contact details. Upload a school logo and manage your subscription plan.',
        'Academics: A central hub to manage both course schedules and curriculum syllabi. Define courses, assign them to classes and teachers, and manage the syllabus topics for each subject and grade.',
        'Students & Teachers: View and manage student and teacher profiles. New teachers can be added, and students are enrolled automatically through Admissions.',
        'Classes: Define and manage student groups (e.g., "Class 9-A"). You can also assign a "Head of Class" to delegate certain responsibilities to a teacher.',
        'Admissions: Review and process new student applications. Approving an application automatically creates the student\'s record and links them to their parent\'s account.',
        'Finance: Track school-wide revenue and expenses. Record partial or full payments for student fees and create new ad-hoc fee transactions. Use filters and pagination to manage large datasets and print financial statements.',
        'Sports: Create sports teams, assign coaches, and manage player rosters. You can also delete teams, which will remove associated competitions.',
        'Assets: Manage school equipment and resources.',
        'Examinations: Schedule and manage official examinations.',
        'Kiosk Showcase: Manage the media (images/videos) and configure the slides for your school\'s public-facing kiosk display.',
        'Settings: A central place to manage users, configure the academic calendar (terms & holidays), and define system-wide data like currency, exam boards, and fee descriptions. The system supports specialized roles (e.g., Finance Officer, Counselor) which can be assigned to users to delegate responsibilities.',
        'Messaging, Events, Leaderboards, Profile: Standard modules for communication, scheduling, tracking, and personal settings.',
        'Activity Logs: View a log of all significant actions taken by users within your school. This feed is specific to your school only.',
        'Live Broadcasts: Use the "Contact & Broadcast" button on your dashboard to send real-time alerts to all connected teachers and parents.'
    ]
  },
  AcademicDean: {
      icon: Briefcase,
      title: 'Academic Dean Guide',
      points: [
        'Academics: A central hub to manage both course schedules and curriculum syllabi.',
        'Classes: View and manage student groups.',
        'AI Reports: Access a suite of AI-powered academic reports.',
        'Teachers: View and manage teacher profiles and performance.',
        'Examinations: Schedule and oversee official examinations.',
        'Leaderboards: Monitor school-wide academic rankings.',
      ],
  },
  AdmissionsOfficer: {
      icon: UserPlus,
      title: 'Admissions Officer Guide',
      points: [
          'Admissions: The primary module to review and process new student applications.',
          'Students: View the roster of currently enrolled students.',
          'Classes: Check class capacities to manage enrollment numbers.',
          'Messaging: Communicate with parents regarding their applications.',
      ],
  },
  Counselor: {
      icon: HeartHandshake,
      title: 'Counselor Guide',
      points: [
          'Students: Access student profiles and academic records.',
          'Behavioral Assessments: View and contribute to student behavioral assessments.',
          'Attendance: Monitor student attendance records to identify potential issues.',
          'Grading: View student grades to provide academic support.',
          'Leaderboards: Identify both high-achieving and struggling students.',
      ],
  },
  FinanceOfficer: {
      icon: DollarSignIcon,
      title: 'Finance Officer Guide',
      points: [
          'Finance: Manage all school financial data, including student fees, payments, and expenses.',
          'Assets: Track and manage all school equipment and physical resources.',
      ],
  },
  SportsDirector: {
      icon: Trophy,
      title: 'Sports Director Guide',
      points: [
          'Sports: Manage all sports teams, player rosters, coaches, and competitions.',
          'Events: Schedule sports-related events on the school calendar.',
          'Assets: Manage sports equipment and facility resources.',
      ],
  },
  ITAdmin: {
      icon: Server,
      title: 'IT Administrator Guide',
      points: [
          'Kiosk Showcase: Manage the media and display settings for the school\'s public-facing kiosk.',
          'Assets: Manage all IT-related equipment and software licenses.',
          'User Management (in Settings): View and manage user accounts within the school.',
      ],
  },
  Teacher: {
    icon: PenSquare,
    title: 'Teacher Guide',
    points: [
      'Dashboard: Quickly access common tasks, view your courses, see upcoming deadlines, and run AI analysis on your classes. You can also contact your School Administrator from here.',
      'Live Alerts: Receive real-time broadcast messages from your school administrator on your dashboard.',
      'Take Attendance: A dedicated interface to mark attendance for each of your lessons, including statuses like Present, Late, Absent, and Sick.',
      'AI Lesson Planner: Generate performance-aware weekly lesson plans based on the official syllabus. Plans are automatically saved and can be printed.',
      'AI Test Generator: Create, save, and deploy ad-hoc tests based on syllabus topics. View detailed analytics and results for completed tests.',
      'Grading: Access a dedicated gradebook to enter grades for your students. You can specify the type of assessment (e.g., Test, Coursework) and provide a description.',
      'Behavioral Assessments: Periodically assess students on non-academic traits like respect, participation, social skills, and conduct. This data contributes to holistic student reports.',
      'Schedules: View your teaching schedule based on the courses assigned to you.',
      'Leaderboards: Check academic rankings to see how students are performing.',
      'Profile: View your personal information.',
      'Class Management: If you are designated as a "Head of Class", you will see an extra menu group giving you access to view student profiles and manage behavioral assessments for your assigned class.'
    ]
  },
  Student: {
    icon: GraduationCap,
    title: 'Student Guide',
    points: [
      'Dashboard: See a summary of your academic progress, upcoming assignments, recent grades, an overview of your attendance, and your current school rank.',
      'Live Alerts: Receive real-time broadcast messages from your school on your dashboard.',
      'End of Term Report: Download a comprehensive report card that includes your grades, attendance summary, and behavioral assessments from your teachers.',
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
      'Live Alerts: Receive real-time broadcast messages from your child\'s school on your dashboard.',
      'End of Term Report: Download a comprehensive report card for your selected child, including their grades, attendance, and behavioral assessments.',
      'New Child Applications: Submit new admission applications for your other children. The form will show you available vacancies for the selected grade.',
      'AI-Powered Insights: Receive AI-generated advice based on grades and attendance data on how to support your selected child\'s learning, including their strengths and areas for improvement. This feature is dependent on the school\'s subscription tier.',
      'Finance Portal: View detailed fee information for each child, including total amount, amount paid, and outstanding balance. You can also print a consolidated Family Fee Statement.',
      'Leaderboards: View a personalized report of your children\'s academic rankings in their school, class, and subjects.',
      'Events: Keep track of important school events, with clear labels for which school an event belongs to.',
      'Profile: View your personal details.',
    ]
  },
};

export default function UserManualPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin' && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);


  if (isLoading || (role !== 'GlobalAdmin' && role !== 'Admin')) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const handlePrint = () => {
    window.print();
  };

  const guide = role ? userGuides[role] : null;
  const GuideIcon = guide?.icon;
  
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Manual</h2>
          <p className="text-muted-foreground">A guide on how to use EduDesk, tailored for your role.</p>
        </div>
        <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
      </header>
      
      {role === 'GlobalAdmin' ? (
       <div className="space-y-6">
        <p className="text-muted-foreground print:hidden">A comprehensive guide for all user roles in the EduDesk system.</p>
        {Object.entries(userGuides).map(([roleKey, guide]) => {
          const GuideIcon = guide.icon;
          const menuItems = roleLinks[roleKey as Role] || [];
          const uniqueMenuItems = menuItems.filter((link, index, self) =>
            index === self.findIndex((l) => l.href === link.href)
          );

          return (
            <Card key={guide.title} className="break-inside-avoid">
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
                      if ('links' in item) {
                        return (
                          <div key={item.title}>
                            <p className="font-semibold mt-2">{item.title}</p>
                            <div className="pl-4">
                            {item.links.map(subItem => {
                                const ItemIcon = subItem.icon;
                                return (
                                  <div key={subItem.href} className="flex items-center gap-3 text-sm mt-1">
                                    <ItemIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>{subItem.label}</span>
                                  </div>
                                )
                            })}
                            </div>
                          </div>
                        )
                      }
                      const ItemIcon = item.icon;
                      return (
                        <div key={item.href} className="flex items-center gap-3 text-sm">
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
    ) : (
      <Card>
        {guide && GuideIcon ? (
           <>
            <CardHeader>
                <div className="flex items-center gap-3">
                  <GuideIcon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{guide.title}</CardTitle>
                </div>
                <CardDescription>Key features and functionalities available to you. The application is designed to be fully responsive on desktops, tablets, and mobile devices.</CardDescription>
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
    )}
    </div>
  );
}
