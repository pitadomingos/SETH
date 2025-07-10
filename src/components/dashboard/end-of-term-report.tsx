
'use client';
import { useSchoolData, Student } from '@/context/school-data-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Download, FileText } from 'lucide-react';
import { useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { formatGradeDisplay } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function EndOfTermReportDialog({ student }: { student: Student }) {
    const { schoolProfile, grades, attendance, teachersData } = useSchoolData();
    const { toast } = useToast();

    const studentGrades = useMemo(() => {
        return grades.filter(g => g.studentId === student.id);
    }, [student.id, grades]);

    const studentAttendance = useMemo(() => {
        const records = attendance.filter(a => a.studentId === student.id);
        return records.reduce((acc, record) => {
            acc[record.status.toLowerCase()] = (acc[record.status.toLowerCase()] || 0) + 1;
            return acc;
        }, { present: 0, late: 0, absent: 0, sick: 0 });
    }, [student.id, attendance]);

    const behavioralAssessments = useMemo(() => {
        return student.behavioralAssessments
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 3); // Show latest 3
    }, [student.behavioralAssessments]);

    const handleDownload = () => {
        toast({ title: 'Download Started', description: `Generating PDF report for ${student.name}...` });
        window.print();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full"><FileText className="mr-2 h-4 w-4" /> View End of Term Report</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>End of Term Report</DialogTitle>
                    <DialogDescription>A comprehensive summary of {student.name}'s performance.</DialogDescription>
                </DialogHeader>
                
                <div id="report-content" className="max-h-[75vh] overflow-y-auto p-1 pr-4 space-y-8 print:overflow-visible print:max-h-full print:p-0">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                             <Image src={schoolProfile?.logoUrl || "https://placehold.co/100x100.png"} alt="School Logo" width={80} height={80} data-ai-hint="school logo"/>
                             <div>
                                <h3 className="text-2xl font-bold">{schoolProfile?.name}</h3>
                                <p className="text-muted-foreground">{schoolProfile?.address}</p>
                             </div>
                        </div>
                        <div className="text-right">
                            <h4 className="text-xl font-semibold">Student Report Card</h4>
                            <p className="text-sm text-muted-foreground">{format(new Date(), 'MMMM yyyy')}</p>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Student Details */}
                     <div className="grid grid-cols-3 gap-4 text-sm">
                        <div><span className="font-semibold">Student Name:</span> {student.name}</div>
                        <div><span className="font-semibold">Grade:</span> {student.grade}</div>
                        <div><span className="font-semibold">Class:</span> {student.class}</div>
                        <div><span className="font-semibold">Student ID:</span> {student.id}</div>
                        <div><span className="font-semibold">Date of Birth:</span> {student.dateOfBirth}</div>
                        <div><span className="font-semibold">Term:</span> Fall {new Date().getFullYear()}</div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Academic Performance */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold border-b pb-2">Academic Performance</h4>
                            <Table>
                                <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead className="text-right">Grade</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {studentGrades.map((grade, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{grade.subject}</TableCell>
                                            <TableCell className="text-right font-medium">{formatGradeDisplay(grade.grade, schoolProfile?.gradingSystem)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {studentGrades.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">No grades recorded.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Attendance Summary */}
                         <div className="space-y-4">
                            <h4 className="text-lg font-semibold border-b pb-2">Attendance Summary</h4>
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                                <div className="flex justify-between items-center"><span className="text-sm">Present:</span> <span className="font-bold">{studentAttendance.present}</span></div>
                                <div className="flex justify-between items-center"><span className="text-sm">Late:</span> <span className="font-bold">{studentAttendance.late}</span></div>
                                <div className="flex justify-between items-center"><span className="text-sm">Absent:</span> <span className="font-bold">{studentAttendance.absent}</span></div>
                                <div className="flex justify-between items-center"><span className="text-sm">Sick:</span> <span className="font-bold">{studentAttendance.sick}</span></div>
                            </div>
                        </div>
                     </div>
                     
                    {/* Behavioral Assessment */}
                    <div className="space-y-4 pt-4">
                        <h4 className="text-lg font-semibold border-b pb-2">Behavioral Assessment</h4>
                         {behavioralAssessments.length > 0 ? (
                             <div className="space-y-4">
                                {behavioralAssessments.map((assessment) => {
                                    const teacher = teachersData.find(t => t.id === assessment.teacherId);
                                    return (
                                        <div key={assessment.id} className="p-4 border rounded-lg">
                                            <div className="flex justify-between items-baseline mb-2">
                                                <h5 className="font-semibold">{teacher?.name || 'Teacher'}</h5>
                                                <p className="text-xs text-muted-foreground">{format(assessment.date, 'PPP')}</p>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                                <div><span className="font-medium">Respect:</span> {assessment.respect}/5</div>
                                                <div><span className="font-medium">Participation:</span> {assessment.participation}/5</div>
                                                <div><span className="font-medium">Social Skills:</span> {assessment.socialSkills}/5</div>
                                                <div><span className="font-medium">Conduct:</span> {assessment.conduct}/5</div>
                                            </div>
                                            <p className="text-sm text-muted-foreground italic">"{assessment.comment}"</p>
                                        </div>
                                    )
                                })}
                             </div>
                         ) : <p className="text-sm text-muted-foreground">No behavioral assessments recorded for this term.</p>}
                    </div>

                    <div className="text-center text-xs text-muted-foreground pt-8 print:pt-4">
                        <p>--- End of Report ---</p>
                        <p>{schoolProfile?.name} | Generated on {format(new Date(), 'PPP')}</p>
                    </div>
                </div>

                <DialogFooter className="print:hidden">
                    <DialogClose asChild><Button type="button" variant="secondary">Close</Button></DialogClose>
                    <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
