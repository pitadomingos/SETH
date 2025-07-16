
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, BookCopy, ChevronRight, CheckCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSchoolData } from '@/context/school-data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SyllabusPage() {
  const { role, isLoading: authLoading } = useAuth();
  const { syllabi, subjects } = useSchoolData();
  const router = useRouter();

  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    if (!authLoading && role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  const filteredSyllabi = useMemo(() => {
    if (!selectedSubject) return [];
    return syllabi
      .filter(s => s.subject === selectedSubject)
      .sort((a, b) => parseInt(a.grade) - parseInt(b.grade));
  }, [syllabi, selectedSubject]);

  if (authLoading || role !== 'Admin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Curriculum Syllabus</h2>
        <p className="text-muted-foreground">
          View the academic syllabus for each subject and grade level.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>View Syllabus</CardTitle>
          <CardDescription>Select a subject to see its curriculum topics week by week.</CardDescription>
          <div className="pt-4">
            <Select onValueChange={setSelectedSubject} value={selectedSubject}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a subject..." />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedSubject ? (
            filteredSyllabi.length > 0 ? (
              <Accordion type="multiple" className="w-full space-y-4">
                {filteredSyllabi.map(syllabus => (
                  <Card key={`${syllabus.subject}-${syllabus.grade}`} className="overflow-hidden">
                    <AccordionItem value={`grade-${syllabus.grade}`} className="border-b-0">
                      <AccordionTrigger className="bg-muted px-4 py-3">
                        <div className="flex items-center gap-3">
                            <BookCopy className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-lg">Grade {syllabus.grade}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4">
                        <ul className="space-y-4">
                          {syllabus.topics.sort((a, b) => a.week - b.week).map(topic => (
                            <li key={topic.id} className="p-3 border rounded-md">
                              <p className="font-semibold">Week {topic.week}: {topic.topic}</p>
                              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                                {topic.subtopics.map((subtopic, index) => (
                                  <li key={index}>{subtopic}</li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-muted-foreground py-10">No syllabus found for {selectedSubject}.</p>
            )
          ) : (
            <p className="text-center text-muted-foreground py-10">Please select a subject to view its syllabus.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
