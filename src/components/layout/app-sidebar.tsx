
'use client';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useAuth, Role } from '@/context/auth-context';
import { 
    GraduationCap, 
    LayoutDashboard, 
    User, 
    BookMarked, 
    PenSquare, 
    ShieldCheck,
    Presentation,
    School,
    UserPlus,
    BookOpen,
    ClipboardList,
    CalendarCheck,
    DollarSign,
    Trophy,
    CalendarDays,
    BarChart3,
    Settings,
    FileText,
    BookUser,
    ListTodo,
    Package,
    Building,
    Award,
    Globe,
    HeartHandshake,
    FlaskConical,
    FileCheck,
    Briefcase,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';

interface NavLink {
    href: string;
    label: string;
    icon: LucideIcon;
}

const commonLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/events', label: 'Events', icon: CalendarDays },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const studentAndTeacherLinks: NavLink[] = [
  { href: '/dashboard/schedule', label: 'Schedules', icon: BookMarked },
  { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Award },
];

const documentationLinks: NavLink[] = [
    { href: '/dashboard/user-manual', label: 'User Manual', icon: BookUser },
];

const roleLinks: Record<Exclude<Role, null>, NavLink[]> = {
  GlobalAdmin: [
    { href: '/dashboard/global-admin', label: 'All Schools', icon: Globe },
    { href: '/dashboard/finance-proposal', label: 'Project Proposal', icon: Briefcase },
    { href: '/dashboard/system-documentation', label: 'System Docs', icon: FileText },
    { href: '/dashboard/todo-list', label: 'To-Do List', icon: ListTodo },
  ],
  Admin: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/school-profile', label: 'School Profile', icon: Building },
    { href: '/dashboard/students', label: 'Students', icon: GraduationCap },
    { href: '/dashboard/teachers', label: 'Teachers', icon: Presentation },
    { href: '/dashboard/classes', label: 'Classes', icon: School },
    { href: '/dashboard/admissions', label: 'Admissions', icon: UserPlus },
    { href: '/dashboard/academics', label: 'Academics', icon: BookOpen },
    { href: '/dashboard/examinations', label: 'Examinations', icon: ClipboardList },
    { href: '/dashboard/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
    { href: '/dashboard/sports', label: 'Sports', icon: Trophy },
    { href: '/dashboard/assets', label: 'Assets', icon: Package },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Award },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/admin', label: 'Admin Panel', icon: ShieldCheck },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/events', label: 'Events', icon: CalendarDays },
  ],
  Teacher: [
    ...commonLinks,
    ...studentAndTeacherLinks,
    { href: '/dashboard/grading', label: 'Grading', icon: FileCheck },
    { href: '/dashboard/lesson-planner', label: 'Lesson Planner', icon: PenSquare },
    { href: '/dashboard/ai-testing', label: 'AI Test Generator', icon: FlaskConical },
  ],
  Student: [
    ...commonLinks,
    ...studentAndTeacherLinks,
  ],
  Parent: [
    ...commonLinks,
    { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Award },
    { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
  ],
};

export function AppSidebar() {
  const { role } = useAuth();
  const pathname = usePathname();
  
  const getLinksForRole = () => {
    if (!role) return [];
    return roleLinks[role] || [];
  }

  const allLinks = getLinksForRole();

  const uniqueLinks = allLinks.filter((link, index, self) =>
    index === self.findIndex((l) => (
      l.href === link.href
    ))
  );

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold font-headline">EduManage</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {uniqueLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(link.href) && (link.href !== '/dashboard' || pathname === '/dashboard')} tooltip={link.label}>
                    <span>
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          <SidebarSeparator />
           {documentationLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href}>
                <SidebarMenuButton asChild isActive={pathname === link.href} tooltip={link.label}>
                    <span>
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 text-center text-xs text-muted-foreground">
          © 2024 EduManage Inc.
        </div>
      </SidebarFooter>
    </>
  );
}
