
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSchoolData } from '@/context/school-data-context';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const { allSchoolData, isLoading: isSchoolDataLoading } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    if (!allSchoolData) {
        toast({
            variant: 'destructive',
            title: 'System not ready',
            description: 'The school data is still loading. Please try again in a moment.',
        });
        return;
    }
    const result = await login(values.email, values.password, allSchoolData);

    if (result.success) {
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result.message || 'An unknown error occurred.',
      });
      form.setError('root', { message: result.message });
    }
  }
  
  const adminUsers = allSchoolData ? Object.values(allSchoolData).map(s => ({
    user: { name: s.profile.head, role: 'Admin', email: s.profile.email },
    password: 'admin'
  })) : [];
  
  const devUser = {
      user: { name: 'Developer', role: 'GlobalAdmin', email: 'developer@edumanage.com' },
      password: 'dev123'
  };

  const allDemoUsers = [devUser, ...adminUsers];


  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
          <GraduationCap className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-headline">EduManage</CardTitle>
        <CardDescription>Multi-School Management System</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoggingIn || isSchoolDataLoading} className="w-full" size="lg">
              {(isLoggingIn || isSchoolDataLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            {allDemoUsers.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm text-muted-foreground">View Demo Credentials</AccordionTrigger>
                      <AccordionContent>
                          <ul className="space-y-1 text-xs text-muted-foreground">
                              {allDemoUsers.map(({ user, password }) => (
                                  <li key={user.email} className="flex justify-between">
                                      <span className="font-semibold">{user.role} ({user.name}):</span>
                                      <span>{user.email} / {password}</span>
                                  </li>
                              ))}
                                <li className="flex justify-between">
                                  <span className="font-semibold">Parent (Maria Rodriguez):</span>
                                  <span>m.rodriguez@family.com / parent</span>
                              </li>
                              <li className="flex justify-between">
                                  <span className="font-semibold">Teacher (Northwood):</span>
                                  <span>m.chen@edumanage.com / teacher</span>
                              </li>
                              <li className="flex justify-between">
                                  <span className="font-semibold">Student (Northwood):</span>
                                  <span>e.rodriguez@edumanage.com / student</span>
                              </li>
                          </ul>
                      </AccordionContent>
                  </AccordionItem>
              </Accordion>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
