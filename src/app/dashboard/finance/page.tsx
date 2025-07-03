
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData, FinanceRecord } from '@/context/school-data-context';
import { DollarSign, TrendingDown, Hourglass, PlusCircle, Loader2, CreditCard, Receipt, Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';


const paymentSchema = z.object({
  amount: z.coerce.number().positive("Payment amount must be a positive number."),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const newTransactionSchema = z.object({
    studentId: z.string({ required_error: "Please select a student." }),
    description: z.string({ required_error: "Please select a fee description." }),
    totalAmount: z.coerce.number().positive("Amount must be a positive number."),
    dueDate: z.date({ required_error: "A due date is required."}),
});

type NewTransactionFormValues = z.infer<typeof newTransactionSchema>;

function NewTransactionDialog() {
  const { studentsData, feeDescriptions, addFee } = useSchoolData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<NewTransactionFormValues>({
    resolver: zodResolver(newTransactionSchema),
  });

  function onSubmit(values: NewTransactionFormValues) {
    addFee({
      ...values,
      dueDate: format(values.dueDate, 'yyyy-MM-dd')
    });
    form.reset();
    setIsDialogOpen(false);
  }

  return (
     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" />New Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New Fee Transaction</DialogTitle>
          <DialogDescription>
            Create a new fee record for a student. It will be added to their account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {studentsData.map(student => (
                        <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fee description" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {feeDescriptions.map(desc => (
                        <SelectItem key={desc} value={desc}>{desc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 1200.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                  <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                      <PopoverTrigger asChild>
                      <FormControl>
                          <Button
                          variant={"outline"}
                          className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                          )}
                          >
                          {field.value ? format(field.value, "PPP") : (
                              <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                      </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                      />
                      </PopoverContent>
                  </Popover>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Fee
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


function RecordPaymentDialog({ fee, onRecordPayment }: { fee: FinanceRecord, onRecordPayment: (feeId: string, amount: number) => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const balanceDue = fee.totalAmount - fee.amountPaid;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: balanceDue,
    },
  });

  function onSubmit(values: PaymentFormValues) {
    onRecordPayment(fee.id, values.amount);
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={fee.totalAmount - fee.amountPaid <= 0}>
          <Receipt className="mr-2 h-4 w-4" /> Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment for {fee.studentName}</DialogTitle>
          <DialogDescription>
            Fee for "{fee.description}". Balance due: ${balanceDue.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 50.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Payment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const getStatusInfo = (fee: FinanceRecord) => {
    const balance = fee.totalAmount - fee.amountPaid;
    const isOverdue = new Date(fee.dueDate) < new Date();

    if (balance <= 0) {
        return { text: 'Paid', variant: 'secondary' as const };
    }
    if (isOverdue) {
        return { text: 'Overdue', variant: 'destructive' as const };
    }
     if (fee.amountPaid > 0) {
        return { text: 'Partially Paid', variant: 'outline' as const };
    }
    return { text: 'Pending', variant: 'outline' as const };
};

function AdminFinanceView() {
  const { financeData, recordPayment } = useSchoolData();
  
  const now = new Date();
  const totalRevenue = financeData.reduce((acc, f) => acc + f.amountPaid, 0);
  
  const pendingFees = financeData
    .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) >= now)
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
  
  const overdueFees = financeData
    .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) < now)
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
  
  const totalExpenses = 45200; // Mock data for now

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Finance</h2>
            <p className="text-muted-foreground">Manage school finances, fees, and expenses.</p>
        </div>
        <NewTransactionDialog />
      </header>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total amount paid this year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">${pendingFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding balance, not overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Fees</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${overdueFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding balance, past due date</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Fee Collection Status</CardTitle>
            <CardDescription>An overview of student fee payments.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {financeData.map(item => {
                        const balance = item.totalAmount - item.amountPaid;
                        const status = getStatusInfo(item);
                        return (
                          <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.studentName}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell className="text-right">${item.totalAmount.toLocaleString()}</TableCell>
                              <TableCell className="text-right">${item.amountPaid.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-medium">${balance.toLocaleString()}</TableCell>
                              <TableCell>{item.dueDate}</TableCell>
                              <TableCell><Badge variant={status.variant}>{status.text}</Badge></TableCell>
                              <TableCell className="text-right">
                                  <RecordPaymentDialog fee={item} onRecordPayment={recordPayment} />
                              </TableCell>
                          </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ParentFinanceView() {
    const { studentsData, financeData } = useSchoolData();

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold tracking-tight">Family Fee Portal</h2>
                <p className="text-muted-foreground">Manage tuition and fee payments for your children.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Fee Status per Child</CardTitle>
                    <CardDescription>An overview of current and upcoming fee payments for your family.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Child's Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Total Due</TableHead>
                                <TableHead className="text-right">Amount Paid</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentsData.map(child => {
                                const feesForChild = financeData.filter(f => f.studentId === child.id);
                                if (feesForChild.length === 0) {
                                    return (
                                        <TableRow key={child.id}>
                                            <TableCell className="font-medium">{child.name}</TableCell>
                                            <TableCell colSpan={6} className="text-muted-foreground text-center">No fee information available for {child.name}</TableCell>
                                        </TableRow>
                                    );
                                }
                                return feesForChild.map(feeInfo => {
                                    const balance = feeInfo.totalAmount - feeInfo.amountPaid;
                                    const status = getStatusInfo(feeInfo);
                                    return (
                                      <TableRow key={feeInfo.id}>
                                          <TableCell className="font-medium">{child.name}</TableCell>
                                          <TableCell>{feeInfo.description}</TableCell>
                                          <TableCell className="text-right">${feeInfo.totalAmount.toLocaleString()}</TableCell>
                                          <TableCell className="text-right">${feeInfo.amountPaid.toLocaleString()}</TableCell>
                                          <TableCell className="text-right font-medium">${balance.toLocaleString()}</TableCell>
                                          <TableCell>{feeInfo.dueDate}</TableCell>
                                          <TableCell><Badge variant={status.variant}>{status.text}</Badge></TableCell>
                                      </TableRow>
                                    );
                                });
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default function FinancePage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== 'Admin' && role !== 'Parent') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || (role !== 'Admin' && role !== 'Parent')) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="animate-in fade-in-50">
        {role === 'Admin' && <AdminFinanceView />}
        {role === 'Parent' && <ParentFinanceView />}
    </div>
  );
}
