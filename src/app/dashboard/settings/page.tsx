
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Save, Tv } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';


export default function SettingsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { schoolProfile, updateSchoolProfile, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();
  const { toast } = useToast();
  
  const isLoading = authLoading || schoolLoading;
  
  const [gradeCapacities, setGradeCapacities] = useState<Record<string, number>>(schoolProfile?.gradeCapacity || {});
  const [kioskConfig, setKioskConfig] = useState(schoolProfile?.kioskConfig || {
    showDashboard: true,
    showLeaderboard: true,
    showAttendance: false,
    showAcademics: false,
    showAwards: false,
    showPerformers: false,
    showAwardWinner: false,
    showShowcase: false,
  });

  useEffect(() => {
    if (schoolProfile) {
        setGradeCapacities(schoolProfile.gradeCapacity || {});
        setKioskConfig(schoolProfile.kioskConfig || { showDashboard: true, showLeaderboard: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false });
    }
  }, [schoolProfile]);

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

  function handleCurrencyChange(value: SchoolProfile['currency']) {
    if (schoolProfile) {
        updateSchoolProfile({ currency: value });
        toast({
            title: "Currency Updated",
            description: `The school currency has been set to ${value}.`,
        });
    }
  }
  
  const handleCapacityChange = (grade: string, value: string) => {
    setGradeCapacities(prev => ({ ...prev, [grade]: Number(value) >= 0 ? Number(value) : 0 }));
  };

  const handleSaveCapacities = () => {
    if (schoolProfile) {
        updateSchoolProfile({ gradeCapacity: gradeCapacities });
        toast({
            title: "Capacities Updated",
            description: "Grade level capacities have been saved.",
        });
    }
  };

  const handleKioskConfigChange = (key: keyof typeof kioskConfig, checked: boolean) => {
    setKioskConfig(prev => ({ ...prev, [key]: checked }));
  };

  const handleSaveKioskConfig = () => {
     if (schoolProfile) {
        updateSchoolProfile({ kioskConfig });
        toast({
            title: "Kiosk Settings Updated",
            description: "Your public kiosk display settings have been saved.",
        });
    }
  };


  if (isLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage system settings and preferences for your school.</p>
      </header>
      <Card>
        <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>Configure how the application behaves for your school.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
             <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg">
                <div>
                    <Label>Grade Display Format</Label>
                    <p className="text-xs text-muted-foreground">Choose how grades are displayed across the app (e.g., in reports, on dashboards).</p>
                </div>
                <Select
                    value={schoolProfile?.gradingSystem}
                    onValueChange={handleGradingSystemChange}
                >
                    <SelectTrigger className="w-full md:w-[220px] mt-2 md:mt-0">
                        <SelectValue placeholder="Select a system" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="20-Point">20-Point Scale (e.g., 18.5/20)</SelectItem>
                        <SelectItem value="Letter">Letter Grades (e.g., A+, B-)</SelectItem>
                        <SelectItem value="GPA">GPA Scale (e.g., 3.8)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg">
                <div>
                    <Label>School Currency</Label>
                    <p className="text-xs text-muted-foreground">Select the primary currency for all financial transactions and reports.</p>
                </div>
                <Select
                    value={schoolProfile?.currency}
                    onValueChange={handleCurrencyChange}
                >
                    <SelectTrigger className="w-full md:w-[220px] mt-2 md:mt-0">
                        <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="ZAR">ZAR (R)</SelectItem>
                        <SelectItem value="MZN">MZN (MT)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle>Grade Capacity Management</CardTitle>
            <CardDescription>Set the maximum number of students for each grade level to manage admissions and resource planning.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(grade => (
                    <div key={grade} className="space-y-2">
                        <Label htmlFor={`grade-capacity-${grade}`}>Grade {grade}</Label>
                        <Input
                            id={`grade-capacity-${grade}`}
                            type="number"
                            value={gradeCapacities[grade] || ''}
                            onChange={(e) => handleCapacityChange(grade, e.target.value)}
                            placeholder="0"
                        />
                    </div>
                ))}
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSaveCapacities}><Save className="mr-2 h-4 w-4" /> Save Capacities</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Tv /> Kiosk Display Settings</CardTitle>
            <CardDescription>Choose which information slides to display on your public kiosk screen. Changes will apply on the next cycle.</CardDescription>
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
            <div className="flex items-center space-x-2">
                <Checkbox id="kiosk-performers" checked={kioskConfig.showPerformers} onCheckedChange={(checked) => handleKioskConfigChange('showPerformers', checked as boolean)} />
                <Label htmlFor="kiosk-performers">Show Top Performers & Staff Slide</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="kiosk-award-winner" checked={kioskConfig.showAwardWinner} onCheckedChange={(checked) => handleKioskConfigChange('showAwardWinner', checked as boolean)} />
                <Label htmlFor="kiosk-award-winner">Show Award Winner Announcement Slide</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="kiosk-showcase" checked={kioskConfig.showShowcase} onCheckedChange={(checked) => handleKioskConfigChange('showShowcase', checked as boolean)} />
                <Label htmlFor="kiosk-showcase">Show Media Showcase Slide</Label>
            </div>
            <Separator className="sm:col-span-2" />
            <div className="flex items-center space-x-2">
                <Checkbox id="kiosk-attendance" checked={kioskConfig.showAttendance} onCheckedChange={(checked) => handleKioskConfigChange('showAttendance', checked as boolean)} />
                <Label htmlFor="kiosk-attendance">Show Attendance Trend Chart Slide</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="kiosk-academics" checked={kioskConfig.showAcademics} onCheckedChange={(checked) => handleKioskConfigChange('showAcademics', checked as boolean)} />
                <Label htmlFor="kiosk-academics">Show Academic Performance Charts Slide</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="kiosk-awards" checked={kioskConfig.showAwards} onCheckedChange={(checked) => handleKioskConfigChange('showAwards', checked as boolean)} />
                <Label htmlFor="kiosk-awards">Show Annual Award Announcements Slide</Label>
            </div>
        </CardContent>
        <CardFooter>
             <Button onClick={handleSaveKioskConfig}><Save className="mr-2 h-4 w-4" /> Save Kiosk Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
