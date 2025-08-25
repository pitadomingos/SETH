
'use client';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
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
    BrainCircuit,
    History,
    CalendarCheck,
    Tv,
    Package,
    Award,
    Club,
    KeyRound,
    Server,
    UploadCloud,
    Database,
    Languages,
    UserCog,
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
    pro?: boolean;
    dynamic?: boolean;
    target?: string;
}

interface NavGroup {
    title: string;
    links: NavLink[];
}

type NavItem = NavLink | NavGroup;

function isGroup(item: NavItem): item is NavGroup {
    return 'title' in item;
}

export const roleLinks: Record<Role, NavItem[]> = {
  GlobalAdmin: [
    { href: '/dashboard/global-admin', label: 'Dashboard', icon: LayoutDashboard },
    {
      title: 'Network Management',
      links: [
        { href: '/dashboard/global-admin/all-schools', label: 'All Schools', icon: Building },
        { href: '/dashboard/global-admin/inbox', label: 'Inbox', icon: Mail },
        { href: '/dashboard/global-admin/finance', label: 'System Finance', icon: DollarSign },
        { href: '/dashboard/global-admin/students', label: 'All Students', icon: Users },
        { href: '/dashboard/global-admin/parents', label: 'All Parents', icon: HeartHandshake },
        { href: '/dashboard/global-admin/teachers', label: 'All Teachers', icon: Presentation },
        { href: '/dashboard/global-admin/awards', label: 'Annual Awards', icon: Trophy },
      ]
    },
    {
      title: 'System & Info',
      links: [
        { href: '/dashboard/kiosk-showcase', label: 'Kiosk Showcase', icon: MonitorPlay },
        { href: '/kiosk/global', label: 'Public Kiosk', icon: Tv, dynamic: false, target: '_blank' },
        { href: '/dashboard/activity-logs', label: 'Activity Logs', icon: History },
        { href: '/dashboard/project-proposal', label: 'Project Proposal', icon: FileText },
        { href: '/proposal-slides', label: 'Presentation Slides', icon: MonitorPlay, target: '_blank' },
        { href: '/dashboard/system-documentation', label: 'System Docs', icon: GitBranch },
        { href: '/dashboard/todo-list', label: 'To-Do List', icon: List },
      ]
    },
    { href: '/dashboard/user-manual', label: 'User Manual', icon: LifeBuoy },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
  Admin: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      title: 'Academics',
      links: [
        { href: '/dashboard/academics', label: 'Curriculum', icon: BookOpen },
        { href: '/dashboard/classes', label: 'Classes', icon: Library },
        { href: '/dashboard/reports', label: 'AI Reports', icon: BrainCircuit, pro: true },
        { href: '/dashboard/admissions', label: 'Admissions', icon: UserPlus, pro: true },
      ],
    },
    {
      title: 'Operations',
      links: [
        { href: '/dashboard/students', label: 'Students', icon: Users },
        { href: '/dashboard/teachers', label: 'Teachers', icon: Presentation },
        { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
        { href: '/dashboard/events', label: 'Events', icon: Calendar },
        { href: '/dashboard/sports', label: 'Sports', icon: Trophy },
        { href: '/dashboard/assets', label: 'Assets', icon: Package },
        { href: '/dashboard/messaging', label: 'Messaging', icon: Mail },
        { href: '/dashboard/activity-logs', label: 'Activity Logs', icon: History },
      ],
    },
    {
        title: 'School',
        links: [
            { href: '/dashboard/kiosk-showcase', label: 'Kiosk Showcase', icon: MonitorPlay },
            { href: '/kiosk/[schoolId]', label: 'Public Kiosk', icon: Tv, dynamic: true, target: '_blank' },
            { href: '/dashboard/settings', label: 'Settings', icon: Settings },
        ]
    },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
    { href: '/dashboard/user-manual', label: 'User Manual', icon: LifeBuoy },
  ],
  Teacher: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      title: 'Instruction',
      links: [
        { href: '/dashboard/schedule', label: 'My Schedule', icon: Calendar },
        { href: '/dashboard/lesson-planner', label: 'AI Lesson Planner', icon: PenSquare, pro: true },
        { href: '/dashboard/ai-testing', label: 'AI Test Generator', icon: FlaskConical, pro: true },
      ]
    },
    {
      title: 'Student Management',
      links: [
        { href: '/dashboard/grading', label: 'Gradebook', icon: GraduationCap },
        { href: '/dashboard/attendance', label: 'Attendance', icon: CalendarCheck },
        { href: '/dashboard/behavioral', label: 'Behavioral', icon: Heart },
        { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Trophy },
      ]
    },
    {
      title: 'Communication',
      links: [
        { href: '/dashboard/messaging', label: 'Messaging', icon: Mail },
        { href: '/dashboard/profile', label: 'My Profile', icon: User },
      ]
    }
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
  AcademicDean: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/academics', label: 'Curriculum', icon: BookOpen },
    { href: '/dashboard/classes', label: 'Classes', icon: Library },
    { href: '/dashboard/reports', label: 'AI Reports', icon: BrainCircuit, pro: true },
    { href: '/dashboard/teachers', label: 'Teachers', icon: Presentation },
    { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Trophy },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
  AdmissionsOfficer: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admissions', label: 'Admissions', icon: UserPlus, pro: true },
    { href: '/dashboard/students', label: 'Students', icon: Users },
    { href: '/dashboard/classes', label: 'Classes', icon: Library },
    { href: '/dashboard/messaging', label: 'Messaging', icon: Mail },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
  Counselor: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/students', label: 'Students', icon: Users },
      { href: '/dashboard/behavioral', label: 'Behavioral', icon: Heart },
      { href: '/dashboard/attendance', label: 'Attendance', icon: CalendarCheck },
      { href: '/dashboard/grading', label: 'Gradebook', icon: GraduationCap },
      { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Trophy },
      { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
  FinanceOfficer: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
      { href: '/dashboard/assets', label: 'Assets', icon: Package },
      { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
  SportsDirector: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/sports', label: 'Sports', icon: Trophy },
      { href: '/dashboard/events', label: 'Events', icon: Calendar },
      { href: '/dashboard/assets', label: 'Assets', icon: Package },
      { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
  ITAdmin: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/kiosk-showcase', label: 'Kiosk Showcase', icon: MonitorPlay },
      { href: '/dashboard/assets', label: 'Assets', icon: Package },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
      { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ],
};

export function AppSidebar() {
  const { role, user } = useAuth();
  const pathname = usePathname();
  const { schoolProfile, schoolGroups, classesData } = useSchoolData();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isPremiumAdmin = useMemo(() => {
    if (role !== 'Admin' || !user?.schoolId || !schoolGroups) return false;
    return Object.values(schoolGroups).some(group => group.includes(user.schoolId!));
  }, [role, user, schoolGroups]);
  
  const isHeadOfClass = useMemo(() => {
    if (role !== 'Teacher' || !user) return false;
    // Find the teacher's ID from their email
    const teacherId = schoolProfile?.teachers.find(t => t.email === user.email)?.id;
    if (!teacherId) return false;
    // Check if this teacherId is assigned as head of any class
    return classesData.some(c => c.headOfClassId === teacherId);
  }, [role, user, schoolProfile, classesData]);

  let navItems = role ? [...roleLinks[role]] : [];
  
  if (isPremiumAdmin) {
    navItems = [
      ...navItems,
      { 
        title: 'Group Management',
        links: [
            { href: '/dashboard/manage-schools', label: 'Manage Schools', icon: Building }
        ]
      }
    ].sort((a,b) => a.href === '/dashboard' ? -1 : 1);
  }
  
  if (isHeadOfClass) {
    const classManagementGroup = {
      title: 'Class Management',
      links: [
        { href: '/dashboard/students', label: 'Students', icon: Users },
        { href: '/dashboard/behavioral', label: 'Behavioral', icon: Heart },
      ]
    };
    // Insert after the 'Instruction' group for teachers
    const instructionIndex = navItems.findIndex(item => isGroup(item) && item.title === 'Instruction');
    if (instructionIndex !== -1) {
      navItems.splice(instructionIndex + 1, 0, classManagementGroup);
    } else {
      navItems.splice(1, 0, classManagementGroup); // Fallback position
    }
  }

  if (schoolProfile && schoolProfile.tier === 'Starter') {
    navItems = navItems.map(item => {
        if(isGroup(item)) {
            return { ...item, links: item.links.filter(link => !link.pro) };
        }
        return item;
    }).filter(item => !isGroup(item) || item.links.length > 0);
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
          {navItems.map((item, index) => {
            if(isGroup(item)) {
                return (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            {item.links.map(link => {
                                const finalHref = (link.dynamic && user?.schoolId) 
                                ? link.href.replace('[schoolId]', user.schoolId)
                                : link.href;
                                return (
                                    <SidebarMenuItem key={link.href}>
                                        <Link href={finalHref} passHref target={link.target} onClick={handleLinkClick}>
                                            <SidebarMenuButton asChild isActive={pathname === finalHref} tooltip={link.label}>
                                                <span><link.icon className="h-4 w-4" /><span>{link.label}</span></span>
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarGroupContent>
                    </SidebarGroup>
                )
            }
            const finalHref = (item.dynamic && user?.schoolId) 
              ? item.href.replace('[schoolId]', user.schoolId)
              : item.href;
            
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={finalHref} passHref target={item.target} onClick={handleLinkClick}>
                  <SidebarMenuButton asChild isActive={pathname === finalHref} tooltip={item.label}>
                    <span><item.icon className="h-4 w-4" /><span>{item.label}</span></span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
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
