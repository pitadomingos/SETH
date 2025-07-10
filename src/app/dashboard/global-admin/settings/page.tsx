
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Save, Tv } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSchoolData } from '@/context/school-data-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function GlobalSettingsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, updateSchoolProfile, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  
  const isLoading = authLoading || schoolLoading;
  
  // For the global kiosk, we'll use a placeholder school's config (e.g., Northwood) as the editable template.
  const globalKioskConfigSource = allSchoolData?.['northwood'];
  const [kioskConfig, setKioskConfig] = useState(globalKioskConfigSource?.profile.kioskConfig || {
    showDashboard: true,
    showLeaderboard: true,
    showAttendance: false,
    showAcademics: false,
    showAwards: false,
    showPerformers: false,
    showAwardWinner: false,
  });

  useEffect(() => {
    if (globalKioskConfigSource) {
        setKioskConfig(globalKioskConfigSource.profile.kioskConfig);
    }
  }, [globalKioskConfigSource]);

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  const handleKioskConfigChange = (key: keyof typeof kioskConfig, checked: boolean) => {
    setKioskConfig(prev => ({ ...prev, [key]: checked }));
  };

  const handleSaveKioskConfig = () => {
    if (globalKioskConfigSource) {
        // In a real app, this would save to a global settings document.
        // Here, we simulate it by updating the config for our placeholder school.
        updateSchoolProfile({ kioskConfig }, globalKioskConfigSource.profile.id);
        toast({
            title: "Global Kiosk Settings Updated",
            description: "Your public kiosk display settings have been saved.",
        });
    }
  };

  if (isLoading || role !== 'GlobalAdmin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">Manage global settings for the EduManage network.</p>
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Tv /> Global Kiosk Display Settings</CardTitle>
            <CardDescription>Choose which information slides to display on the public kiosk screen at Pixel Digital Solutions headquarters. These settings control the content at the `/kiosk/global` URL.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="kiosk-dashboard" checked={kioskConfig.showDashboard} onCheckedChange={(checked) => handleKioskConfigChange('showDashboard', checked as boolean)} />
                <Label htmlFor="kiosk-dashboard">Show Main Dashboard Slide</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="kiosk-leaderboard" checked={kioskConfig.showLeaderboard} onCheckedChange={(checked) => handleKioskConfigChange('showLeaderboard', checked as boolean)} />
                <Label htmlFor="kiosk-leaderboard">Show Top Student Leaderboard Slide</Label>
            </div>
        </CardContent>
        <CardFooter>
             <Button onClick={handleSaveKioskConfig}><Save className="mr-2 h-4 w-4" /> Save Kiosk Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
