
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Film, Image as ImageIcon, PlusCircle, Trash2, Video, Tv, Save } from 'lucide-react';
import { useSchoolData, KioskMedia } from '@/context/school-data-context';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const mediaSchema = z.object({
  title: z.string().min(3, "A title is required."),
  description: z.string().min(10, "A brief description is required."),
  type: z.enum(['image', 'video'], { required_error: "Please select a media type."}),
  url: z.string().url("A valid URL is required."),
});

type MediaFormValues = z.infer<typeof mediaSchema>;

function NewMediaDialog() {
  const { addKioskMedia } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: { title: '', description: '', type: 'image', url: '' },
  });

  function onSubmit(values: MediaFormValues) {
    addKioskMedia(values);
    toast({ title: 'Media Added', description: `"${values.title}" has been added to the showcase.` });
    form.reset();
    setIsOpen(false);
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const mediaType = form.getValues('type');
      const placeholderUrl = mediaType === 'image'
        ? `https://placehold.co/1280x720.png?text=${encodeURIComponent(form.getValues('title'))}`
        : 'https://www.w3schools.com/html/mov_bbb.mp4'; 
      form.setValue('url', placeholderUrl, { shouldValidate: true });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Media</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add to Kiosk Showcase</DialogTitle>
          <DialogDescription>Upload an image or video to be displayed on the public kiosk.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Annual Sports Day Winners" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A short caption for the media." {...field} /></FormControl><FormMessage /></FormItem> )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="type" render={({ field }) => ( <FormItem><FormLabel>Media Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
              <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <Input type="file" ref={fileInputRef} onChange={handleFileChange} />
              </FormItem>
            </div>
             <FormField control={form.control} name="url" render={({ field }) => ( <FormItem><FormLabel>Media URL</FormLabel><FormControl><Input placeholder="Auto-filled on upload or enter manually" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <DialogFooter className="mt-4">
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}> {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Media </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function KioskShowcasePage() {
  const { role, isLoading: authLoading } = useAuth();
  const { schoolProfile, isLoading: schoolLoading, kioskMedia, removeKioskMedia, updateSchoolProfile, allSchoolData } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  
  const isLoading = authLoading || schoolLoading;
  
  // Use Northwood's config as the template for the Global Admin
  const kioskConfigSource = role === 'GlobalAdmin' ? allSchoolData?.['northwood']?.profile : schoolProfile;

  const [kioskConfig, setKioskConfig] = useState(kioskConfigSource?.kioskConfig || {
    showDashboard: true,
    showLeaderboard: true,
    showTeacherLeaderboard: true,
    showAllSchools: true,
    showAttendance: false,
    showAcademics: false,
    showAwards: false,
    showPerformers: false,
    showAwardWinner: false,
    showShowcase: false,
  });

  useEffect(() => {
    if (kioskConfigSource) {
        setKioskConfig(kioskConfigSource.kioskConfig);
    }
  }, [kioskConfigSource]);

  const isAuthorized = role === 'Admin' || role === 'GlobalAdmin';

  useEffect(() => {
      if (!isLoading && !isAuthorized) {
          router.push('/dashboard');
      }
  }, [role, isLoading, isAuthorized, router]);
  
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sortedMedia = [...kioskMedia].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const handleKioskConfigChange = (key: keyof typeof kioskConfig, checked: boolean) => {
    setKioskConfig(prev => ({ ...prev, [key]: checked }));
  };

  const handleSaveKioskConfig = () => {
     if (role === 'GlobalAdmin' && allSchoolData?.['northwood']) {
         updateSchoolProfile({ kioskConfig }, 'northwood');
         toast({ title: "Global Kiosk Settings Updated", description: "Your public kiosk display settings have been saved." });
     } else if (schoolProfile) {
        updateSchoolProfile({ kioskConfig });
        toast({ title: "Kiosk Settings Updated", description: "Your public kiosk display settings have been saved." });
    }
  };
  
  const pageTitle = role === 'GlobalAdmin' ? 'Global Kiosk Management' : 'Kiosk Management';
  const pageDescription = role === 'GlobalAdmin' 
    ? "Manage media and display settings for the corporate headquarters' public kiosk."
    : "Manage media and display settings for your school's public kiosk.";


  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{pageTitle}</h2>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        {role === 'Admin' && <NewMediaDialog />}
      </header>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Showcase Gallery</CardTitle>
              <CardDescription>
                {role === 'Admin' 
                  ? sortedMedia.length > 0 ? `You have ${sortedMedia.length} item(s) in your showcase.` : "No media uploaded yet. Add images or videos to display."
                  : 'Media management is only available to individual school administrators.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {role === 'Admin' && sortedMedia.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {sortedMedia.map((media) => (
                    <Card key={media.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        {media.type === 'image' ? ( <Image src={media.url} alt={media.title} layout="fill" objectFit="cover" data-ai-hint="event photo school"/>
                        ) : ( <video src={media.url} className="w-full h-full object-cover" controls muted loop data-ai-hint="event video school"/> )}
                        <div className="absolute top-2 left-2 p-1.5 bg-black/50 rounded-full text-white">
                          {media.type === 'image' ? <ImageIcon className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-2">
                          <CardTitle className="text-lg">{media.title}</CardTitle>
                          <CardDescription>{media.description}</CardDescription>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center bg-muted p-3">
                          <p className="text-xs text-muted-foreground">Uploaded: {format(media.createdAt, 'PPP')}</p>
                          <Button variant="destructive" size="sm" onClick={() => removeKioskMedia(media.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground"><p>
                    {role === 'Admin' ? 'Your showcase is empty. Click "Add Media" to get started.' : 'Please log in as a school administrator to manage media.'}
                </p></div>
              )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Tv /> Kiosk Display Settings</CardTitle>
                <CardDescription>Choose which slides to display. Changes apply on the next cycle.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-1 gap-4">
                {role === 'GlobalAdmin' ? (
                  <>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-dashboard" checked={kioskConfig.showDashboard} onCheckedChange={(checked) => handleKioskConfigChange('showDashboard', checked as boolean)} /><Label htmlFor="kiosk-dashboard">Show Main Dashboard Slide</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-leaderboard" checked={kioskConfig.showLeaderboard} onCheckedChange={(checked) => handleKioskConfigChange('showLeaderboard', checked as boolean)} /><Label htmlFor="kiosk-leaderboard">Show Top Students Leaderboard</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-teacher-leaderboard" checked={kioskConfig.showTeacherLeaderboard} onCheckedChange={(checked) => handleKioskConfigChange('showTeacherLeaderboard', checked as boolean)} /><Label htmlFor="kiosk-teacher-leaderboard">Show Top Teachers Leaderboard</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-all-schools" checked={kioskConfig.showAllSchools} onCheckedChange={(checked) => handleKioskConfigChange('showAllSchools', checked as boolean)} /><Label htmlFor="kiosk-all-schools">Show All Schools Slide</Label></div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-dashboard" checked={kioskConfig.showDashboard} onCheckedChange={(checked) => handleKioskConfigChange('showDashboard', checked as boolean)} /><Label htmlFor="kiosk-dashboard">Show Main Dashboard Slide</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-leaderboard" checked={kioskConfig.showLeaderboard} onCheckedChange={(checked) => handleKioskConfigChange('showLeaderboard', checked as boolean)} /><Label htmlFor="kiosk-leaderboard">Show Top Student Leaderboard</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-performers" checked={kioskConfig.showPerformers} onCheckedChange={(checked) => handleKioskConfigChange('showPerformers', checked as boolean)} /><Label htmlFor="kiosk-performers">Show Top Performers & Staff</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-award-winner" checked={kioskConfig.showAwardWinner} onCheckedChange={(checked) => handleKioskConfigChange('showAwardWinner', checked as boolean)} /><Label htmlFor="kiosk-award-winner">Show Award Winner Announcement</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-showcase" checked={kioskConfig.showShowcase} onCheckedChange={(checked) => handleKioskConfigChange('showShowcase', checked as boolean)} /><Label htmlFor="kiosk-showcase">Show Media Showcase</Label></div>
                    <Separator />
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-attendance" checked={kioskConfig.showAttendance} onCheckedChange={(checked) => handleKioskConfigChange('showAttendance', checked as boolean)} /><Label htmlFor="kiosk-attendance">Show Attendance Trend Chart</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-academics" checked={kioskConfig.showAcademics} onCheckedChange={(checked) => handleKioskConfigChange('showAcademics', checked as boolean)} /><Label htmlFor="kiosk-academics">Show Academic Performance Charts</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="kiosk-awards" checked={kioskConfig.showAwards} onCheckedChange={(checked) => handleKioskConfigChange('showAwards', checked as boolean)} /><Label htmlFor="kiosk-awards">Show Annual Award Announcements</Label></div>
                  </>
                )}
            </CardContent>
            <CardFooter><Button onClick={handleSaveKioskConfig}><Save className="mr-2 h-4 w-4" /> Save Kiosk Settings</Button></CardFooter>
        </Card>
      </div>
    </div>
  );
}
