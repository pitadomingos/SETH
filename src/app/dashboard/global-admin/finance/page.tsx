
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign, TrendingUp, TrendingDown, CheckCircle, BarChart, Users, Building, ArrowUpCircle, ArrowDownCircle, PlusCircle, Package } from 'lucide-react';
import { useSchoolData, Expense } from '@/context/school-data-context';
import { useEffect, useMemo, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- Schemas ---
const corporateRecordSchema = z.object({
    type: z.enum(['Income', 'Expense']),
    description: z.string().min(3, "Description is required."),
    category: z.string().min(2, "Category is required."),
    amount: z.coerce.number().positive("Amount must be positive."),
    date: z.date({ required_error: "A date is required."}),
});
type CorporateRecordFormValues = z.infer<typeof corporateRecordSchema>;

const assetSchema = z.object({
  name: z.string().min(3, "Asset name is required."),
  category: z.string().min(2, "Category is required."),
  location: z.string().min(1, "Location is required."),
  assignedTo: z.string().optional(),
  status: z.enum(['In Use', 'Available', 'Maintenance']),
});
type AssetFormValues = z.infer<typeof assetSchema>;

// --- Dialogs ---
function CorporateRecordDialog({ type, children }: { type: 'Income' | 'Expense', children: React.ReactNode }) {
  const { addExpense } = useSchoolData();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CorporateRecordFormValues>({
    resolver: zodResolver(corporateRecordSchema),
    defaultValues: { type: type, description: '', amount: 0, category: '' }
  });

  useEffect(() => { if (isOpen) { form.reset({ type: type, description: '', amount: 0, category: '' }); } }, [isOpen, type, form]);

  const onSubmit = async (values: CorporateRecordFormValues) => {
    // Re-use addExpense but for the corporate entity by targeting the master record
    await addExpense({ ...values, date: format(values.date, 'yyyy-MM-dd'), proofUrl: '' });
    form.reset();
    setIsOpen(false);
  }
  
  const title = type === 'Income' ? 'Record Corporate Income' : 'Record Corporate Expense';
  const dialogDesc = type === 'Income' ? 'Enter details for corporate income (e.g., investments, service fees).' : 'Enter details for a corporate expense (e.g., salaries, hosting).';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{dialogDesc}</DialogDescription></DialogHeader>
        <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4"><FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder={type === 'Income' ? 'e.g., Consulting Services' : 'e.g., Cloud Hosting - AWS'} {...field} /></FormControl><FormMessage /></FormItem> )} /><div className="grid grid-cols-2 gap-4"><FormField control={form.control} name="amount" render={({ field }) => ( <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem> )} /><FormField control={form.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder={type === 'Income' ? 'e.g., Professional Services' : 'e.g., Infrastructure'} {...field} /></FormControl><FormMessage /></FormItem> )} /></div><FormField control={form.control} name="date" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )} /><DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Save Record</Button></DialogFooter></form></Form>
      </DialogContent>
    </Dialog>
  )
}

function NewAssetDialog() {
    const { addAsset } = useSchoolData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const form = useForm<AssetFormValues>({
        resolver: zodResolver(assetSchema),
        defaultValues: { name: '', category: '', location: '', assignedTo: 'N/A', status: 'Available' }
    });

    async function onSubmit(values: AssetFormValues) {
        await addAsset(values);
        form.reset();
        setIsDialogOpen(false);
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add Asset</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Add New Corporate Asset</DialogTitle><DialogDescription>Enter details for a new company asset.</DialogDescription></DialogHeader>
                <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4"><FormField control={form.control} name="name" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Asset Name</FormLabel><FormControl><Input placeholder="e.g., MacBook Pro" {...field} /></FormControl><FormMessage /></FormItem> )} /><FormField control={form.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., IT Equipment" {...field} /></FormControl><FormMessage /></FormItem> )} /><FormField control={form.control} name="location" render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., HQ Office" {...field} /></FormControl><FormMessage /></FormItem> )} /><FormField control={form.control} name="assignedTo" render={({ field }) => ( <FormItem><FormLabel>Assigned To</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} /><FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Available">Available</SelectItem><SelectItem value="In Use">In Use</SelectItem><SelectItem value="Maintenance">Maintenance</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} /><DialogFooter className="col-span-2 mt-4"><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={form.formState.isSubmitting}>Add Asset</Button></DialogFooter></form></Form>
            </DialogContent>
        </Dialog>
    )
}

export default function SystemFinancePage() {
  const { role, isLoading: authLoading } = useAuth();
  const { allSchoolData, isLoading: schoolLoading } = useSchoolData();
  const router = useRouter();

  const isLoading = authLoading || schoolLoading;

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);
  
  const systemData = useMemo(() => {
      if (!allSchoolData) return {
          arr: 0, totalExpenses: 0, netProfit: 0, paidSchools: 0, overdueSchools: 0,
          corporateExpenses: [], corporateAssets: []
      };
      
      const arr = Object.values(allSchoolData).reduce((sum, school) => sum + (school.profile.subscription?.amount || 0) * 12, 0);
      const paidSchools = Object.values(allSchoolData).filter(s => s.profile.subscription?.status === 'Paid').length;
      const overdueSchools = Object.values(allSchoolData).filter(s => s.profile.subscription?.status === 'Overdue').length;
      
      const masterRecord = allSchoolData['northwood'];
      const corporateExpenses = masterRecord?.expenses || [];
      const corporateAssets = masterRecord?.assets || [];

      const totalPlatformExpenses = corporateExpenses.filter(e => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0);
      const netProfit = arr - totalPlatformExpenses;

      return { arr, totalExpenses: totalPlatformExpenses, netProfit, paidSchools, overdueSchools, corporateExpenses, corporateAssets };
  }, [allSchoolData]);

  const subscriptionDetails = useMemo(() => {
      if (!allSchoolData) return [];
      return Object.values(allSchoolData).map(school => ({
          id: school.profile.id,
          name: school.profile.name,
          tier: school.profile.tier,
          ...school.profile.subscription
      }));
  }, [allSchoolData]);

  const schoolFinancialSummaries = useMemo(() => {
    if (!allSchoolData) return [];
    return Object.values(allSchoolData).map(school => {
      const revenue = school.finance.reduce((sum, f) => sum + f.amountPaid, 0);
      const otherIncome = school.expenses.filter(e => e.type === 'Income').reduce((sum, e) => sum + e.amount, 0);
      const totalRevenue = revenue + otherIncome;

      const totalExpenses = school.expenses.filter(e => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0);

      const netBalance = totalRevenue - totalExpenses;

      return {
        id: school.profile.id,
        name: school.profile.name,
        totalRevenue,
        totalExpenses,
        netBalance,
        currency: school.profile.currency
      };
    });
  }, [allSchoolData]);


  if (isLoading || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">System Finance</h2>
        <p className="text-muted-foreground">Financial overview of the EduDesk platform and individual school performance.</p>
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle>Platform Financial Overview (Pixel Digital Solutions)</CardTitle>
            <CardDescription>High-level financial metrics for the EduDesk platform itself.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Annual Recurring Revenue (ARR)</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(systemData.arr)}</div><p className="text-xs text-muted-foreground">Projected from subscriptions</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Operational Expenses</CardTitle><TrendingDown className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(systemData.totalExpenses)}</div><p className="text-xs text-muted-foreground">Annual platform running costs</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Net Profit</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className={`text-2xl font-bold ${systemData.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(systemData.netProfit)}</div><p className="text-xs text-muted-foreground">ARR minus operational expenses</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">School Subscriptions</CardTitle><Building className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{systemData.paidSchools} Paid</div><p className="text-xs text-muted-foreground">{systemData.overdueSchools} Overdue</p></CardContent></Card>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
            <h3 className="font-semibold text-lg">Subscription Details</h3>
            <Table>
                <TableHeader><TableRow><TableHead>School</TableHead><TableHead>Tier</TableHead><TableHead>Monthly Fee</TableHead><TableHead>Next Due Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                    {subscriptionDetails.map(sub => (
                        <TableRow key={sub.id}>
                            <TableCell className="font-medium">{sub.name}</TableCell>
                            <TableCell><Badge variant="outline">{sub.tier}</Badge></TableCell>
                            <TableCell>{formatCurrency(sub.amount || 0)}</TableCell>
                            <TableCell>{sub.dueDate ? format(new Date(sub.dueDate), 'PPP') : 'N/A'}</TableCell>
                            <TableCell><Badge variant={sub.status === 'Paid' ? 'secondary' : 'destructive'}>{sub.status}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Corporate Ledger (Income & Expenses)</CardTitle>
                <CardDescription>Manage finances for Pixel Digital Solutions.</CardDescription>
              </div>
              <div className="flex gap-2">
                <CorporateRecordDialog type="Income"><Button><ArrowUpCircle className="mr-2 h-4 w-4" /> Add Income</Button></CorporateRecordDialog>
                <CorporateRecordDialog type="Expense"><Button variant="destructive"><ArrowDownCircle className="mr-2 h-4 w-4" /> Add Expense</Button></CorporateRecordDialog>
              </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                    {systemData.corporateExpenses.map(expense => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell><Badge variant={expense.type === 'Income' ? 'secondary' : 'destructive'}>{expense.type}</Badge></TableCell>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell><Badge variant="outline">{expense.category}</Badge></TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(expense.amount, 'USD')}</TableCell>
                    </TableRow>
                  ))}
                   {systemData.corporateExpenses.length === 0 && <TableRow><TableCell colSpan={5} className="text-center h-24">No corporate financial records yet.</TableCell></TableRow>}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Corporate Asset Inventory</CardTitle>
                <CardDescription>Manage assets owned by Pixel Digital Solutions.</CardDescription>
              </div>
              <NewAssetDialog />
            </div>
        </CardHeader>
        <CardContent>
            <Table><TableHeader><TableRow><TableHead>Asset Name</TableHead><TableHead>Category</TableHead><TableHead>Location</TableHead><TableHead>Assigned To</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {systemData.corporateAssets.map((asset) => (<TableRow key={asset.id}><TableCell className="font-medium">{asset.name}</TableCell><TableCell>{asset.category}</TableCell><TableCell>{asset.location}</TableCell><TableCell>{asset.assignedTo}</TableCell><TableCell><Badge variant={asset.status === 'In Use' ? 'secondary' : asset.status === 'Available' ? 'default' : 'destructive'}>{asset.status}</Badge></TableCell></TableRow>))}
                  {systemData.corporateAssets.length === 0 && <TableRow><TableCell colSpan={5} className="text-center h-24">No corporate assets recorded yet.</TableCell></TableRow>}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>School Financial Health</CardTitle>
            <CardDescription>A summary of the internal finances for each school.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader><TableRow><TableHead>School</TableHead><TableHead className="text-right">Total Revenue</TableHead><TableHead className="text-right">Total Expenses</TableHead><TableHead className="text-right">Net Balance</TableHead></TableRow></TableHeader>
                <TableBody>
                    {schoolFinancialSummaries.map(summary => (
                        <TableRow key={summary.id}>
                            <TableCell className="font-medium">{summary.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(summary.totalRevenue, summary.currency)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(summary.totalExpenses, summary.currency)}</TableCell>
                            <TableCell className={`text-right font-bold ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(summary.netBalance, summary.currency)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
