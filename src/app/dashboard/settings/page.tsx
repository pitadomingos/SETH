
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { schoolProfile, updateSchoolProfile, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  
  const isLoading = authLoading || schoolLoading;

  useEffect(() => {
    if (!isLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  function handleGradingSystemChange(value: SchoolProfile['gradingSystem']) {
    if (schoolProfile) {
        updateSchoolProfile({ gradingSystem: value });
        toast({
            title: "Grading System Updated",
            description: `The school now uses the ${value} system for displaying grades.`,
        });
    }
  }

  if (isLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage system settings and preferences.</p>
      </header>
      <Card>
        <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>Configure how the application behaves for your school.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg">
                <div>
                    <Label>Grade Display Format</Label>
                    <p className="text-xs text-muted-foreground">Choose how grades are displayed across the app.</p>
                </div>
                <Select
                    value={schoolProfile?.gradingSystem}
                    onValueChange={handleGradingSystemChange}
                >
                    <SelectTrigger className="w-full md:w-[180px] mt-2 md:mt-0">
                        <SelectValue placeholder="Select a system" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="20-Point">20-Point Scale</SelectItem>
                        <SelectItem value="Letter">Letter Grades (A-F)</SelectItem>
                        <SelectItem value="GPA">GPA Scale (0.0-4.0)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
