
'use client';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth, Role } from '@/context/auth-context';
import { 
    GraduationCap, 
    LayoutDashboard, 
    User,
    Settings,
    BookOpen,
    Users,
    ClipboardList,
    DollarSign,
    Calendar,
    Presentation,
    LifeBuoy,
    Megaphone,
    FileText,
    HeartHandshake,
    ShieldCheck,
    Trophy,
    FlaskConical,
    PenSquare,
    Library,
    GitBranch,
    Home,
    MonitorPlay,
    School,
    Heart,
    Briefcase,
    Building,
    Mail,
    List,
    UserPlus,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useMemo } from 'react';

export interface NavLink {
    href: string;
    label: string;
    icon: LucideIcon;
    pro?: boolean; // Feature is available on Pro or higher
}

export const roleLinks: Record<Role, NavLink[]> = {
  GlobalAdmin: [
    { href: '/dashboard/global-admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/global-admin/all-schools', label: 'All Schools', icon: Building },
    { href: '/dashboard/global-admin/inbox', label: 'Inbox', icon: Mail },
    { href: '/dashboard/global-admin/students', label: 'All Students', icon: Users },
    { href: '/dashboard/global-admin/parents', label: 'All Parents', icon: HeartHandshake },
    { href: '/dashboard/global-admin/teachers', label: 'All Teachers', icon: Presentation },
    { href: '/dashboard/global-admin/awards', label: 'Annual Awards', icon: Trophy },
    { href: '/dashboard/global-admin/settings', label: 'Kiosk Settings', icon: MonitorPlay },
    { href: '/dashboard/project-proposal', label: 'Project Proposal', icon: FileText },
    { href: '/dashboard/system-documentation', label: 'System Docs', icon: GitBranch },
    { href: '/dashboard/todo-list', label: 'To-Do List', icon: List },
    { href: '/dashboard/user-manual', label: 'User Manual', icon: LifeBuoy },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
  Admin: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/school-profile', label: 'School Profile', icon: School },
    { href: '/dashboard/academics', label: 'Academics', icon: BookOpen },
    { href: '/dashboard/students', label: 'Students', icon: Users },
    { href: '/dashboard/teachers', label: 'Teachers', icon: Presentation },
    { href: '/dashboard/classes', label: 'Classes', icon: Library },
    { href: '/dashboard/admissions', label: 'Admissions', icon: UserPlus, pro: true },
    { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
    { href: '/dashboard/reports', label: 'AI Reports', icon: BrainCircuit, pro: true },
    { href: '/dashboard/events', label: 'Events', icon: Calendar },
    { href: '/dashboard/sports', label: 'Sports', icon: Trophy },
    { href: '/dashboard/assets', label: 'Assets', icon: Briefcase },
    { href: '/dashboard/examinations', label: 'Examinations', icon: ClipboardList },
    { href: '/dashboard/kiosk-showcase', label: 'Kiosk Showcase', icon: MonitorPlay },
    { href: '/dashboard/messaging', label: 'Messaging', icon: Mail },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/activity-logs', label: 'Activity Logs', icon: History },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
  Teacher: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/schedule', label: 'My Schedule', icon: Calendar },
    { href: '/dashboard/lesson-planner', label: 'AI Lesson Planner', icon: PenSquare, pro: true },
    { href: '/dashboard/ai-testing', label: 'AI Test Generator', icon: FlaskConical, pro: true },
    { href: '/dashboard/grading', label: 'Gradebook', icon: GraduationCap },
    { href: '/dashboard/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/dashboard/behavioral', label: 'Behavioral', icon: Heart },
    { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Trophy },
    { href: '/dashboard/messaging', label: 'Messaging', icon: Mail },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
  Student: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/schedule', label: 'My Schedule', icon: Calendar },
    { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Trophy },
    { href: '/dashboard/events', label: 'School Events', icon: Megaphone },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
  Parent: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/leaderboards', label: 'Rankings', icon: Trophy },
    { href: '/dashboard/finance', label: 'Family Fees', icon: DollarSign },
    { href: '/dashboard/events', label: 'School Events', icon: Megaphone },
    { href: '/dashboard/messaging', label: 'Messaging', icon: Mail },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
};

export function AppSidebar() {
  const { role, user } = useAuth();
  const pathname = usePathname();
  const { schoolProfile, schoolGroups } = useSchoolData();

  const isPremiumAdmin = useMemo(() => {
    if (role !== 'Admin' || !user?.schoolId || !schoolGroups) return false;
    return Object.values(schoolGroups).some(group => group.includes(user.schoolId!));
  }, [role, user, schoolGroups]);

  let links = role ? roleLinks[role] : [];
  
  // Add multi-school link for premium admins
  if (isPremiumAdmin) {
    links = [
        ...links,
        { href: '/dashboard/manage-schools', label: 'Manage Schools', icon: Building }
    ].sort((a,b) => a.href === '/dashboard' ? -1 : 1);
  }

  // Filter out Pro features if on Starter plan
  if (schoolProfile && schoolProfile.tier === 'Starter') {
    links = links.filter(link => !link.pro);
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold font-headline">EduDesk</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === link.href}
                  tooltip={link.label}
                >
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
          © 2024 Pixel Digital Solutions
        </div>
      </SidebarFooter>
    </>
  );
}
