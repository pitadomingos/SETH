
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserPlus, Loader2, PlusCircle, Settings, BookCopy, Users, CalendarDays, Calendar as CalendarIcon, DollarSign, Save, Trash2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSchoolData, SchoolProfile } from '@/context/school-data-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';


const boardSchema = z.object({
  name: z.string().min(2, "Board name must be at least 2 characters."),
});
type BoardFormValues = z.infer<typeof boardSchema>;

const descriptionSchema = z.object({
  name: z.string().min(3, "Description must be at least 3 characters."),
});
type DescriptionFormValues = z.infer<typeof descriptionSchema>;

const audienceSchema = z.object({
  name: z.string().min(3, "Audience name must be at least 3 characters."),
});
type AudienceFormValues = z.infer<typeof audienceSchema>;

const termSchema = z.object({
  name: z.string().min(3, "Term name is required."),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
});
type TermFormValues = z.infer<typeof termSchema>;

const holidaySchema = z.object({
  name: z.string().min(3, "Holiday name is required."),
  date: z.date({ required_error: "Date is required." }),
});
type HolidayFormValues = z.infer<typeof holidaySchema>;

export default function AdminPanelPage() {
    const { role, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const { 
        schoolProfile, updateSchoolProfile,
        examBoards, addExamBoard, deleteExamBoard,
        studentsData, teachersData, 
        feeDescriptions, addFeeDescription, deleteFeeDescription,
        audiences, addAudience, deleteAudience,
        terms, addTerm,
        holidays, addHoliday
    } = useSchoolData();

    const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);
    const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
    const [isAudienceDialogOpen, setIsAudienceDialogOpen] = useState(false);
    const [isTermDialogOpen, setIsTermDialogOpen] = useState(false);
    const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
    const [gradeCapacities, setGradeCapacities] = useState<Record<string, number>>(schoolProfile?.gradeCapacity || {});

    useEffect(() => {
        if (schoolProfile) {
            setGradeCapacities(schoolProfile.gradeCapacity || {});
        }
    }, [schoolProfile]);

    useEffect(() => {
        if (!authLoading && role !== 'Admin') {
            router.push('/dashboard');
        }
    }, [role, authLoading, router]);

    const users = useMemo(() => {
        const studentUsers = studentsData.map(s => ({ id: s.id, name: s.name, email: s.email, role: 'Student' as const, status: s.status, }));
        const teacherUsers = teachersData.map(t => ({ id: t.id, name: t.name, email: t.email, role: 'Teacher' as const, status: t.status, }));
        return [...teacherUsers, ...studentUsers];
    }, [studentsData, teachersData]);

    const boardForm = useForm<BoardFormValues>({ resolver: zodResolver(boardSchema), defaultValues: { name: '' } });
    const descriptionForm = useForm<DescriptionFormValues>({ resolver: zodResolver(descriptionSchema), defaultValues: { name: '' } });
    const audienceForm = useForm<AudienceFormValues>({ resolver: zodResolver(audienceSchema), defaultValues: { name: '' } });
    const termForm = useForm<TermFormValues>({ resolver: zodResolver(termSchema) });
    const holidayForm = useForm<HolidayFormValues>({ resolver: zodResolver(holidaySchema) });

    function onBoardSubmit(values: BoardFormValues) { addExamBoard(values.name); boardForm.reset(); setIsBoardDialogOpen(false); }
    function onDescriptionSubmit(values: DescriptionFormValues) { addFeeDescription(values.name); descriptionForm.reset(); setIsDescriptionDialogOpen(false); }
    function onAudienceSubmit(values: AudienceFormValues) { addAudience(values.name); audienceForm.reset(); setIsAudienceDialogOpen(false); }
    function onTermSubmit(values: TermFormValues) { addTerm(values); termForm.reset(); setIsTermDialogOpen(false); }
    function onHolidaySubmit(values: HolidayFormValues) { addHoliday(values); holidayForm.reset(); setIsHolidayDialogOpen(false); }

    const getStatusVariant = (status: 'Active' | 'Inactive' | 'Transferred') => {
        switch (status) {
        case 'Active': return 'secondary';
        case 'Inactive': return 'destructive';
        case 'Transferred': return 'outline';
        default: return 'default';
        }
    };

    function handleCurrencyChange(value: SchoolProfile['currency']) {
        if (schoolProfile) {
            updateSchoolProfile({ ...schoolProfile, currency: value });
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
            updateSchoolProfile({ ...schoolProfile, gradeCapacity: gradeCapacities });
            toast({
                title: "Capacities Updated",
                description: "Grade level capacities have been saved.",
            });
        }
    };

    if (authLoading || role !== 'Admin') {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header>
                <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
                <p className="text-muted-foreground">Manage users, system data, and academic calendar.</p>
            </header>
            
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View and manage all users in the system.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
                            <TableBody>
                                {users.slice(0, 5).map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                        <TableCell><Badge variant={getStatusVariant(user.status)}>{user.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end"><DropdownMenuItem>Edit</DropdownMenuItem><DropdownMenuItem>View Profile</DropdownMenuItem><DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem></DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                 <Card className="xl:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CalendarDays /> Academic Year</CardTitle>
                        <CardDescription>Configure terms and holidays for the school year.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Academic Terms</h4>
                                 <Dialog open={isTermDialogOpen} onOpenChange={setIsTermDialogOpen}>
                                    <DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Term</Button></DialogTrigger>
                                    <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Add New Term</DialogTitle><DialogDescription>Define a new academic term.</DialogDescription></DialogHeader>
                                        <Form {...termForm}><form onSubmit={termForm.handleSubmit(onTermSubmit)} className="space-y-4 py-4">
                                            <FormField control={termForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Term Name</FormLabel><FormControl><Input placeholder="e.g., Term 1" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                            <FormField control={termForm.control} name="startDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/>
                                            <FormField control={termForm.control} name="endDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/>
                                            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Save Term</Button></DialogFooter>
                                        </form></Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                             <ul className="mt-3 space-y-2">{terms.map(term => ( <li key={term.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"><span>{term.name}</span> <span className="text-muted-foreground">{format(term.startDate, 'MMM d')} - {format(term.endDate, 'MMM d, yyyy')}</span></li> ))}</ul>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Holidays</h4>
                                <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
                                    <DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Holiday</Button></DialogTrigger>
                                    <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Add New Holiday</DialogTitle><DialogDescription>Schedule an official school holiday.</DialogDescription></DialogHeader>
                                        <Form {...holidayForm}><form onSubmit={holidayForm.handleSubmit(onHolidaySubmit)} className="space-y-4 py-4">
                                            <FormField control={holidayForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Holiday Name</FormLabel><FormControl><Input placeholder="e.g., Winter Break" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                            <FormField control={holidayForm.control} name="date" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/>
                                            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Save Holiday</Button></DialogFooter>
                                        </form></Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <ul className="mt-3 space-y-2">{holidays.map(holiday => ( <li key={holiday.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"><span>{holiday.name}</span><span className="text-muted-foreground">{format(holiday.date, 'PPP')}</span></li> ))}</ul>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="xl:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Settings /> System Data</CardTitle>
                        <CardDescription>Manage system-wide data definitions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">School Currency</h4>
                            </div>
                            <div className="mt-3">
                                <Select value={schoolProfile?.currency} onValueChange={handleCurrencyChange} >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD ($)</SelectItem>
                                        <SelectItem value="ZAR">ZAR (R)</SelectItem>
                                        <SelectItem value="MZN">MZN (MT)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Examination Boards</h4>
                                 <Dialog open={isBoardDialogOpen} onOpenChange={setIsBoardDialogOpen}>
                                    <DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Board</Button></DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Add New Exam Board</DialogTitle><DialogDescription>Enter the name of the new exam board.</DialogDescription></DialogHeader>
                                        <Form {...boardForm}><form onSubmit={boardForm.handleSubmit(onBoardSubmit)} className="space-y-4 py-4">
                                            <FormField control={boardForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Board Name</FormLabel><FormControl><Input placeholder="e.g., Advanced Placement" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={boardForm.formState.isSubmitting}>{boardForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Board</Button></DialogFooter>
                                        </form></Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <ul className="mt-3 space-y-2">
                                {examBoards.map(board => (
                                    <li key={board} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                        <span>{board}</span>
                                        {board !== 'Internal' && (
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteExamBoard(board)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Fee Descriptions</h4>
                                 <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
                                    <DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Description</Button></DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Add New Fee Description</DialogTitle><DialogDescription>Enter a new fee description to be used in transactions.</DialogDescription></DialogHeader>
                                        <Form {...descriptionForm}><form onSubmit={descriptionForm.handleSubmit(onDescriptionSubmit)} className="space-y-4 py-4">
                                            <FormField control={descriptionForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="e.g., Field Trip" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={descriptionForm.formState.isSubmitting}>{descriptionForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Description</Button></DialogFooter>
                                        </form></Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <ul className="mt-3 space-y-2">
                                {feeDescriptions.map(desc => (
                                    <li key={desc} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                        <span>{desc}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteFeeDescription(desc)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Event Audiences</h4>
                                 <Dialog open={isAudienceDialogOpen} onOpenChange={setIsAudienceDialogOpen}>
                                    <DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Audience</Button></DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Add New Event Audience</DialogTitle><DialogDescription>Enter a new audience type to be used when creating events.</DialogDescription></DialogHeader>
                                        <Form {...audienceForm}><form onSubmit={audienceForm.handleSubmit(onAudienceSubmit)} className="space-y-4 py-4">
                                            <FormField control={audienceForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Audience Name</FormLabel><FormControl><Input placeholder="e.g., All Staff" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={audienceForm.formState.isSubmitting}>{audienceForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Audience</Button></DialogFooter>
                                        </form></Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <ul className="mt-3 space-y-2">
                                {audiences.map(aud => (
                                    <li key={aud} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                        <span>{aud}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteAudience(aud)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-2 xl:col-span-3">
                    <CardHeader>
                        <CardTitle>Grade Capacity Management</CardTitle>
                        <CardDescription>Set the maximum number of students for each grade level to manage admissions.</CardDescription>
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
            </div>
        </div>
    );
}
