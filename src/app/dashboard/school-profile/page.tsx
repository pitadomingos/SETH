
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Building, User, Mail, Phone, MapPin, Edit, Star, ShieldCheck, Gem, CreditCard, Save, Upload } from 'lucide-react';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';


// --- New Component for the Upgrade Dialog ---
function UpgradePlanDialog() {
  const { schoolProfile, updateSchoolProfile } = useSchoolData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'selection' | 'confirmation'>('selection');
  const [selectedTier, setSelectedTier] = useState<'Pro' | 'Premium' | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleSelectTier = (tierName: 'Pro' | 'Premium') => {
    setSelectedTier(tierName);
    setView('confirmation');
  };

  const handleConfirmUpgrade = () => {
    if (!selectedTier) return;
    
    updateSchoolProfile({ tier: selectedTier });
    
    toast({
      title: 'Upgrade Successful!',
      description: `Your school has been upgraded to the ${selectedTier} plan. Features are now available.`,
    });
    // Reset state and close dialog
    setIsOpen(false);
    setTimeout(() => {
        setView('selection');
        setSelectedTier(null);
        setAgreed(false);
    }, 300); // Delay reset to allow dialog to close smoothly
  };

  // When closing the dialog, reset its internal state
  const onOpenChange = (open: boolean) => {
    if (!open) {
        setView('selection');
        setSelectedTier(null);
        setAgreed(false);
    }
    setIsOpen(open);
  }

  if (!schoolProfile || schoolProfile.tier === 'Premium') {
    return null; 
  }

  const defaultTab = schoolProfile.tier === 'Starter' ? 'pro' : 'premium';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Gem className="mr-2 h-4 w-4" />
          Upgrade Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        {view === 'selection' ? (
            <>
                <DialogHeader>
                  <DialogTitle>Upgrade Your EduManage Plan</DialogTitle>
                  <DialogDescription>
                    Unlock more features and enhance your school's management capabilities.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue={defaultTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pro" disabled={schoolProfile.tier === 'Pro'}>Pro Tier</TabsTrigger>
                    <TabsTrigger value="premium">Premium Tier</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pro">
                    <Card className="border-0 shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck /> Pro Tier</CardTitle>
                        <CardDescription>Ideal for growing schools needing advanced tools.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-3xl font-bold">$25 <span className="text-sm font-normal text-muted-foreground">/ student / year</span></p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            <li>All features from the Starter Tier.</li>
                            <li><span className="font-semibold text-primary">AI Lesson Planner & Test Generator.</span></li>
                            <li><span className="font-semibold text-primary">Advanced AI Performance Analytics.</span></li>
                            <li>Full Admissions & Enrollment Management.</li>
                            <li>Advanced Reporting Tools.</li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                         <Button className="w-full" onClick={() => handleSelectTier('Pro')}>
                            <CreditCard className="mr-2 h-4 w-4"/>
                            Upgrade to Pro
                         </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="premium">
                     <Card className="border-0 shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gem /> Premium Tier</CardTitle>
                        <CardDescription>The ultimate solution for large districts and institutions.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-3xl font-bold">Custom Pricing</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            <li>All features from the Pro Tier.</li>
                            <li><span className="font-semibold text-primary">Global Admin Role for Multi-School Management.</span></li>
                            <li><span className="font-semibold text-primary">Consolidated Billing & System-wide AI Analysis.</span></li>
                            <li>Dedicated Support & Onboarding.</li>
                            <li>Custom Integrations & Branding.</li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                         <Button className="w-full" onClick={() => handleSelectTier('Premium')}>
                            <CreditCard className="mr-2 h-4 w-4"/>
                            Contact Us to Upgrade
                         </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
            </>
        ) : (
            <>
                <DialogHeader>
                    <DialogTitle>Confirm Upgrade to {selectedTier} Tier</DialogTitle>
                    <DialogDescription>
                        By confirming, you enter into a service agreement with Pixel Digital Solutions. Please review the terms below.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm">
                    <div className="p-4 h-64 overflow-y-auto rounded-md border text-muted-foreground space-y-4">
                        <h4 className="font-semibold text-foreground">Payment & Billing</h4>
                        <p>Your subscription for the {selectedTier} Tier will be billed annually. Payment will be processed using your registered VISA or other card linked to your bank account. The subscription will automatically renew at the end of each term.</p>
                        <h4 className="font-semibold text-foreground">Cancellation Policy</h4>
                        <p>You may cancel your subscription at any time from your account settings. However, no refunds will be issued for the current subscription term. Your access to {selectedTier} features will continue until the end of the current billing period.</p>
                        <h4 className="font-semibold text-foreground">Failed Payments</h4>
                        <p>If the automatic renewal payment fails due to insufficient funds or other card issues, your account will be temporarily suspended. Access to premium features will be restricted until the outstanding balance is paid. You will be notified via email to update your payment information.</p>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)} />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the subscription terms with Pixel Digital Solutions.
                        </label>
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={() => setView('selection')}>
                        Back to Plans
                    </Button>
                    <Button type="button" onClick={handleConfirmUpgrade} disabled={!agreed}>
                        Confirm & Pay
                    </Button>
                </DialogFooter>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const profileSchema = z.object({
  name: z.string().min(3, "School name is required."),
  head: z.string().min(3, "Head of school is required."),
  address: z.string().min(10, "Address is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email is required."),
  motto: z.string().optional(),
  logoUrl: z.string().url("Please enter a valid URL.").optional(),
  certificateTemplateUrl: z.string().url("Please enter a valid URL.").optional(),
  transcriptTemplateUrl: z.string().url("Please enter a valid URL.").optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

function EditProfileDialog() {
  const { schoolProfile, updateSchoolProfile } = useSchoolData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const transcriptInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { ...schoolProfile }
  });

  const logoPreview = form.watch('logoUrl');
  const certPreview = form.watch('certificateTemplateUrl');
  const transcriptPreview = form.watch('transcriptTemplateUrl');

  useEffect(() => {
    if (schoolProfile && isOpen) {
      form.reset(schoolProfile);
    }
  }, [schoolProfile, form, isOpen]);


  function onSubmit(values: ProfileFormValues) {
    updateSchoolProfile(values);
    toast({
      title: 'Profile Updated',
      description: 'The school profile has been successfully updated.',
    });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit School Profile</DialogTitle>
          <DialogDescription>
            Update the core details for {schoolProfile?.name}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>School Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="head" render={({ field }) => ( <FormItem><FormLabel>Head of School</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="address" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="motto" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>School Motto</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              
              <div className="col-span-1 space-y-2">
                <FormLabel>School Logo</FormLabel>
                <div className="flex items-center gap-4">
                  <Image src={logoPreview || 'https://placehold.co/100x100.png'} alt="logo preview" width={48} height={48} className="rounded-md bg-muted object-cover" data-ai-hint="school logo"/>
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*"
                    onChange={() => {
                      const newLogoUrl = `https://placehold.co/100x100.png?v=${Date.now()}`;
                      form.setValue('logoUrl', newLogoUrl, { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Upload</Button>
                </div>
                 <FormField control={form.control} name="logoUrl" render={({ field }) => ( <FormItem><FormControl><Input type="hidden" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
              
              <div className="col-span-1 space-y-2">
                <FormLabel>Certificate Template</FormLabel>
                <div className="flex items-center gap-4">
                  <Image src={certPreview || 'https://placehold.co/100x100.png'} alt="certificate preview" width={48} height={48} className="rounded-md bg-muted object-cover" data-ai-hint="certificate document"/>
                  <input type="file" ref={certInputRef} className="hidden" accept="image/*"
                    onChange={() => {
                      const newCertUrl = `https://placehold.co/800x600.png?v=${Date.now()}`;
                      form.setValue('certificateTemplateUrl', newCertUrl, { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => certInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Upload</Button>
                </div>
                <FormField control={form.control} name="certificateTemplateUrl" render={({ field }) => ( <FormItem><FormControl><Input type="hidden" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>

               <div className="col-span-1 space-y-2">
                <FormLabel>Transcript Template</FormLabel>
                <div className="flex items-center gap-4">
                  <Image src={transcriptPreview || 'https://placehold.co/100x100.png'} alt="transcript preview" width={48} height={48} className="rounded-md bg-muted object-cover" data-ai-hint="transcript document"/>
                  <input type="file" ref={transcriptInputRef} className="hidden" accept="image/*"
                    onChange={() => {
                      const newTranscriptUrl = `https://placehold.co/600x800.png?v=${Date.now()}`;
                      form.setValue('transcriptTemplateUrl', newTranscriptUrl, { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => transcriptInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Upload</Button>
                </div>
                <FormField control={form.control} name="transcriptTemplateUrl" render={({ field }) => ( <FormItem><FormControl><Input type="hidden" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>

            </div>
            <DialogFooter className="border-t pt-4">
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


// Main Page Component
export default function SchoolProfilePage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { schoolProfile, isLoading: schoolLoading } = useSchoolData();
  const isLoading = authLoading || schoolLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!schoolProfile) {
    return <div className="flex h-full items-center justify-center">School data not found.</div>
  }

  const getTierIcon = () => {
    switch (schoolProfile.tier) {
        case 'Pro': return <ShieldCheck className="h-4 w-4 text-primary" />;
        case 'Premium': return <Gem className="h-4 w-4 text-primary" />;
        default: return <Star className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">School Profile</h2>
        <p className="text-muted-foreground">Manage your school's official information and subscription plan.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
                        <Image src={schoolProfile.logoUrl} alt={`${schoolProfile.name} Logo`} width={64} height={64} className="object-cover" data-ai-hint="school logo" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl">{schoolProfile.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1">"{schoolProfile.motto}"</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-base py-2 px-4">
                    {getTierIcon()}
                    <span className="ml-2">{schoolProfile.tier} Plan</span>
                  </Badge>
              </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                            <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-muted-foreground">Head of School</p>
                            <p className="font-medium">{schoolProfile.head}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-muted-foreground">Contact Email</p>
                            <p className="font-medium">{schoolProfile.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-muted-foreground">Contact Phone</p>
                            <p className="font-medium">{schoolProfile.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-muted-foreground">Address</p>
                            <p className="font-medium">{schoolProfile.address}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
                <EditProfileDialog />
                {schoolProfile.tier !== 'Premium' && <UpgradePlanDialog />}
            </CardFooter>
        </Card>
        
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Certificate Template</CardTitle>
                <CardDescription>This template will be used for student completion certificates.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="p-2 bg-muted rounded-md flex justify-center border">
                    <Image
                        src={schoolProfile.certificateTemplateUrl || "https://placehold.co/800x600.png"}
                        alt="Certificate Template Preview"
                        width={400}
                        height={300}
                        className="rounded-md shadow-lg object-contain"
                        data-ai-hint="certificate document"
                    />
                </div>
            </CardContent>
        </Card>
         <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Transcript Template</CardTitle>
                <CardDescription>This template will be used for official academic transcripts.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="p-2 bg-muted rounded-md flex justify-center border">
                    <Image
                        src={schoolProfile.transcriptTemplateUrl || "https://placehold.co/600x800.png"}
                        alt="Transcript Template Preview"
                        width={300}
                        height={400}
                        className="rounded-md shadow-lg object-contain"
                        data-ai-hint="transcript document"
                    />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

