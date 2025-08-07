
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
} from 'lucide-react';
import { usePathname, Link } from '@/navigation';
import { type LucideIcon } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

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
    { href: '/dashboard/global-admin', label: 'sidebar.dashboard', icon: LayoutDashboard },
    {
      title: 'sidebar.networkManagement',
      links: [
        { href: '/dashboard/global-admin/all-schools', label: 'sidebar.allSchools', icon: Building },
        { href: '/dashboard/global-admin/inbox', label: 'sidebar.inbox', icon: Mail },
        { href: '/dashboard/global-admin/finance', label: 'sidebar.systemFinance', icon: DollarSign },
        { href: '/dashboard/global-admin/students', label: 'sidebar.allStudents', icon: Users },
        { href: '/dashboard/global-admin/parents', label: 'sidebar.allParents', icon: HeartHandshake },
        { href: '/dashboard/global-admin/teachers', label: 'sidebar.allTeachers', icon: Presentation },
        { href: '/dashboard/global-admin/awards', label: 'sidebar.annualAwards', icon: Trophy },
      ]
    },
    {
      title: 'sidebar.systemInfo',
      links: [
        { href: '/dashboard/kiosk-showcase', label: 'sidebar.kioskShowcase', icon: MonitorPlay },
        { href: '/kiosk/global', label: 'sidebar.publicKiosk', icon: Tv, dynamic: false, target: '_blank' },
        { href: '/dashboard/activity-logs', label: 'sidebar.activityLogs', icon: History },
        { href: '/dashboard/project-proposal', label: 'sidebar.projectProposal', icon: FileText },
        { href: '/proposal-slides', label: 'sidebar.presentationSlides', icon: MonitorPlay, target: '_blank' },
        { href: '/dashboard/system-documentation', label: 'sidebar.systemDocs', icon: GitBranch },
        { href: '/dashboard/todo-list', label: 'sidebar.todoList', icon: List },
      ]
    },
    { href: '/dashboard/user-manual', label: 'sidebar.userManual', icon: LifeBuoy },
    { href: '/dashboard/profile', label: 'sidebar.myProfile', icon: User },
  ],
  Admin: [
    { href: '/dashboard', label: 'sidebar.dashboard', icon: LayoutDashboard },
    {
      title: 'sidebar.academics',
      links: [
        { href: '/dashboard/academics', label: 'sidebar.curriculum', icon: BookOpen },
        { href: '/dashboard/classes', label: 'sidebar.classes', icon: Library },
        { href: '/dashboard/reports', label: 'sidebar.aiReports', icon: BrainCircuit, pro: true },
        { href: '/dashboard/admissions', label: 'sidebar.admissions', icon: UserPlus, pro: true },
      ],
    },
    {
      title: 'sidebar.operations',
      links: [
        { href: '/dashboard/students', label: 'sidebar.students', icon: Users },
        { href: '/dashboard/teachers', label: 'sidebar.teachers', icon: Presentation },
        { href: '/dashboard/finance', label: 'sidebar.finance', icon: DollarSign },
        { href: '/dashboard/events', label: 'sidebar.events', icon: Calendar },
        { href: '/dashboard/sports', label: 'sidebar.sports', icon: Trophy },
        { href: '/dashboard/assets', label: 'sidebar.assets', icon: Package },
        { href: '/dashboard/messaging', label: 'sidebar.messaging', icon: Mail },
        { href: '/dashboard/activity-logs', label: 'sidebar.activityLogs', icon: History },
      ],
    },
    {
        title: 'sidebar.school',
        links: [
            { href: '/dashboard/kiosk-showcase', label: 'sidebar.kioskShowcase', icon: MonitorPlay },
            { href: '/kiosk/[schoolId]', label: 'sidebar.publicKiosk', icon: Tv, dynamic: true, target: '_blank' },
            { href: '/dashboard/settings', label: 'sidebar.settings', icon: Settings },
        ]
    },
    { href: '/dashboard/profile', label: 'sidebar.myProfile', icon: User },
  ],
  Teacher: [
    { href: '/dashboard', label: 'sidebar.dashboard', icon: LayoutDashboard },
    {
      title: 'sidebar.instruction',
      links: [
        { href: '/dashboard/schedule', label: 'sidebar.mySchedule', icon: Calendar },
        { href: '/dashboard/lesson-planner', label: 'sidebar.aiLessonPlanner', icon: PenSquare, pro: true },
        { href: '/dashboard/ai-testing', label: 'sidebar.aiTestGenerator', icon: FlaskConical, pro: true },
      ]
    },
    {
      title: 'sidebar.studentManagement',
      links: [
        { href: '/dashboard/grading', label: 'sidebar.gradebook', icon: GraduationCap },
        { href: '/dashboard/attendance', label: 'sidebar.attendance', icon: CalendarCheck },
        { href: '/dashboard/behavioral', label: 'sidebar.behavioral', icon: Heart },
        { href: '/dashboard/leaderboards', label: 'sidebar.leaderboards', icon: Trophy },
      ]
    },
    {
      title: 'sidebar.communication',
      links: [
        { href: '/dashboard/messaging', label: 'sidebar.messaging', icon: Mail },
        { href: '/dashboard/profile', label: 'sidebar.myProfile', icon: User },
      ]
    }
  ],
  Student: [
    { href: '/dashboard', label: 'sidebar.dashboard', icon: LayoutDashboard },
    { href: '/dashboard/schedule', label: 'sidebar.mySchedule', icon: Calendar },
    { href: '/dashboard/leaderboards', label: 'sidebar.leaderboards', icon: Trophy },
    { href: '/dashboard/events', label: 'sidebar.schoolEvents', icon: Megaphone },
    { href: '/dashboard/profile', label: 'sidebar.myProfile', icon: User },
  ],
  Parent: [
    { href: '/dashboard', label: 'sidebar.dashboard', icon: LayoutDashboard },
    { href: '/dashboard/leaderboards', label: 'sidebar.rankings', icon: Trophy },
    { href: '/dashboard/finance', label: 'sidebar.familyFees', icon: DollarSign },
    { href: '/dashboard/events', label: 'sidebar.schoolEvents', icon: Megaphone },
    { href: '/dashboard/messaging', label: 'sidebar.messaging', icon: Mail },
    { href: '/dashboard/profile', label: 'sidebar.myProfile', icon: User },
  ],
};

export function AppSidebar() {
  const { role, user } = useAuth();
  const pathname = usePathname();
  const { schoolProfile, schoolGroups } = useSchoolData();
  const { setOpenMobile } = useSidebar();
  
  const t = useTranslations('AppSidebar');

  const isPremiumAdmin = useMemo(() => {
    if (role !== 'Admin' || !user?.schoolId || !schoolGroups) return false;
    return Object.values(schoolGroups).some(group => group.includes(user.schoolId!));
  }, [role, user, schoolGroups]);

  let navItems = role ? roleLinks[role] : [];
  
  // Add multi-school link for premium admins
  if (isPremiumAdmin) {
    navItems = [
      ...navItems,
      { 
        title: 'sidebar.groupManagement',
        links: [
            { href: '/dashboard/manage-schools', label: 'sidebar.manageSchools', icon: Building }
        ]
      }
    ].sort((a,b) => (a as NavLink).href === '/dashboard' ? -1 : 1);
  }

  // Filter out Pro features if on Starter plan
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
                        <SidebarGroupLabel>{t(item.title.replace('sidebar.', ''))}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            {item.links.map(link => {
                                const finalHref = (link.dynamic && user?.schoolId) 
                                ? link.href.replace('[schoolId]', user.schoolId)
                                : link.href;
                                const translatedLabel = t(link.label.replace('sidebar.', ''));
                                return (
                                    <SidebarMenuItem key={link.href}>
                                        <Link href={finalHref} target={link.target || undefined} onClick={() => setOpenMobile(false)}>
                                            <SidebarMenuButton asChild isActive={pathname === finalHref} tooltip={translatedLabel}>
                                                <span><link.icon className="h-4 w-4" /><span>{translatedLabel}</span></span>
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
            const translatedLabel = t(item.label.replace('sidebar.', ''));
            
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={finalHref} target={item.target || undefined} onClick={() => setOpenMobile(false)}>
                  <SidebarMenuButton asChild isActive={pathname === finalHref} tooltip={translatedLabel}>
                    <span><item.icon className="h-4 w-4" /><span>{translatedLabel}</span></span>
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
