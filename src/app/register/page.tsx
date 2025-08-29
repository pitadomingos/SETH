'use client';

import { School, HeartHandshake } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SchoolRegistrationForm } from './school-registration-form';
import { ParentRegistrationForm } from './parent-registration-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <Tabs defaultValue="school" className="w-full max-w-lg">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="school"><School className="mr-2 h-4 w-4"/> Register a School</TabsTrigger>
                <TabsTrigger value="parent"><HeartHandshake className="mr-2 h-4 w-4"/> Register as a Parent</TabsTrigger>
            </TabsList>
            <TabsContent value="school">
                <Card>
                <CardHeader>
                    <CardTitle>School Registration</CardTitle>
                    <CardDescription>
                        Request to onboard your educational institution to the EduDesk platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SchoolRegistrationForm />
                </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="parent">
                <Card>
                <CardHeader>
                    <CardTitle>Parent Registration</CardTitle>
                    <CardDescription>
                        Create an account to track your children's progress and engage with their school.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ParentRegistrationForm />
                </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
                Log in
            </Link>
        </div>
    </main>
  );
}
