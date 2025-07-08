
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, Role } from '@/context/auth-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  role: z.enum(['GlobalAdmin', 'Admin', 'Teacher', 'Student', 'Parent'], { required_error: 'You must select a role.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    const result = await login({
        username: values.username,
        password: values.password,
        role: values.role as Exclude<Role, null>
    });

    if (result.success) {
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result.message || 'An unknown error occurred.',
      });
      form.setError('root', { message: result.message });
      form.setValue('password', '');
    }
    setIsLoading(false);
  }

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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
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
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GlobalAdmin">Developer / Global Admin</SelectItem>
                      <SelectItem value="Admin">School Administrator</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <p className="font-bold">Demo Credentials</p>
              <p className="mt-2"><span className="font-semibold">Developer:</span> `developer` (pass: `dev123`)</p>
              <p><span className="font-semibold">Premium Admin:</span> Log in as `admin3` (Maplewood)</p>
              <p className="mt-2"><span className="font-semibold">Northwood High:</span> Use `admin1`, `teacher1`, `student1`, or `parent1`</p>
              <p><span className="font-semibold">Oakridge Academy:</span> Use `admin2`, `teacher2`, or `student2`</p>
              <p><span className="font-semibold">Maplewood Int'l:</span> Use `admin3`, `teacher3`, or `student3`</p>
              <p><span className="font-semibold">Failing Student (Northwood):</span> `student4`</p>
              <p className="mt-2">Passwords are based on role:</p>
              <p>Admin: `admin123`, Teacher: `teacher123`, Student: `student123`, Parent: `parent123`</p>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
