'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function RegistrationSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="mt-4">Registration Complete!</CardTitle>
            <CardDescription>
                Thank you for registering. Please check your email for a confirmation and next steps. You can now return to the home page.
            </CardDescription>
        </CardHeader>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href="/">Return to Home</Link>
            </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
