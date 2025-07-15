
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
    History,
    Mail,
    Lock,
    Gem,
    MonitorPlay,
    Camera,
    HeartPulse,
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

export const roleLinks: Record<Exclude<Role, null>, NavLink[]> = {
  GlobalAdmin: [
    { href: '/dashboard/global-admin', label: 'System Dashboard', icon: Globe },
    { href: '/dashboard/global-admin/all-schools', label: 'All Schools', icon: Building },
    { href: '/dashboard/global-admin/students', label: 'All Students', icon: GraduationCap },
    { href: '/dashboard/global-admin/teachers', label: 'All Teachers', icon: Presentation },
    { href: '/dashboard/global-admin/parents', label: 'All Parents', icon: HeartHandshake },
    { href: '/dashboard/global-admin/inbox', label: 'Messaging', icon: Mail },
    { href: '/dashboard/global-admin/awards', label: 'Awards', icon: Award },
    { href: '/dashboard/global-admin/settings', label: 'System Settings', icon: Settings },
    { href: '/dashboard/activity-logs', label: 'Activity Logs', icon: History },
    { href: '/kiosk/global', label: 'Public Kiosk', icon: MonitorPlay },
    { href: '/dashboard/project-proposal', label: 'Project Proposal', icon: Briefcase },
    { href: '/dashboard/todo-list', label: 'To-Do List', icon: ListTodo },
    { href: '/dashboard/system-documentation', label: 'System Docs', icon: FileText },
  ],
  Admin: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/school-profile', label: 'School Profile', icon: Building },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/students', label: 'Students', icon: GraduationCap },
    { href: '/dashboard/teachers', label: 'Teachers', icon: Presentation },
    { href: '/dashboard/classes', label: 'Classes', icon: School },
    { href: '/dashboard/admissions', label: 'Admissions', icon: UserPlus },
    { href: '/dashboard/academics', label: 'Academics', icon: BookOpen },
    { href: '/dashboard/examinations', label: 'Examinations', icon: ClipboardList },
    { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
    { href: '/dashboard/sports', label: 'Sports', icon: Trophy },
    { href: '/dashboard/assets', label: 'Assets', icon: Package },
    { href: '/dashboard/messaging', label: 'Messaging', icon: Mail },
    { href: '/dashboard/activity-logs', label: 'Activity Logs', icon: History },
    { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Award },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/kiosk-showcase', label: 'Kiosk Showcase', icon: Camera },
    { href: '/dashboard/admin', label: 'Admin Panel', icon: ShieldCheck },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/events', label: 'Events', icon: CalendarDays },
  ],
  Teacher: [
    ...commonLinks,
    ...studentAndTeacherLinks,
    { href: '/dashboard/grading', label: 'Grading', icon: FileCheck },
    { href: '/dashboard/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/dashboard/behavioral', label: 'Behavioral', icon: HeartPulse },
    { href: '/dashboard/lesson-planner', label: 'Lesson Planner', icon: PenSquare },
    { href: '/dashboard/ai-testing', label: 'AI Test Generator', icon: FlaskConical },
    { href: '/dashboard/messaging', label: 'Messaging', icon: Mail },
  ],
  Student: [
    ...commonLinks,
    ...studentAndTeacherLinks,
  ],
  Parent: [
    ...commonLinks,
    { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Award },
    { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
    { href: '/dashboard/messaging', label: 'Messaging', icon: Mail },
  ],
};

export function AppSidebar() {
  const { user, role } = useAuth();
  const { schoolProfile, schoolGroups } = useSchoolData();
  const pathname = usePathname();

  const isPremiumAdmin = useMemo(() => {
    if (role !== 'Admin' || !user?.schoolId || !schoolGroups) return false;
    return Object.values(schoolGroups).some(group => group.includes(user.schoolId!));
  }, [role, user, schoolGroups]);

  const getLinksForRole = () => {
    if (!role) return [];
    let links = [...(roleLinks[role] || [])];
    
    if (role === 'Admin') {
      const kioskLink = { href: `/kiosk/${user?.schoolId}`, label: 'Public Kiosk', icon: MonitorPlay };
      const settingsIndex = links.findIndex(l => l.href === '/dashboard/settings');
      if (settingsIndex !== -1) {
        links.splice(settingsIndex + 1, 0, kioskLink);
      } else {
        links.push(kioskLink);
      }

      if (isPremiumAdmin) {
        const manageLink = { href: '/dashboard/manage-schools', label: 'Manage Schools', icon: Building };
        const profileIndex = links.findIndex(l => l.href === '/dashboard/school-profile');
        if (profileIndex !== -1) {
            links.splice(profileIndex + 1, 0, manageLink);
        } else {
            links.unshift(manageLink);
        }
      }
    }
    return links;
  };

  const allLinks = getLinksForRole();

  const uniqueLinks = allLinks.filter((link, index, self) =>
    index === self.findIndex((l) => (
      l.href === link.href
    ))
  );

  const isSchoolSuspended = schoolProfile?.status && schoolProfile.status !== 'Active';
  const schoolTier = schoolProfile?.tier;

  const proFeaturesForAdmin = ['/dashboard/reports', '/dashboard/admissions'];
  const proFeaturesForTeacher = ['/dashboard/lesson-planner', '/dashboard/ai-testing', '/dashboard/behavioral'];

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
          {uniqueLinks.map((link) => {
            const allowedWhenSuspended = ['/dashboard', '/dashboard/school-profile'];
            const isSuspendedAndLocked = role === 'Admin' && isSchoolSuspended && !allowedWhenSuspended.includes(link.href);

            let isTierLocked = false;
            if (schoolTier === 'Starter') {
              if (role === 'Admin' && proFeaturesForAdmin.includes(link.href)) {
                isTierLocked = true;
              }
              if (role === 'Teacher' && proFeaturesForTeacher.includes(link.href)) {
                isTierLocked = true;
              }
            }

            const isLinkDisabled = isSuspendedAndLocked || isTierLocked;
            const tooltipContent = isTierLocked ? `${link.label} (Upgrade to Pro)` : link.label;

            return (
              <SidebarMenuItem key={link.href}>
                <Link href={isLinkDisabled ? '#' : link.href} passHref style={isLinkDisabled ? { pointerEvents: 'none', cursor: 'not-allowed' } : {}} target={link.label === 'Public Kiosk' ? '_blank' : '_self'}>
                  <SidebarMenuButton asChild disabled={isLinkDisabled} isActive={pathname.startsWith(link.href) && (link.href !== '/dashboard' || pathname === '/dashboard')} tooltip={tooltipContent}>
                      <span>
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                        {isTierLocked && <Lock className="ml-auto h-3 w-3" />}
                      </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
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
          © 2024 Pixel Digital Solutions
        </div>
      </SidebarFooter>
    </>
  );
}
