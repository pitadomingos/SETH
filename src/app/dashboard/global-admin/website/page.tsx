
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Briefcase, Link as LinkIcon, PlusCircle, Trash2, Save, Upload } from 'lucide-react';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const teamMemberSchema = z.object({
  name: z.string().min(3, "Name is required."),
  role: z.string().min(2, "Role is required."),
  description: z.string().min(10, "Description is required."),
  imageUrl: z.string().url("A valid image URL is required."),
});

const partnerSchoolSchema = z.object({
  name: z.string().min(3, "Name is required."),
  logoUrl: z.string().url("A valid logo URL is required."),
});

const websiteContentSchema = z.object({
  teamMembers: z.array(teamMemberSchema),
  partnerSchools: z.array(partnerSchoolSchema),
});

type WebsiteContentFormValues = z.infer<typeof websiteContentSchema>;

export default function WebsiteManagementPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading, updateSchoolProfile } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  
  const isLoading = authLoading || schoolLoading;
  
  const masterRecord = allSchoolData?.['northwood'];
  
  const form = useForm<WebsiteContentFormValues>({
    resolver: zodResolver(websiteContentSchema),
    defaultValues: {
      teamMembers: masterRecord?.profile.teamMembers || [],
      partnerSchools: masterRecord?.profile.partnerSchools || [],
    },
  });

  const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  const { fields: schoolFields, append: appendSchool, remove: removeSchool } = useFieldArray({
    control: form.control,
    name: "partnerSchools",
  });

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  async function onSubmit(values: WebsiteContentFormValues) {
    if (!masterRecord) return;
    
    const success = await updateSchoolProfile({ 
        teamMembers: values.teamMembers, 
        partnerSchools: values.partnerSchools 
    }, masterRecord.profile.id);

    if (success) {
      toast({ title: 'Website Content Updated', description: 'Your changes have been published to the public website.' });
    } else {
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not save website content.' });
    }
  }

  if (isLoading || !masterRecord) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Public Website Management</h2>
        <p className="text-muted-foreground">Manage the content displayed on the public-facing homepage.</p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2"><Users/> Team Members</CardTitle>
                            <CardDescription>Add and remove team members displayed on the public site.</CardDescription>
                        </div>
                        <Button type="button" variant="outline" onClick={() => appendTeam({ name: '', role: '', description: '', imageUrl: 'https://placehold.co/200x200.png' })}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Add Member
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {teamFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 p-4 border rounded-lg items-start">
                            <div className="flex flex-col items-center gap-2">
                                <Image src={form.watch(`teamMembers.${index}.imageUrl`)} alt={form.watch(`teamMembers.${index}.name`)} width={100} height={100} className="rounded-full object-cover" data-ai-hint="person photo"/>
                                <FormField control={form.control} name={`teamMembers.${index}.imageUrl`} render={({ field }) => ( <FormItem className="w-full"><FormControl><Input className="h-8 text-xs" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                            </div>
                            <div className="space-y-2">
                                 <FormField control={form.control} name={`teamMembers.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                 <FormField control={form.control} name={`teamMembers.${index}.role`} render={({ field }) => ( <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                 <FormField control={form.control} name={`teamMembers.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem> )}/>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeTeam(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2"><Briefcase/> Partner Schools</CardTitle>
                            <CardDescription>Manage the logos of schools showcased on the public site.</CardDescription>
                        </div>
                        <Button type="button" variant="outline" onClick={() => appendSchool({ name: '', logoUrl: 'https://placehold.co/100x100.png' })}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Add School
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                     {schoolFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 border rounded-lg">
                           <Image src={form.watch(`partnerSchools.${index}.logoUrl`)} alt={form.watch(`partnerSchools.${index}.name`)} width={64} height={64} className="rounded-lg object-contain bg-muted p-1" data-ai-hint="school logo"/>
                           <div className="space-y-2">
                                <FormField control={form.control} name={`partnerSchools.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>School Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                <FormField control={form.control} name={`partnerSchools.${index}.logoUrl`} render={({ field }) => ( <FormItem><FormLabel>Logo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                           </div>
                           <Button type="button" variant="ghost" size="icon" onClick={() => removeSchool(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                     ))}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    <Save className="mr-2 h-4 w-4"/>
                    Save Website Content
                </Button>
            </div>
        </form>
      </Form>
    </div>
  );
}
