'use client';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save } from 'lucide-react';

export default function ProfilePage() {
    const { user, role } = useAuth();
    const initials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header>
              <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
              <p className="text-muted-foreground">View and update your personal details.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Changes made here are for demonstration and will not be saved.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center gap-4 pt-4 md:col-span-1">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={`https://placehold.co/200x200.png`} alt={user?.name} data-ai-hint="profile picture" />
                            <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Change Picture</Button>
                    </div>
                    <div className="space-y-4 md:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" defaultValue={user?.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={user?.email} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" defaultValue={role ?? ''} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button><Save className="mr-2 h-4 w-4" /> Update Profile</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
