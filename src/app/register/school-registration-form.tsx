'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { registerSchoolAction } from '@/app/actions/registration-actions';

const schoolSchema = z.object({
  schoolName: z.string().min(3, "School name is required."),
  adminName: z.string().min(3, "Administrator's name is required."),
  schoolAddress: z.string().min(10, "A valid address is required."),
  schoolPhone: z.string().min(9, "A valid phone number is required."),
  adminEmail: z.string().email("A valid email is required."),
  schoolMotto: z.string().optional(),
  tier: z.enum(['Starter', 'Pro', 'Premium'], { required_error: "Please select a subscription tier." }),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

export function SchoolRegistrationForm() {
    const { toast } = useToast();
    const router = useRouter();
    
    const form = useForm<SchoolFormValues>({
        resolver: zodResolver(schoolSchema),
        defaultValues: {
            schoolName: '', adminName: '', schoolAddress: '', schoolPhone: '', adminEmail: '', schoolMotto: '', tier: 'Starter',
        },
    });

    async function onSubmit(values: SchoolFormValues) {
        const result = await registerSchoolAction(values);

        if (result.success) {
            toast({
                title: 'Registration Submitted!',
                description: `Your request to add "${values.schoolName}" has been received. You will receive an email once it is approved.`,
            });
            router.push('/register/success');
        } else {
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: result.error || 'An unexpected error occurred.',
            });
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="schoolName" render={({ field }) => ( <FormItem><FormLabel>School Name</FormLabel><FormControl><Input placeholder="e.g., Northwood High" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="adminName" render={({ field }) => ( <FormItem><FormLabel>Administrator Full Name</FormLabel><FormControl><Input placeholder="e.g., Amelia Costa" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="adminEmail" render={({ field }) => ( <FormItem><FormLabel>Administrator Email</FormLabel><FormControl><Input type="email" placeholder="amelia.costa@northwood.edu" {...field} /></FormControl><FormMessage /></FormItem> )} />
                 <FormField control={form.control} name="schoolAddress" render={({ field }) => ( <FormItem><FormLabel>School Address</FormLabel><FormControl><Input placeholder="Av. Julius Nyerere, Maputo" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="schoolPhone" render={({ field }) => ( <FormItem><FormLabel>School Phone</FormLabel><FormControl><Input placeholder="+258 84 123 4567" {...field} /></FormControl><FormMessage /></FormItem> )} />
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
                </div>
                 <FormField control={form.control} name="schoolMotto" render={({ field }) => ( <FormItem><FormLabel>School Motto (Optional)</FormLabel><FormControl><Input placeholder="Excellence in Education" {...field} /></FormControl><FormMessage /></FormItem> )} />
                
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Registration
                </Button>
            </form>
        </Form>
    );
}
