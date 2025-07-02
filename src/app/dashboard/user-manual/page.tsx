
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, PenSquare, GraduationCap } from 'lucide-react';

export default function UserManualPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">User Manual</h2>
        <p className="text-muted-foreground">Guides for each user role on how to use EduManage.</p>
      </header>

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="admin">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">Administrator Guide</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-muted-foreground">
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Dashboard:</strong> Get a high-level overview of school statistics, including student, teacher, and class counts.</li>
                  <li><strong>User Management:</strong> Add, view, and manage student and teacher profiles via the Students and Teachers pages.</li>
                  <li><strong>Class Management:</strong> Create new classes, assign teachers, and manage student enrollments.</li>
                  <li><strong>System-wide Management:</strong> Oversee all school functions including admissions, academics, finance, and events.</li>
                  <li><strong>Settings:</strong> Configure system-level settings and preferences.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="teacher">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <PenSquare className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">Teacher Guide</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-muted-foreground">
                <ul className="list-disc space-y-2 pl-6">
                   <li><strong>Dashboard:</strong> Quickly access common actions like creating lesson plans and viewing your courses.</li>
                  <li><strong>AI Lesson Planner:</strong> Use the AI-powered tool to automatically generate detailed lesson plans based on a topic and grade level.</li>
                  <li><strong>Schedules:</strong> View your teaching schedule and the courses you are assigned to.</li>
                  <li><strong>Profile:</strong> Update your personal information.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="student">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">Student Guide</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-muted-foreground">
                 <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Dashboard:</strong> See a summary of your academic progress, including enrolled courses and GPA.</li>
                  <li><strong>Schedules:</strong> Check your course schedule, see your teachers, and track your progress in each class.</li>
                  <li><strong>Events:</strong> Stay up-to-date with important school events and holidays.</li>
                  <li><strong>Profile:</strong> View your personal details.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
