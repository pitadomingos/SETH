'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Save, Tv, Building, User, Mail, Phone, MapPin, Edit, Star, ShieldCheck, Gem, CreditCard, Upload } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, CalendarDays, Calendar as CalendarIcon, Trash2, Settings, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';


// --- Schemas ---
const boardSchema = z.object({ name: z.string().min(2, "Board name must be at least 2 characters."), });
type BoardFormValues = z.infer<typeof boardSchema>;

const descriptionSchema = z.object({ name: z.string().min(3, "Description must be at least 3 characters."), });
type DescriptionFormValues = z.infer<typeof descriptionSchema>;

const audienceSchema = z.object({ name: z.string().min(3, "Audience name must be at least 3 characters."), });
type AudienceFormValues = z.infer<typeof audienceSchema>;

const termSchema = z.object({ name: z.string().min(3, "Term name is required."), startDate: z.date({ required_error: "Start date is required." }), endDate: z.date({ required_error: "End date is required." }), });
type TermFormValues = z.infer<typeof termSchema>;

const holidaySchema = z.object({ name: z.string().min(3, "Holiday name is required."), date: z.date({ required_error: "Date is required." }), });
type HolidayFormValues = z.infer<typeof holidaySchema>;

const profileSchema = z.object({
  name: z.string().min(3, "School name is required."),
  head: z.string().min(3, "Head of school is required."),
  address: z.string().min(10, "Address is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email is required."),
  motto: z.string().optional(),
  schoolLevel: z.enum(['Primary', 'Secondary', 'Full']),
  logoUrl: z.string().url("Please enter a valid URL.").optional(),
  certificateTemplateUrl: z.string().url("Please enter a valid URL.").optional(),
  transcriptTemplateUrl: z.string().url("Please enter a valid URL.").optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

// --- Sub-components for Settings Page ---
function ProfileTab() {
  const { schoolProfile } = useSchoolData();
  
  if (!schoolProfile) return null;

  const getTierIcon = () => {
    switch (schoolProfile.tier) {
        case 'Pro': return <ShieldCheck className="h-4 w-4 text-primary" />;
        case 'Premium': return <Gem className="h-4 w-4 text-primary" />;
        default: return <Star className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
                        <Image src={schoolProfile.logoUrl} alt={`${schoolProfile.name} Logo`} width={64} height={64} className="object-cover" data-ai-hint="school logo" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl">{schoolProfile.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1">"{schoolProfile.motto}"</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-base py-2 px-4">
                    {getTierIcon()}
                    <span className="ml-2">{schoolProfile.tier} Plan</span>
                  </Badge>
              </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 text-sm">
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
            <CardFooter className="border-t pt-6 flex justify-between">
                <EditProfileDialog />
                {schoolProfile.tier !== 'Premium' && <UpgradePlanDialog />}
            </CardFooter>
        </Card>
        
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Certificate Template</CardTitle>
                <CardDescription>This template will be used for student completion certificates.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="p-2 bg-muted rounded-md flex justify-center border">
                    <Image
                        src={schoolProfile.certificateTemplateUrl || "https://placehold.co/800x600.png"}
                        alt="Certificate Template Preview"
                        width={400}
                        height={300}
                        className="rounded-md shadow-lg object-contain"
                        data-ai-hint="certificate document"
                    />
                </div>
            </CardContent>
        </Card>
         <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Transcript Template</CardTitle>
                <CardDescription>This template will be used for official academic transcripts.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="p-2 bg-muted rounded-md flex justify-center border">
                    <Image
                        src={schoolProfile.transcriptTemplateUrl || "https://placehold.co/600x800.png"}
                        alt="Transcript Template Preview"
                        width={300}
                        height={400}
                        className="rounded-md shadow-lg object-contain"
                        data-ai-hint="transcript document"
                    />
                </div>
            </CardContent>
        </Card>
      </div>
  );
}

function AdministrationTab() {
  const { 
      schoolProfile, updateSchoolProfile, 
      examBoards, addExamBoard, deleteExamBoard, studentsData, teachersData, 
      feeDescriptions, addFeeDescription, deleteFeeDescription,
      audiences, addAudience, deleteAudience,
      terms, addTerm, holidays, addHoliday
  } = useSchoolData();
  const { toast } = useToast();
  
  const [gradeCapacities, setGradeCapacities] = useState<Record<string, number>>(schoolProfile?.gradeCapacity || {});
  const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [isAudienceDialogOpen, setIsAudienceDialogOpen] = useState(false);
  const [isTermDialogOpen, setIsTermDialogOpen] = useState(false);
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);

  useEffect(() => { if (schoolProfile) { setGradeCapacities(schoolProfile.gradeCapacity || {}); } }, [schoolProfile]);

  const users = useMemo(() => {
    const studentUsers = studentsData.map(s => ({ id: s.id, name: s.name, email: s.email, role: 'Student' as const, status: s.status, }));
    const teacherUsers = teachersData.map(t => ({ id: t.id, name: t.name, email: t.email, role: 'Teacher' as const, status: t.status, }));
    return [...teacherUsers, ...studentUsers];
  }, [studentsData, teachersData]);

  const boardForm = useForm<BoardFormValues>({ resolver: zodResolver(boardSchema), defaultValues: { name: '' } });
  const descriptionForm = useForm<DescriptionFormValues>({ resolver: zodResolver(descriptionSchema), defaultValues: { name: '' } });
  const audienceForm = useForm<AudienceFormValues>({ resolver: zodResolver(audienceSchema), defaultValues: { name: '' } });
  const termForm = useForm<TermFormValues>({ resolver: zodResolver(termSchema), defaultValues: { name: '' } });
  const holidayForm = useForm<HolidayFormValues>({ resolver: zodResolver(holidaySchema), defaultValues: { name: '' } });

  function onBoardSubmit(values: BoardFormValues) { addExamBoard(values.name); boardForm.reset(); setIsBoardDialogOpen(false); }
  function onDescriptionSubmit(values: DescriptionFormValues) { addFeeDescription(values.name); descriptionForm.reset(); setIsDescriptionDialogOpen(false); }
  function onAudienceSubmit(values: AudienceFormValues) { addAudience(values.name); audienceForm.reset(); setIsAudienceDialogOpen(false); }
  function onTermSubmit(values: TermFormValues) { addTerm(values); termForm.reset(); setIsTermDialogOpen(false); }
  function onHolidaySubmit(values: HolidayFormValues) { addHoliday(values); holidayForm.reset(); setIsHolidayDialogOpen(false); }

  function handleGradingSystemChange(value: SchoolProfile['gradingSystem']) { if (schoolProfile) { updateSchoolProfile({ gradingSystem: value }); toast({ title: "Grading System Updated", description: `The school now uses the ${value} system for displaying grades.`, }); } }
  function handleCurrencyChange(value: SchoolProfile['currency']) { if (schoolProfile) { updateSchoolProfile({ currency: value }); toast({ title: "Currency Updated", description: `The school currency has been set to ${value}.` }); } }
  const handleCapacityChange = (grade: string, value: string) => { setGradeCapacities(prev => ({ ...prev, [grade]: Number(value) >= 0 ? Number(value) : 0 })); };
  const handleSaveCapacities = () => { if (schoolProfile) { updateSchoolProfile({ gradeCapacity: gradeCapacities }); toast({ title: "Capacities Updated", description: "Grade level capacities have been saved." }); } };
  const getStatusVariant = (status: 'Active' | 'Inactive' | 'Transferred') => { switch (status) { case 'Active': return 'secondary'; case 'Inactive': return 'destructive'; case 'Transferred': return 'outline'; default: return 'default'; } };

  const gradesToDisplay = useMemo(() => {
    if (schoolProfile?.schoolLevel === 'Primary') return Array.from({ length: 7 }, (_, i) => String(i + 1));
    if (schoolProfile?.schoolLevel === 'Secondary') return Array.from({ length: 5 }, (_, i) => String(i + 8));
    return Array.from({ length: 12 }, (_, i) => String(i + 1));
  }, [schoolProfile]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>System Preferences</CardTitle><CardDescription>Configure how the application behaves for your school.</CardDescription></CardHeader>
        <CardContent className="space-y-6">
             <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg">
                <div><Label>Grade Display Format</Label><p className="text-xs text-muted-foreground">Choose how grades are displayed across the app (e.g., in reports, on dashboards).</p></div>
                <Select value={schoolProfile?.gradingSystem} onValueChange={handleGradingSystemChange}><SelectTrigger className="w-full md:w-[220px] mt-2 md:mt-0"><SelectValue placeholder="Select a system" /></SelectTrigger><SelectContent><SelectItem value="20-Point">20-Point Scale (e.g., 18.5/20)</SelectItem><SelectItem value="Letter">Letter Grades (e.g., A+, B-)</SelectItem><SelectItem value="GPA">GPA Scale (e.g., 3.8)</SelectItem></SelectContent></Select>
            </div>
             <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg">
                <div><Label>School Currency</Label><p className="text-xs text-muted-foreground">Select the primary currency for all financial transactions and reports.</p></div>
                <Select value={schoolProfile?.currency} onValueChange={handleCurrencyChange}><SelectTrigger className="w-full md:w-[220px] mt-2 md:mt-0"><SelectValue placeholder="Select currency" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="ZAR">ZAR (R)</SelectItem>
                      <SelectItem value="MZN">MZN (MT)</SelectItem>
                      <SelectItem value="BWP">BWP (P)</SelectItem>
                      <SelectItem value="NAD">NAD (N$)</SelectItem>
                      <SelectItem value="ZMW">ZMW (K)</SelectItem>
                      <SelectItem value="MWK">MWK (MK)</SelectItem>
                      <SelectItem value="AOA">AOA (Kz)</SelectItem>
                      <SelectItem value="TZS">TZS (TSh)</SelectItem>
                      <SelectItem value="ZWL">ZWL (Z$)</SelectItem>
                  </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Grade Capacity Management</CardTitle><CardDescription>Set the maximum number of students for each grade level to manage admissions and resource planning.</CardDescription></CardHeader>
        <CardContent><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{gradesToDisplay.map(grade => (<div key={grade} className="space-y-2"><Label htmlFor={`grade-capacity-${grade}`}>Grade {grade}</Label><Input id={`grade-capacity-${grade}`} type="number" value={gradeCapacities[grade] || ''} onChange={(e) => handleCapacityChange(grade, e.target.value)} placeholder="0" /></div>))}</div></CardContent>
        <CardFooter><Button onClick={handleSaveCapacities}><Save className="mr-2 h-4 w-4" /> Save Capacities</Button></CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users /> User Management</CardTitle>
            <CardDescription>View and manage all teachers and students in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
                <TableBody>{users.slice(0, 10).map((user) => (<TableRow key={user.id}><TableCell className="font-medium">{user.name}</TableCell><TableCell>{user.email}</TableCell><TableCell><Badge variant="outline">{user.role}</Badge></TableCell><TableCell><Badge variant={getStatusVariant(user.status)}>{user.status}</Badge></TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>Edit</DropdownMenuItem><DropdownMenuItem>View Profile</DropdownMenuItem><DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody>
            </Table>
        </CardContent>
    </Card>

      <div className="grid gap-6 lg:grid-cols-2">
           <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays /> Academic Year</CardTitle><CardDescription>Configure terms and holidays for the school year.</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                  <div>
                      <div className="flex items-center justify-between"><h4 className="font-semibold">Academic Terms</h4><Dialog open={isTermDialogOpen} onOpenChange={setIsTermDialogOpen}><DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Term</Button></DialogTrigger><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Add New Term</DialogTitle><DialogDescription>Define a new academic term.</DialogDescription></DialogHeader><Form {...termForm}><form onSubmit={termForm.handleSubmit(onTermSubmit)} className="space-y-4 py-4"><FormField control={termForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Term Name</FormLabel><FormControl><Input placeholder="e.g., Term 1" {...field} /></FormControl><FormMessage /></FormItem> )}/><FormField control={termForm.control} name="startDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/><FormField control={termForm.control} name="endDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/><DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Save Term</Button></DialogFooter></form></Form></DialogContent></Dialog></div>
                       <ul className="mt-3 space-y-2">{terms.map(term => ( <li key={term.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"><span>{term.name}</span> <span className="text-muted-foreground">{format(term.startDate.toDate(), 'MMM d')} - {format(term.endDate.toDate(), 'MMM d, yyyy')}</span></li> ))}</ul>
                  </div>
                  <div>
                      <div className="flex items-center justify-between"><h4 className="font-semibold">Holidays</h4><Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}><DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Holiday</Button></DialogTrigger><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Add New Holiday</DialogTitle><DialogDescription>Schedule an official school holiday.</DialogDescription></DialogHeader><Form {...holidayForm}><form onSubmit={holidayForm.handleSubmit(onHolidaySubmit)} className="space-y-4 py-4"><FormField control={holidayForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Holiday Name</FormLabel><FormControl><Input placeholder="e.g., Winter Break" {...field} /></FormControl><FormMessage /></FormItem> )}/><FormField control={holidayForm.control} name="date" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/><DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Save Holiday</Button></DialogFooter></form></Form></DialogContent></Dialog></div>
                      <ul className="mt-3 space-y-2">{holidays.map(holiday => ( <li key={holiday.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"><span>{holiday.name}</span><span className="text-muted-foreground">{format(holiday.date.toDate(), 'PPP')}</span></li> ))}</ul>
                  </div>
              </CardContent>
          </Card>
           <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Settings /> System Data Lists</CardTitle><CardDescription>Manage data used in dropdowns across the app.</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                  <div>
                      <div className="flex items-center justify-between"><h4 className="font-semibold">Examination Boards</h4><Dialog open={isBoardDialogOpen} onOpenChange={setIsBoardDialogOpen}><DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Board</Button></DialogTrigger><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Add New Exam Board</DialogTitle><DialogDescription>Enter the name of the new exam board.</DialogDescription></DialogHeader><Form {...boardForm}><form onSubmit={boardForm.handleSubmit(onBoardSubmit)} className="space-y-4 py-4"><FormField control={boardForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Board Name</FormLabel><FormControl><Input placeholder="e.g., Advanced Placement" {...field} /></FormControl><FormMessage /></FormItem> )}/><DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={boardForm.formState.isSubmitting}>{boardForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Board</Button></DialogFooter></form></Form></DialogContent></Dialog></div>
                      <ul className="mt-3 space-y-2">{examBoards.map(board => (<li key={board} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"><span>{board}</span>{board !== 'Internal' && (<Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteExamBoard(board)}><Trash2 className="h-4 w-4 text-destructive" /></Button>)}</li>))}</ul>
                  </div>
                   <div>
                      <div className="flex items-center justify-between"><h4 className="font-semibold">Fee Descriptions</h4><Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}><DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Description</Button></DialogTrigger><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Add New Fee Description</DialogTitle><DialogDescription>Enter a new fee description to be used in transactions.</DialogDescription></DialogHeader><Form {...descriptionForm}><form onSubmit={descriptionForm.handleSubmit(onDescriptionSubmit)} className="space-y-4 py-4"><FormField control={descriptionForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="e.g., Field Trip" {...field} /></FormControl><FormMessage /></FormItem> )}/><DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={descriptionForm.formState.isSubmitting}>{descriptionForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Description</Button></DialogFooter></form></Form></DialogContent></Dialog></div>
                      <ul className="mt-3 space-y-2">{feeDescriptions.map(desc => (<li key={desc} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"><span>{desc}</span><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteFeeDescription(desc)}><Trash2 className="h-4 w-4 text-destructive" /></Button></li>))}</ul>
                  </div>
                  <div>
                      <div className="flex items-center justify-between"><h4 className="font-semibold">Event Audiences</h4><Dialog open={isAudienceDialogOpen} onOpenChange={setIsAudienceDialogOpen}><DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Audience</Button></DialogTrigger><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Add New Event Audience</DialogTitle><DialogDescription>Enter a new audience type to be used when creating events.</DialogDescription></DialogHeader><Form {...audienceForm}><form onSubmit={audienceForm.handleSubmit(onAudienceSubmit)} className="space-y-4 py-4"><FormField control={audienceForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Audience Name</FormLabel><FormControl><Input placeholder="e.g., All Staff" {...field} /></FormControl><FormMessage /></FormItem> )}/><DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={audienceForm.formState.isSubmitting}>{audienceForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Audience</Button></DialogFooter></form></Form></DialogContent></Dialog></div>
                      <ul className="mt-3 space-y-2">{audiences.map(aud => (<li key={aud} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"><span>{aud}</span><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteAudience(aud)}><Trash2 className="h-4 w-4 text-destructive" /></Button></li>))}</ul>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

// --- Dialogs for ProfileTab ---
function UpgradePlanDialog() {
  const { schoolProfile, updateSchoolProfile } = useSchoolData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'selection' | 'confirmation'>('selection');
  const [selectedTier, setSelectedTier] = useState<'Pro' | 'Premium' | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleSelectTier = (tierName: 'Pro' | 'Premium') => {
    setSelectedTier(tierName);
    setView('confirmation');
  };

  const handleConfirmUpgrade = () => {
    if (!selectedTier || !schoolProfile) return;
    
    updateSchoolProfile({ tier: selectedTier });
    
    toast({
      title: 'Upgrade Successful!',
      description: `Your school has been upgraded to the ${selectedTier} plan. Features are now available.`,
    });
    setIsOpen(false);
    setTimeout(() => {
        setView('selection');
        setSelectedTier(null);
        setAgreed(false);
    }, 300);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
        setView('selection');
        setSelectedTier(null);
        setAgreed(false);
    }
    setIsOpen(open);
  }

  if (!schoolProfile || schoolProfile.tier === 'Premium') {
    return null; 
  }

  const defaultTab = schoolProfile.tier === 'Starter' ? 'pro' : 'premium';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Gem className="mr-2 h-4 w-4" />
          Upgrade Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        {view === 'selection' ? (
            <>
                <DialogHeader>
                  <DialogTitle>Upgrade Your EduDesk Plan</DialogTitle>
                  <DialogDescription>
                    Unlock more features and enhance your school's management capabilities.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue={defaultTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pro" disabled={schoolProfile.tier === 'Pro'}>Pro Tier</TabsTrigger>
                    <TabsTrigger value="premium">Premium Tier</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pro">
                    <Card className="border-0 shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck /> Pro Tier</CardTitle>
                        <CardDescription>Ideal for growing schools needing advanced tools.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-3xl font-bold">$25 <span className="text-sm font-normal text-muted-foreground">/ student / year</span></p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            <li>All features from the Starter Tier.</li>
                            <li><span className="font-semibold text-primary">AI Lesson Planner & Test Generator.</span></li>
                            <li><span className="font-semibold text-primary">Advanced AI Performance Analytics.</span></li>
                            <li>Full Admissions & Enrollment Management.</li>
                            <li>Advanced Reporting Tools.</li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                         <Button className="w-full" onClick={() => handleSelectTier('Pro')}>
                            <CreditCard className="mr-2 h-4 w-4"/>
                            Upgrade to Pro
                         </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="premium">
                     <Card className="border-0 shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gem /> Premium Tier</CardTitle>
                        <CardDescription>The ultimate solution for large districts and institutions.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-3xl font-bold">Custom Pricing</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            <li>All features from the Pro Tier.</li>
                            <li><span className="font-semibold text-primary">Global Admin Role for Multi-School Management.</span></li>
                            <li><span className="font-semibold text-primary">Consolidated Billing & System-wide AI Analysis.</span></li>
                            <li>Dedicated Support & Onboarding.</li>
                            <li>Custom Integrations & Branding.</li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                         <Button className="w-full" onClick={() => handleSelectTier('Premium')}>
                            <CreditCard className="mr-2 h-4 w-4"/>
                            Contact Us to Upgrade
                         </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
            </>
        ) : (
            <>
                <DialogHeader>
                    <DialogTitle>Confirm Upgrade to {selectedTier} Tier</DialogTitle>
                    <DialogDescription>
                        By confirming, you enter into a service agreement with Pixel Digital Solutions. Please review the terms below.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm">
                    <div className="p-4 h-64 overflow-y-auto rounded-md border text-muted-foreground space-y-4">
                        <h4 className="font-semibold text-foreground">Payment & Billing</h4>
                        <p>Your subscription for the {selectedTier} Tier will be billed annually. Payment will be processed using your registered VISA or other card linked to your bank account. The subscription will automatically renew at the end of each term.</p>
                        <h4 className="font-semibold text-foreground">Cancellation Policy</h4>
                        <p>You may cancel your subscription at any time from your account settings. However, no refunds will be issued for the current subscription term. Your access to {selectedTier} features will continue until the end of the current billing period.</p>
                        <h4 className="font-semibold text-foreground">Failed Payments</h4>
                        <p>If the automatic renewal payment fails due to insufficient funds or other card issues, your account will be temporarily suspended. Access to premium features will be restricted until the outstanding balance is paid. You will be notified via email to update your payment information.</p>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)} />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the subscription terms with Pixel Digital Solutions.
                        </label>
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={() => setView('selection')}>
                        Back to Plans
                    </Button>
                    <Button type="button" onClick={handleConfirmUpgrade} disabled={!agreed}>
                        Confirm & Pay
                    </Button>
                </DialogFooter>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditProfileDialog() {
  const { schoolProfile, updateSchoolProfile } = useSchoolData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const transcriptInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { ...schoolProfile }
  });

  const logoPreview = form.watch('logoUrl');
  const certPreview = form.watch('certificateTemplateUrl');
  const transcriptPreview = form.watch('transcriptTemplateUrl');

  useEffect(() => {
    if (schoolProfile && isOpen) {
      form.reset(schoolProfile);
    }
  }, [schoolProfile, form, isOpen]);


  function onSubmit(values: ProfileFormValues) {
    if (!schoolProfile) return;
    updateSchoolProfile(values, schoolProfile.id);
    toast({
      title: 'Profile Updated',
      description: 'The school profile has been successfully updated.',
    });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit School Profile</DialogTitle>
          <DialogDescription>
            Update the core details for {schoolProfile?.name}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>School Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="head" render={({ field }) => ( <FormItem><FormLabel>Head of School</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="address" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="motto" render={({ field }) => ( <FormItem className="md:col-span-1"><FormLabel>School Motto</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="schoolLevel" render={({ field }) => ( <FormItem className="md:col-span-1"><FormLabel>School Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Primary">Primary</SelectItem><SelectItem value="Secondary">Secondary</SelectItem><SelectItem value="Full">Full (K-12)</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
              
              <div className="col-span-1 space-y-2">
                <FormLabel>School Logo</FormLabel>
                <div className="flex items-center gap-4">
                  <Image src={logoPreview || 'https://placehold.co/100x100.png'} alt="logo preview" width={48} height={48} className="rounded-md bg-muted object-cover" data-ai-hint="school logo"/>
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*"
                    onChange={() => {
                      const newLogoUrl = `https://placehold.co/100x100.png?v=${Date.now()}`;
                      form.setValue('logoUrl', newLogoUrl, { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Upload</Button>
                </div>
                 <FormField control={form.control} name="logoUrl" render={({ field }) => ( <FormItem><FormControl><Input type="hidden" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
              
              <div className="col-span-1 space-y-2">
                <FormLabel>Certificate Template</FormLabel>
                <div className="flex items-center gap-4">
                  <Image src={certPreview || 'https://placehold.co/100x100.png'} alt="certificate preview" width={48} height={48} className="rounded-md bg-muted object-cover" data-ai-hint="certificate document"/>
                  <input type="file" ref={certInputRef} className="hidden" accept="image/*"
                    onChange={() => {
                      const newCertUrl = `https://placehold.co/800x600.png?v=${Date.now()}`;
                      form.setValue('certificateTemplateUrl', newCertUrl, { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => certInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Upload</Button>
                </div>
                <FormField control={form.control} name="certificateTemplateUrl" render={({ field }) => ( <FormItem><FormControl><Input type="hidden" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>

               <div className="col-span-1 space-y-2">
                <FormLabel>Transcript Template</FormLabel>
                <div className="flex items-center gap-4">
                  <Image src={transcriptPreview || 'https://placehold.co/100x100.png'} alt="transcript preview" width={48} height={48} className="rounded-md bg-muted object-cover" data-ai-hint="transcript document"/>
                  <input type="file" ref={transcriptInputRef} className="hidden" accept="image/*"
                    onChange={() => {
                      const newTranscriptUrl = `https://placehold.co/600x800.png?v=${Date.now()}`;
                      form.setValue('transcriptTemplateUrl', newTranscriptUrl, { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => transcriptInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Upload</Button>
                </div>
                <FormField control={form.control} name="transcriptTemplateUrl" render={({ field }) => ( <FormItem><FormControl><Input type="hidden" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>

            </div>
            <DialogFooter className="border-t pt-4">
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


// --- Main Page Component ---
export default function SettingsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!authLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  if (authLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your school's profile, settings, and administration.</p>
      </header>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">School Profile</TabsTrigger>
            <TabsTrigger value="administration">Administration</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
            <ProfileTab />
        </TabsContent>
        <TabsContent value="administration" className="mt-6">
            <AdministrationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
