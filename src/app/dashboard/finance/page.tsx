

'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useSchoolData, FinanceRecord } from '@/context/school-data-context';
import { DollarSign, TrendingDown, Hourglass, PlusCircle, Loader2, CreditCard, Receipt, Calendar as CalendarIcon, Eye, BarChart2, Search } from 'lucide-react';
import { useEffect, useState, useMemo, useRef } from 'react';
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
import { cn, formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

// --- Fee Management ---
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

// --- Expense Management ---
const newExpenseSchema = z.object({
    description: z.string().min(3, "Description is required."),
    category: z.string({ required_error: "Please select a category."}),
    amount: z.coerce.number().positive("Amount must be positive."),
    date: z.date({ required_error: "An expense date is required."}),
    proofUrl: z.string().optional(),
});
type NewExpenseFormValues = z.infer<typeof newExpenseSchema>;


// --- Dialog Components ---

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
        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />New Fee</Button>
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

function NewExpenseDialog() {
  const { expenseCategories, addExpense } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<NewExpenseFormValues>({
    resolver: zodResolver(newExpenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
    }
  });

  const onSubmit = (values: NewExpenseFormValues) => {
    addExpense({
      ...values,
      date: format(values.date, 'yyyy-MM-dd'),
    });
    form.reset();
    setIsOpen(false);
  }

  const onOpenChange = (open) => {
    if (!open) form.reset();
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record New Expense</DialogTitle>
          <DialogDescription>Enter details for a school expense.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="e.g., Teacher Salaries - August" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="amount" render={({ field }) => ( <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent>{expenseCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
            </div>
            <FormField control={form.control} name="date" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )} />
            <div>
              <FormLabel>Proof of Payment</FormLabel>
              <Input type="file" ref={fileInputRef} className="mt-2" onChange={() => form.setValue('proofUrl', `https://placehold.co/400x200.png?v=${Date.now()}`)}/>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit">Save Expense</Button>
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
  const { schoolProfile } = useSchoolData();

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
            Fee for "{fee.description}". Balance due: {formatCurrency(balanceDue, schoolProfile?.currency)}
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

function ViewProofDialog({ proofUrl, description }: { proofUrl: string, description: string}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Proof of Payment</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Image src={proofUrl} alt={`Proof for ${description}`} width={400} height={200} className="rounded-md mx-auto" data-ai-hint="receipt invoice" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Charting ---
function ExpenseAllocationChart({ expenses }) {
  const chartData = useMemo(() => {
    if (!expenses) return [];
    const totalsByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    return Object.entries(totalsByCategory).map(([category, total]) => ({ category, total }));
  }, [expenses]);

  const chartConfig = {
    total: {
      label: "Total Expenses",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Allocations</CardTitle>
        <CardDescription>Total spending by category this year.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} />
            <XAxis type="number" hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// --- Status and Role Views ---

const getStatusInfo = (fee: FinanceRecord) => {
    const balance = fee.totalAmount - fee.amountPaid;
    const isOverdue = new Date(fee.dueDate) < new Date() && balance > 0;

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
  const { financeData, recordPayment, expensesData, schoolProfile } = useSchoolData();
  const [feeSearchTerm, setFeeSearchTerm] = useState('');
  const [expenseSearchTerm, setExpenseSearchTerm] = useState('');
  
  const filteredFinanceData = useMemo(() => {
    return financeData.filter(item => 
      item.studentName.toLowerCase().includes(feeSearchTerm.toLowerCase())
    );
  }, [financeData, feeSearchTerm]);

  const filteredExpenses = useMemo(() => {
    return expensesData.filter(item => 
      item.description.toLowerCase().includes(expenseSearchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(expenseSearchTerm.toLowerCase())
    );
  }, [expensesData, expenseSearchTerm]);

  const now = new Date();
  const totalRevenue = financeData.reduce((acc, f) => acc + f.amountPaid, 0);
  
  const pendingFees = financeData
    .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) >= now)
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
  
  const overdueFees = financeData
    .filter(f => (f.totalAmount - f.amountPaid > 0) && new Date(f.dueDate) < now)
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);
  
  const totalExpenses = expensesData.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap gap-2 justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Finance</h2>
            <p className="text-muted-foreground">Manage school finances, fees, and expenses.</p>
        </div>
        <div className="flex gap-2">
            <NewTransactionDialog />
            <NewExpenseDialog />
        </div>
      </header>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(totalRevenue, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">Total amount paid this year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{formatCurrency(pendingFees, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">Outstanding balance, not overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Fees</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(overdueFees, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">Outstanding balance, past due date</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses, schoolProfile?.currency)}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
                <CardTitle>Fee Collection Status</CardTitle>
                <CardDescription>An overview of student fee payments.</CardDescription>
                <div className="relative pt-4">
                  <Search className="absolute left-2.5 top-6.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by student name..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
                    value={feeSearchTerm}
                    onChange={(e) => setFeeSearchTerm(e.target.value)}
                  />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFinanceData.map(item => {
                            const balance = item.totalAmount - item.amountPaid;
                            const status = getStatusInfo(item);
                            return (
                              <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.studentName}</TableCell>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell className="text-right font-medium">{formatCurrency(balance, schoolProfile?.currency)}</TableCell>
                                  <TableCell><Badge variant={status.variant}>{status.text}</Badge></TableCell>
                                  <TableCell className="text-right">
                                      <RecordPaymentDialog fee={item} onRecordPayment={recordPayment} />
                                  </TableCell>
                              </TableRow>
                            );
                        })}
                         {filteredFinanceData.length === 0 && (
                          <TableRow><TableCell colSpan={5} className="h-24 text-center">No records found matching your search.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <ExpenseAllocationChart expenses={expensesData} />
        </div>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Expense Records</CardTitle>
                <CardDescription>A log of all recorded school expenses.</CardDescription>
                <div className="relative pt-4">
                  <Search className="absolute left-2.5 top-6.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by description or category..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
                    value={expenseSearchTerm}
                    onChange={(e) => setExpenseSearchTerm(e.target.value)}
                  />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Proof</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredExpenses.map(expense => (
                          <TableRow key={expense.id}>
                              <TableCell>{expense.date}</TableCell>
                              <TableCell className="font-medium">{expense.description}</TableCell>
                              <TableCell><Badge variant="outline">{expense.category}</Badge></TableCell>
                              <TableCell className="text-right">{formatCurrency(expense.amount, schoolProfile?.currency)}</TableCell>
                              <TableCell className="text-center">
                                 <ViewProofDialog proofUrl={expense.proofUrl} description={expense.description} />
                              </TableCell>
                          </TableRow>
                        ))}
                         {filteredExpenses.length === 0 && (
                          <TableRow><TableCell colSpan={5} className="h-24 text-center">No records found matching your search.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
      </Card>
    </div>
  );
}

function ParentFinanceView() {
    const { studentsData, financeData, schoolProfile } = useSchoolData();

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
                                          <TableCell className="text-right">{formatCurrency(feeInfo.totalAmount, schoolProfile?.currency)}</TableCell>
                                          <TableCell className="text-right">{formatCurrency(feeInfo.amountPaid, schoolProfile?.currency)}</TableCell>
                                          <TableCell className="text-right font-medium">{formatCurrency(balance, schoolProfile?.currency)}</TableCell>
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
