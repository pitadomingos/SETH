
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { createSchool } from '@/app/actions/school-actions';
import { useToast } from '@/hooks/use-toast';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { useAuth } from '@/context/auth-context';

const schoolSchema = z.object({
  name: z.string().min(3, "School name is required."),
  head: z.string().min(3, "Head of school is required."),
  address: z.string().min(10, "Address is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email is required."),
  motto: z.string().optional(),
  tier: z.enum(['Starter', 'Pro', 'Premium']),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

export function NewSchoolDialog({ groupId }: { groupId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { addSchool } = useSchoolData();
  const { addUser } = useAuth();

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: '',
      head: '',
      address: '',
      phone: '',
      email: '',
      motto: '',
      tier: 'Starter',
    },
  });

  async function onSubmit(values: SchoolFormValues) {
    const result = await createSchool(values, groupId);

    if (result) {
        addSchool(result.school);
        addUser(result.adminUser.username, result.adminUser.profile);
        toast({
            title: 'School Created!',
            description: `School "${values.name}" and its admin have been added.`,
        });
        form.reset();
        setIsOpen(false);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to create the school. Please try again.',
        });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New School</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Provision New School</DialogTitle>
          <DialogDescription>
            Enter the details to create a new school. This will be saved to the database.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>School Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="head" render={({ field }) => ( <FormItem><FormLabel>Head of School</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>
            <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>
             <FormField control={form.control} name="motto" render={({ field }) => ( <FormItem><FormLabel>School Motto</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
             {!groupId && (
                <FormField control={form.control} name="tier" render={({ field }) => ( 
                    <FormItem>
                        <FormLabel>Subscription Tier</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select Tier" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Starter">Starter</SelectItem>
                                <SelectItem value="Pro">Pro</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem> 
                )} />
             )}
            <DialogFooter className="mt-4">
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add School
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EditSchoolDialog({ school }: { school: SchoolProfile }) {
    // This is a placeholder for the real edit dialog.
    // In a real app this would be a separate component or integrated into settings.
    return (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => alert(`Editing ${school.name}`)}>
            <Edit className="h-4 w-4" />
        </Button>
    )
}
