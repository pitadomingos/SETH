
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
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';

export interface NavLink {
    href: string;
    label: string;
    icon: LucideIcon;
}

export const roleLinks: Record<Exclude<Role, null>, NavLink[]> = {
  Admin: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ],
  Teacher: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ],
  Student: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ],
};

export function AppSidebar() {
  const { role } = useAuth();
  const pathname = usePathname();

  const links = role ? roleLinks[role] : [];

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
