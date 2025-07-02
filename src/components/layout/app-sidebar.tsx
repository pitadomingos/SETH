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
import { GraduationCap, LayoutDashboard, Calendar, User, BookMarked, PenSquare, ShieldCheck } from 'lucide-react';
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
  { href: '/dashboard/schedule', label: 'Schedules', icon: BookMarked },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const roleLinks: Record<Exclude<Role, null>, NavLink[]> = {
  Admin: [
    { href: '/dashboard/admin', label: 'Admin Panel', icon: ShieldCheck },
  ],
  Teacher: [
    { href: '/dashboard/lesson-planner', label: 'Lesson Planner', icon: PenSquare },
  ],
  Student: [],
};

export function AppSidebar() {
  const { role } = useAuth();
  const pathname = usePathname();
  
  const allLinks = role ? [...commonLinks, ...roleLinks[role]] : [];
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
              <Link href={link.href} passHref>
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
