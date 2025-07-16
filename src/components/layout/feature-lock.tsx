
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function FeatureLock({ featureName }: { featureName: string }) {
  const router = useRouter();

  const handleContactAdmin = () => {
    const prefillData = {
      subject: `Inquiry About Upgrading to Pro Plan`,
      body: `Hello,\n\nI am interested in using the "${featureName}" feature and would like to inquire about upgrading our school's subscription to the Pro plan.\n\nPlease provide me with more information on the benefits and pricing.\n\nThank you.`
    };
    sessionStorage.setItem('prefillMessage', JSON.stringify(prefillData));
    router.push('/dashboard/messaging');
  };

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
                 <Button className="w-full" onClick={handleContactAdmin}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Admin to Upgrade
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
