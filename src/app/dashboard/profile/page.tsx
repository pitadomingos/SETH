
'use client';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save, Share2, Copy, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef, useEffect } from 'react';
import { uploadProfilePicture } from '@/app/actions/storage-actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateUserProfileAction } from '@/app/actions/user-actions';


function ShareDialog() {
  const { toast } = useToast();
  const referralLink = "https://eduddesk.app/demo-trial";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
        toast({
            title: "Link Copied!",
            description: "You can now share the referral link.",
        });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share EduDesk</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share EduDesk & Earn Rewards</DialogTitle>
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

const profileFormSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters."),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


export default function ProfilePage() {
    const { user, role, setUserProfilePicture, updateUserProfile } = useAuth();
    const { toast } = useToast();
    const initials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
        }
    });

    useEffect(() => {
        form.reset({
            name: user?.name || '',
            phone: user?.phone || '',
        });
    }, [user, form]);

    async function onSubmit(values: ProfileFormValues) {
        if (!user) return;
        const result = await updateUserProfileAction(user.username, values);
        if (result.success) {
            updateUserProfile(values);
            toast({
                title: "Profile Updated",
                description: "Your profile information has been saved.",
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: result.error || "Could not update your profile.",
            });
        }
    };

    const handlePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const dataUrl = reader.result as string;
            if (!dataUrl) {
                toast({ variant: 'destructive', title: "File Error", description: "Could not read the selected file." });
                setIsUploading(false);
                return;
            }
            
            try {
                const newUrl = await uploadProfilePicture(user.username, dataUrl);

                if (newUrl) {
                    setUserProfilePicture(newUrl);
                    toast({
                        title: "Profile Picture Updated",
                        description: "Your new profile picture has been saved.",
                    });
                } else {
                    throw new Error("Upload failed to return a URL.");
                }
            } catch (error) {
                console.error("Upload failed:", error);
                toast({
                    variant: 'destructive',
                    title: "Upload Failed",
                    description: "Could not update your profile picture. Please try again.",
                });
            } finally {
                setIsUploading(false);
            }
        };
        reader.onerror = (error) => {
            console.error("File reading failed:", error);
            toast({
                variant: 'destructive',
                title: "File Error",
                description: "Could not read the selected file.",
            });
            setIsUploading(false);
        };
    };

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header>
              <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
              <p className="text-muted-foreground">View your personal details and share the app.</p>
            </header>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <CardHeader>
                          <CardTitle>Profile Information</CardTitle>
                          <CardDescription>Update your personal details below.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-8 md:grid-cols-3">
                          <div className="flex flex-col items-center gap-4 pt-4 md:col-span-1">
                              <Avatar className="h-32 w-32 relative">
                                  <AvatarImage src={user?.profilePictureUrl || `https://placehold.co/200x200.png`} alt={user?.name} data-ai-hint="profile picture" />
                                  <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                                  {isUploading && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                                      </div>
                                  )}
                              </Avatar>
                              <input
                                  type="file"
                                  ref={fileInputRef}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handlePictureChange}
                                  disabled={isUploading}
                              />
                              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                  Change Picture
                              </Button>
                          </div>
                          <div className="space-y-4 md:col-span-2">
                              <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Full Name</FormLabel>
                                          <FormControl>
                                              <Input placeholder="Your full name" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <div className="space-y-2">
                                  <Label htmlFor="email">Email Address</Label>
                                  <Input id="email" type="email" defaultValue={user?.email} disabled />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="role">Role</Label>
                                  <Input id="role" defaultValue={role ?? ''} disabled />
                              </div>
                               <FormField
                                  control={form.control}
                                  name="phone"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Phone Number</FormLabel>
                                          <FormControl>
                                              <Input placeholder="+1 (555) 123-4567" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                          </div>
                      </CardContent>
                      <CardFooter className="border-t px-6 py-4">
                          <Button type="submit" disabled={form.formState.isSubmitting}>
                              {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                              Update Profile
                          </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Refer & Earn</CardTitle>
                        <CardDescription>Love using EduDesk? Share it with other institutions and get rewarded.</CardDescription>
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
