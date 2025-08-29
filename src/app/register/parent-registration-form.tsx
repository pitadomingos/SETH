'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { registerParentAction } from '@/app/actions/registration-actions';

const parentSchema = z.object({
  name: z.string().min(3, "Full name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(9, "Please enter a valid phone number."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type ParentFormValues = z.infer<typeof parentSchema>;

export function ParentRegistrationForm() {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<ParentFormValues>({
        resolver: zodResolver(parentSchema),
        defaultValues: { name: '', email: '', phone: '', password: '' },
    });

    async function onSubmit(values: ParentFormValues) {
        const result = await registerParentAction(values);

        if (result.success) {
            toast({
                title: 'Registration Successful!',
                description: "Your parent account has been created. Please check your email.",
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
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Ana Santos" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="ana.santos@email.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+258 84 123 4567" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem> )} />
                
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register as Parent
                </Button>
            </form>
        </Form>
    );
}
