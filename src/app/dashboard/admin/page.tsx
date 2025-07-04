
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserPlus, Loader2, PlusCircle, Settings, BookCopy, Users } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSchoolData } from '@/context/school-data-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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


export default function AdminPanelPage() {
    const { role, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const { examBoards, addExamBoard, studentsData, teachersData, feeDescriptions, addFeeDescription, audiences, addAudience } = useSchoolData();
    const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);
    const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
    const [isAudienceDialogOpen, setIsAudienceDialogOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && role !== 'Admin') {
            router.push('/dashboard');
        }
    }, [role, authLoading, router]);

    const users = useMemo(() => {
        const studentUsers = studentsData.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            role: 'Student' as const,
            status: s.status,
        }));

        const teacherUsers = teachersData.map(t => ({
            id: t.id,
            name: t.name,
            email: t.email,
            role: 'Teacher' as const,
            status: t.status,
        }));
        
        return [...teacherUsers, ...studentUsers];
    }, [studentsData, teachersData]);

    const boardForm = useForm<BoardFormValues>({
        resolver: zodResolver(boardSchema),
        defaultValues: { name: '' },
    });

    const descriptionForm = useForm<DescriptionFormValues>({
        resolver: zodResolver(descriptionSchema),
        defaultValues: { name: '' },
    });

    const audienceForm = useForm<AudienceFormValues>({
        resolver: zodResolver(audienceSchema),
        defaultValues: { name: '' },
    });


    function onBoardSubmit(values: BoardFormValues) {
        addExamBoard(values.name);
        boardForm.reset();
        setIsBoardDialogOpen(false);
    }

    function onDescriptionSubmit(values: DescriptionFormValues) {
        addFeeDescription(values.name);
        descriptionForm.reset();
        setIsDescriptionDialogOpen(false);
    }

    function onAudienceSubmit(values: AudienceFormValues) {
        addAudience(values.name);
        audienceForm.reset();
        setIsAudienceDialogOpen(false);
    }

    const getStatusVariant = (status: 'Active' | 'Inactive' | 'Transferred') => {
        switch (status) {
        case 'Active':
            return 'secondary';
        case 'Inactive':
            return 'destructive';
        case 'Transferred':
            return 'outline';
        default:
            return 'default';
        }
    };

    if (authLoading || role !== 'Admin') {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
                    <p className="text-muted-foreground">Manage users and system data.</p>
                </div>
            </header>
            
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View and manage all users in the system.</CardDescription>
                        </div>
                        <Button size="sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(user.status)}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Settings /> System Data</CardTitle>
                        <CardDescription>Manage system-wide data definitions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Examination Boards</h4>
                                 <Dialog open={isBoardDialogOpen} onOpenChange={setIsBoardDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Board</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add New Exam Board</DialogTitle>
                                            <DialogDescription>Enter the name of the new exam board.</DialogDescription>
                                        </DialogHeader>
                                        <Form {...boardForm}>
                                        <form onSubmit={boardForm.handleSubmit(onBoardSubmit)} className="space-y-4 py-4">
                                            <FormField
                                            control={boardForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Board Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Advanced Placement" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button type="button" variant="secondary">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit" disabled={boardForm.formState.isSubmitting}>
                                                    {boardForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Save Board
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <ul className="mt-3 space-y-2">
                                {examBoards.map(board => (
                                    <li key={board} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                        <span>{board}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                         <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Fee Descriptions</h4>
                                 <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Description</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add New Fee Description</DialogTitle>
                                            <DialogDescription>Enter a new fee description to be used in transactions.</DialogDescription>
                                        </DialogHeader>
                                        <Form {...descriptionForm}>
                                        <form onSubmit={descriptionForm.handleSubmit(onDescriptionSubmit)} className="space-y-4 py-4">
                                            <FormField
                                            control={descriptionForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Field Trip" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button type="button" variant="secondary">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit" disabled={descriptionForm.formState.isSubmitting}>
                                                    {descriptionForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Save Description
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <ul className="mt-3 space-y-2">
                                {feeDescriptions.map(desc => (
                                    <li key={desc} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                        <span>{desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Event Audiences</h4>
                                 <Dialog open={isAudienceDialogOpen} onOpenChange={setIsAudienceDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Audience</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add New Event Audience</DialogTitle>
                                            <DialogDescription>Enter a new audience type to be used when creating events.</DialogDescription>
                                        </DialogHeader>
                                        <Form {...audienceForm}>
                                        <form onSubmit={audienceForm.handleSubmit(onAudienceSubmit)} className="space-y-4 py-4">
                                            <FormField
                                            control={audienceForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Audience Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., All Staff" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button type="button" variant="secondary">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit" disabled={audienceForm.formState.isSubmitting}>
                                                    {audienceForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Save Audience
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <ul className="mt-3 space-y-2">
                                {audiences.map(aud => (
                                    <li key={aud} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                        <span>{aud}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
