
'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Bell, GraduationCap, ArrowLeftFromLine, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { useSchoolData } from '@/context/school-data-context';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const { user, logout, originalUser } = useAuth();
  const { activityLogs } = useSchoolData();
  const router = useRouter();
  const initials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const notifications = activityLogs.slice(0, 5);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
         <div className="hidden items-center gap-2 md:flex">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">EduDesk</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {originalUser && (
            <div className='flex items-center gap-2'>
                <p className='text-sm text-muted-foreground hidden md:block'>
                   Impersonating <span className='font-semibold text-foreground'>{user?.name}</span>
                </p>
                <Button variant="outline" onClick={logout}>
                    <ArrowLeftFromLine className="mr-2 h-4 w-4" />
                    Return to Admin
                </Button>
            </div>
        )}
        <ThemeToggle />
        {!originalUser && (
            <>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full relative">
                            <Bell className="h-4 w-4" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                         <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         {notifications.length > 0 ? (
                            notifications.map(log => {
                                const logDate = log.timestamp && typeof log.timestamp.toDate === 'function' ? log.timestamp.toDate() : new Date(log.timestamp);
                                return (
                                <DropdownMenuItem key={log.id} className="flex-col items-start gap-1">
                                    <div className="flex justify-between w-full">
                                        <Badge variant="outline">{log.action}</Badge>
                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(logDate, { addSuffix: true })}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground whitespace-normal">{log.user} {log.details.toLowerCase()}</p>
                                </DropdownMenuItem>
                                )
                            })
                         ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No new notifications.
                            </div>
                         )}
                         <DropdownMenuSeparator />
                         <DropdownMenuItem asChild>
                            <Link href="/dashboard/activity-logs">
                                View All Logs
                            </Link>
                         </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profilePictureUrl || `https://placehold.co/100x100.png`} alt={user?.name ?? 'User Avatar'} data-ai-hint="profile picture" />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                        </p>
                    </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </>
        )}
      </div>
    </header>
  );
}
