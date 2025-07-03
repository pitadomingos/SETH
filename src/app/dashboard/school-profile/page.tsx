
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building, User, Mail, Phone, MapPin, Edit, Star } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect } from 'react';

export default function SchoolProfilePage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { schoolProfile, isLoading: schoolLoading } = useSchoolData();
  const isLoading = authLoading || schoolLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!schoolProfile) {
    return <div className="flex h-full items-center justify-center">School data not found.</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">School Profile</h2>
        <p className="text-muted-foreground">Manage your school's official information.</p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
             <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                <Building className="h-8 w-8 text-primary" />
             </div>
             <div>
                <CardTitle className="text-3xl">{schoolProfile.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1"><Star className="h-4 w-4"/> "{schoolProfile.motto}"</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-6 md:grid-cols-2 text-sm">
                <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Head of School</p>
                        <p className="font-medium">{schoolProfile.head}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Contact Email</p>
                        <p className="font-medium">{schoolProfile.email}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Contact Phone</p>
                        <p className="font-medium">{schoolProfile.phone}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Address</p>
                        <p className="font-medium">{schoolProfile.address}</p>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button><Edit className="mr-2 h-4 w-4" /> Edit Details</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
