
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Briefcase, PlusCircle, Trash2, Save, Upload, Home } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, Control, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Link from 'next/link';

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

function TeamMemberCard({
  field,
  index,
  control,
  onRemove,
}: {
  field: Record<'id', string>;
  index: number;
  control: Control<WebsiteContentFormValues>;
  onRemove: (index: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useFormContext<WebsiteContentFormValues>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const placeholderUrl = `https://placehold.co/200x200.png?text=${file.name.substring(0, 3)}&v=${Date.now()}`;
        form.setValue(`teamMembers.${index}.imageUrl`, placeholderUrl, { shouldValidate: true, shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 p-4 border rounded-lg items-start">
      <div className="flex flex-col items-center gap-2">
        <Image
          src={form.watch(`teamMembers.${index}.imageUrl`)}
          alt={form.watch(`teamMembers.${index}.name`) || 'Team member'}
          width={100}
          height={100}
          className="rounded-full object-cover"
          data-ai-hint="person photo"
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" /> Change
        </Button>
      </div>
      <div className="space-y-2">
        <FormField
          control={control}
          name={`teamMembers.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`teamMembers.${index}.role`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`teamMembers.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea rows={2} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(index)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

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

  const partnerSchoolIds = form.watch('partnerSchools').map(p => p.name);
  const availableSchools = allSchoolData 
    ? Object.values(allSchoolData)
        .map(s => s.profile)
        .filter(p => !partnerSchoolIds.includes(p.name))
    : [];

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
  
  const handleAddSchool = (schoolId: string) => {
    const school = allSchoolData?.[schoolId];
    if (school) {
        appendSchool({
            name: school.profile.name,
            logoUrl: school.profile.logoUrl,
        });
    }
  }

  if (isLoading || !masterRecord) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Public Website Management</h2>
            <p className="text-muted-foreground">Manage the content displayed on the public-facing homepage.</p>
        </div>
        <Button asChild variant="outline">
            <Link href="/" target="_blank">
                <Home className="mr-2 h-4 w-4" />
                View Public Site
            </Link>
        </Button>
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
                      <TeamMemberCard
                        key={field.id}
                        field={field}
                        index={index}
                        control={form.control}
                        onRemove={removeTeam}
                      />
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
                         <div className="flex items-center gap-2">
                            <Select onValueChange={handleAddSchool}>
                                <SelectTrigger className="w-[250px]"><SelectValue placeholder="Add a school..." /></SelectTrigger>
                                <SelectContent>
                                    {availableSchools.map(school => (
                                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                         </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {schoolFields.map((field, index) => (
                        <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                           <div className="flex items-center gap-3">
                               <Image src={form.watch(`partnerSchools.${index}.logoUrl`)} alt={form.watch(`partnerSchools.${index}.name`)} width={40} height={40} className="rounded-lg object-contain bg-muted p-1" data-ai-hint="school logo"/>
                               <p className="font-medium">{form.watch(`partnerSchools.${index}.name`)}</p>
                           </div>
                           <Button type="button" variant="ghost" size="icon" onClick={() => removeSchool(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                     ))}
                     {schoolFields.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No partner schools added yet.</p>}
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
