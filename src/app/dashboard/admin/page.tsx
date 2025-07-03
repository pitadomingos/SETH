'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { users } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserPlus, Loader2, PlusCircle, Settings } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSchoolData } from '@/context/school-data-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const boardSchema = z.object({
  name: z.string().min(2, "Board name must be at least 2 characters."),
});

type BoardFormValues = z.infer<typeof boardSchema>;


export default function AdminPanelPage() {
    const { role, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const { examBoards, addExamBoard } = useSchoolData();
    const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);

    const boardForm = useForm<BoardFormValues>({
        resolver: zodResolver(boardSchema),
        defaultValues: { name: '' },
    });

    function onBoardSubmit(values: BoardFormValues) {
        addExamBoard(values.name);
        boardForm.reset();
        setIsBoardDialogOpen(false);
    }

    if (authLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!authLoading && role !== 'Admin') {
        router.push('/dashboard');
        return null;
    }

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
                    <p className="text-muted-foreground">Manage users and system settings.</p>
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
                                            <Badge variant={user.status === 'Active' ? 'secondary' : 'destructive'}>
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
                        <CardDescription>Manage system-wide data like subjects and exam boards.</CardDescription>
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
