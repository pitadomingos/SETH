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

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoggingIn(true);
    const result = await login(values.username, values.password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid username or password',
      });
      form.setError('root', { message: 'Invalid username or password' });
      setIsLoggingIn(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
          <GraduationCap className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-headline">EduDesk</CardTitle>
        <CardDescription>Multi-Role Education Platform</CardDescription>
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
                    <Input placeholder='Enter your username' {...field} />
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
                    <Input type="password" placeholder='Enter password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoggingIn} className="w-full" size="lg">
              {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm text-muted-foreground">View Demo Credentials</AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                            <li className="flex justify-between"><span className="font-semibold">Global Admin:</span> <span>developer / password</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Premium Admin (MiniArte):</span> <span>admin3 / password</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Northwood Admin:</span> <span>admin1 / password</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Maplewood Admin:</span> <span>admin2 / password</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Northwood Teacher:</span> <span>teacher1 / password</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Maplewood Teacher:</span> <span>teacher2 / password</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Northwood Student:</span> <span>student1 / password</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Maplewood Student:</span> <span>student2 / password</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Northwood Parent:</span> <span>parent1 / password</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Maplewood Parent:</span> <span>parent2 / password</span></li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
