
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign, TrendingUp, TrendingDown, CheckCircle, BarChart, Users, Building } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

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
  
  const financialSummary = useMemo(() => {
    if (!allSchoolData) return { arr: 0, totalExpenses: 550000, netProfit: -550000, paidSchools: 0, overdueSchools: 0 };
    
    const arr = Object.values(allSchoolData).reduce((sum, school) => sum + (school.profile.subscription?.amount || 0) * 12, 0);
    const paidSchools = Object.values(allSchoolData).filter(s => s.profile.subscription?.status === 'Paid').length;
    const overdueSchools = Object.values(allSchoolData).filter(s => s.profile.subscription?.status === 'Overdue').length;
    
    // Placeholder expenses for demonstration
    const totalExpenses = 550000;
    const netProfit = arr - totalExpenses;

    return { arr, totalExpenses, netProfit, paidSchools, overdueSchools };
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


  if (isLoading || !allSchoolData) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">System Finance</h2>
        <p className="text-muted-foreground">Financial overview of the entire EduDesk platform.</p>
      </header>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Annual Recurring Revenue (ARR)</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{formatCurrency(financialSummary.arr)}</div><p className="text-xs text-muted-foreground">Projected annual income from subscriptions.</p></CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Operational Expenses</CardTitle><TrendingDown className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{formatCurrency(financialSummary.totalExpenses)}</div><p className="text-xs text-muted-foreground">Annual platform running costs.</p></CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Net Profit</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-500">{formatCurrency(financialSummary.netProfit)}</div><p className="text-xs text-muted-foreground">ARR minus operational expenses.</p></CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">School Subscriptions</CardTitle><Building className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{financialSummary.paidSchools} Paid</div><p className="text-xs text-muted-foreground">{financialSummary.overdueSchools} Overdue</p></CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>School Subscription Status</CardTitle>
            <CardDescription>An overview of monthly subscription payments from all schools.</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
