'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, PenSquare, GraduationCap, HeartHandshake, Globe, Award } from 'lucide-react';

export default function UserManualPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">User Manual</h2>
        <p className="text-muted-foreground">Guides for each user role on how to use EduManage. The application is designed to be fully responsive on desktops, tablets, and mobile devices.</p>
      </header>

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="global-admin">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">Global Administrator Guide</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-muted-foreground">
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Global Dashboard:</strong> Get a high-level overview of all schools in the system.</li>
                  <li><strong>School Management:</strong> View key statistics for each school and access their individual management dashboards (simulation).</li>
                  <li><strong>System Documentation:</strong> Access technical documentation about the application's architecture and technology stack.</li>
                  <li><strong>To-Do List:</strong> View the project's development progress and upcoming features.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="admin">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">School Administrator Guide</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-muted-foreground">
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Dashboard:</strong> Get a high-level overview of your school's statistics, including student counts, financial summaries, and performance charts.</li>
                  <li><strong>School Profile:</strong> View your school's core information like name, address, and contact details.</li>
                  <li><strong>User Management:</strong> View student and teacher profiles via the Students and Teachers pages.</li>
                  <li><strong>Finance:</strong> Track school-wide revenue and expenses. Record partial or full payments for student fees and create new ad-hoc fee transactions (e.g., for lab fees or field trips).</li>
                  <li><strong>Admissions, Academics, etc:</strong> Manage all core school functions from their respective pages in the sidebar.</li>
                  <li><strong>Leaderboards:</strong> View top student rankings across the school by overall GPA, class, and subject.</li>
                  <li><strong>Admin Panel:</strong> Manage system-wide data, such as adding new Examination Boards.</li>
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
                  <li><strong>Dashboard:</strong> Quickly access common actions, view your courses, see upcoming deadlines, and analyze grade distributions.</li>
                  <li><strong>AI Lesson Planner:</strong> Use the AI-powered tool to automatically generate detailed lesson plans.</li>
                  <li><strong>Schedules:</strong> View your teaching schedule and assigned courses.</li>
                  <li><strong>Leaderboards:</strong> Check academic rankings to see how students are performing overall, within classes, and by subject.</li>
                  <li><strong>Profile:</strong> View your personal information.</li>
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
                  <li><strong>Dashboard:</strong> See a summary of your academic progress, upcoming assignments, recent grades, and your current school rank.</li>
                  <li><strong>Schedules:</strong> Check your course schedule, see your teachers, and track your progress in each class.</li>
                  <li><strong>Leaderboards:</strong> See where you rank among your peers in overall, class, and subject-specific leaderboards.</li>
                  <li><strong>Events:</strong> Stay up-to-date with important school events and holidays.</li>
                  <li><strong>Profile:</strong> View your personal details.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="parent">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <HeartHandshake className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">Parent Guide</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-muted-foreground">
                 <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Dashboard:</strong> Get a complete overview of your children's school life. Click on a child's card to update the dashboard with their specific information.</li>
                  <li><strong>AI-Powered Insights:</strong> Receive AI-generated advice on how to support your selected child's learning, including their strengths and areas for improvement.</li>
                  <li><strong>Finance Portal:</strong> View detailed fee information for each child, including total amount, amount paid, and outstanding balance.</li>
                  <li><strong>Leaderboards:</strong> View a personalized report of your children's academic rankings in their school, class, and subjects.</li>
                  <li><strong>Events:</strong> Keep track of important school events, with clear labels for which school an event belongs to.</li>
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
