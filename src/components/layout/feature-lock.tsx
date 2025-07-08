
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import Link from 'next/link';

export function FeatureLock({ featureName }: { featureName: string }) {
  return (
    <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Gem className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Upgrade to Pro to Access {featureName}</CardTitle>
                <CardDescription>
                    This feature is part of our Pro plan. Unlock advanced AI tools and more by upgrading your subscription.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Link href="/dashboard/school-profile" className="w-full">
                    <Button className="w-full">Upgrade Your Plan</Button>
                </Link>
            </CardFooter>
        </Card>
    </div>
  );
}
