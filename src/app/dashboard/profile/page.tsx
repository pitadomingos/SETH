
'use client';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save, Share2, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';


function ShareDialog() {
  const { toast } = useToast();
  const referralLink = "https://edumanage.app/demo-trial";

  const handleCopyLink = () => {
    // In a real app, you'd use navigator.clipboard.writeText(referralLink)
    toast({
      title: "Link Copied!",
      description: "You can now share the referral link.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share EduManage</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share EduManage & Earn Rewards</DialogTitle>
          <DialogDescription>
            Share this link with other schools. They can request a demo and you'll be credited for the referral.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={referralLink}
              readOnly
            />
          </div>
          <Button type="button" size="sm" className="px-3" onClick={handleCopyLink}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function ProfilePage() {
    const { user, role } = useAuth();
    const { toast } = useToast();
    const initials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    const [avatarUrl, setAvatarUrl] = useState(`https://placehold.co/200x200.png`);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpdateProfile = () => {
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
    };

    const handlePictureChange = () => {
        const newAvatarUrl = `https://placehold.co/200x200.png?v=${Date.now()}`;
        setAvatarUrl(newAvatarUrl);
        toast({
            title: "Picture Changed",
            description: "Your new profile picture has been set (demo).",
        });
    }

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header>
              <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
              <p className="text-muted-foreground">View your personal details and share the app.</p>
            </header>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Changes made here are for demonstration and will not be saved.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-8 md:grid-cols-3">
                        <div className="flex flex-col items-center gap-4 pt-4 md:col-span-1">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={avatarUrl} alt={user?.name} data-ai-hint="profile picture" />
                                <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                            </Avatar>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handlePictureChange}
                            />
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Change Picture</Button>
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
                        <Button onClick={handleUpdateProfile}><Save className="mr-2 h-4 w-4" /> Update Profile</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Refer & Earn</CardTitle>
                        <CardDescription>Love using EduManage? Share it with other institutions and get rewarded.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Click the button below to get your unique referral link. When a new school signs up using your link, you'll receive a discount on your next renewal.
                        </p>
                         <ShareDialog />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
