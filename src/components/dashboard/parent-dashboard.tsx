
'use client';
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from '@/navigation';
import { FileText as FileTextIcon, User, BookOpen, DollarSign, Calendar, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useSchoolData, Student, Grade } from "@/context/school-data-context";
import { formatGradeDisplay, formatCurrency } from '@/lib/utils';
import { EndOfTermReportDialog } from '@/components/dashboard/end-of-term-report';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const calculateAverageNumericGrade = (studentId: string, grades: Grade[]) => {
    if (!studentId || !grades) return 0;
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    const totalPoints = studentGrades.reduce((acc, g) => acc + parseFloat(g.grade), 0);
    return (totalPoints / studentGrades.length);
};

export default function ParentDashboard() {
  const { user } = useAuth();
  const { studentsData, grades, financeData, allSchoolData } = useSchoolData();

  const children = useMemo(() => {
    if (!user?.email) return [];
    return studentsData.filter(s => s.parentEmail === user.email).map(student => {
        const school = allSchoolData ? allSchoolData[student.schoolId] : null;
        return {
            ...student,
            schoolName: school?.profile.name || 'N/A',
            schoolGradingSystem: school?.profile.gradingSystem || '20-Point',
            schoolCurrency: school?.profile.currency || 'USD',
        };
    });
  }, [studentsData, user, allSchoolData]);

  const familyFinances = useMemo(() => {
      const childIds = new Set(children.map(c => c.id));
      return financeData.filter(f => childIds.has(f.studentId));
  }, [children, financeData]);

  const totalOutstanding = useMemo(() => {
    return familyFinances.reduce((acc, fee) => {
        const outstanding = fee.totalAmount - fee.amountPaid;
        return acc + (outstanding > 0 ? outstanding : 0);
    }, 0);
  }, [familyFinances]);

  if (children.length === 0) {
      return (
          <div className="flex h-full items-center justify-center">
              <Card className="w-full max-w-lg text-center">
                  <CardHeader>
                      <CardTitle>No Students Found</CardTitle>
                      <CardDescription>We could not find any students linked to your parent account ({user?.email}). Please contact the school administration to have your account linked.</CardDescription>
                  </CardHeader>
              </Card>
          </div>
      );
  }

  return (
    <div className="space-y-6">
       <header>
        <h2 className="text-3xl font-bold tracking-tight">Parent Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}. Here is a summary for your children.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Child Academic Summary Cards */}
        {children.map(child => {
            const avgGrade = calculateAverageNumericGrade(child.id, grades);
            return (
                <Card key={child.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3"><Avatar className="h-10 w-10"><AvatarImage src="" alt={child.name} /><AvatarFallback>{child.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar> {child.name}</CardTitle>
                            <Badge variant="outline">{child.schoolName}</Badge>
                        </div>
                        <CardDescription>Grade {child.grade} - Class {child.class}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Overall Average</p>
                        <p className="text-4xl font-bold">{formatGradeDisplay(avgGrade, child.schoolGradingSystem)}</p>
                    </CardContent>
                    <CardFooter>
                        <EndOfTermReportDialog student={child} />
                    </CardFooter>
                </Card>
            )
        })}
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DollarSign /> Family Financials</CardTitle>
          <CardDescription>A summary of all outstanding and paid fees for your children.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <p className="text-sm text-muted-foreground">Total Outstanding Balance</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(totalOutstanding, children[0]?.schoolCurrency)}</p>
            </div>
          <Table>
            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Fee Description</TableHead><TableHead>Due Date</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {familyFinances.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.studentName}</TableCell>
                  <TableCell>{fee.description}</TableCell>
                  <TableCell>{fee.dueDate}</TableCell>
                  <TableCell className="text-right">{formatCurrency(fee.totalAmount, children.find(c => c.id === fee.studentId)?.schoolCurrency)}</TableCell>
                  <TableCell><Badge variant={fee.status === 'Paid' ? 'secondary' : fee.status === 'Overdue' ? 'destructive' : 'outline'}>{fee.status}</Badge></TableCell>
                </TableRow>
              ))}
               {familyFinances.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No financial records found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="gap-2">
            <Link href="/dashboard/finance" className="w-full"><Button className="w-full">View Full Financials</Button></Link>
            <Link href="/dashboard/messaging" className="w-full"><Button variant="outline" className="w-full"><MessageSquare className="mr-2 h-4 w-4" /> Contact Accounts</Button></Link>
        </CardFooter>
      </Card>
    </div>
  );
}
