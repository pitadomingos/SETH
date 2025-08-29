'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, BookCopy, Users, Rocket, Lightbulb, Trophy } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="container py-12 md:py-24 lg:py-32 space-y-12">
            <section className="text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">About EduDesk</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                    Our mission is to empower educational institutions with the tools they need to thrive in a digital world.
                </p>
            </section>
            
            <section>
                 <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl"><Rocket /> Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>The landscape of education in Mozambique and the broader Southern African region is at a critical inflection point. While rich in potential, it faces significant challenges related to administrative efficiency, resource allocation, and data-driven decision-making. EduDesk is a comprehensive, multi-tenant SaaS platform engineered not just to manage schools, but to transform them. By integrating a suite of powerful, AI-driven tools into a single, accessible system, EduDesk will empower educators, engage parents, and provide administrators with the insights needed to elevate educational standards.</p>
                        <p>Our prototype has successfully validated the core thesis: that a unified, intelligent platform can drastically reduce administrative overhead and unlock a new level of academic oversight. We are now seeking seed funding to transition from our robust prototype to a production-ready Firebase backend, enabling us to launch in Mozambique and subsequently scale across the SADC region. This investment will fuel a sustainable business model designed for long-term social impact, making modern educational tools accessible and affordable.</p>
                    </CardContent>
                </Card>
            </section>

             <section className="grid gap-8 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb /> The Challenge</CardTitle>
                    <CardDescription>From Administrative Burden to Educational Focus</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">Many schools rely on manual, paper-based processes or a fragmented collection of outdated software. This results in critical data being siloed in disparate spreadsheets and physical files. Teachers spend valuable hours on administrative tasks instead of instructional planning, and school leaders lack the timely, aggregated data required for strategic decision-making. This inefficiency directly impacts the quality of education and hinders student progress.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> The Opportunity</CardTitle>
                    <CardDescription>How EduDesk Elevates Standards</CardDescription>
                  </CardHeader>
                   <CardContent className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <BrainCircuit className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                          <h4 className="font-semibold">Empowering Teachers with AI</h4>
                          <p className="text-muted-foreground">Instead of generic lesson plans, teachers can use our AI to generate plans tailored to their students' recent performance.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BookCopy className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                          <h4 className="font-semibold">Enabling Data-Driven Leadership</h4>
                          <p className="text-muted-foreground">AI reports provide instant analysis of school-wide performance, class struggles, and teacher effectiveness.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                          <h4 className="font-semibold">Engaging Parents in Partnership</h4>
                          <p className="text-muted-foreground">The Parent Portal bridges the communication gap with real-time updates on finances and AI-powered advice.</p>
                        </div>
                      </div>
                   </CardContent>
                </Card>
             </section>

             <section>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Trophy /> Motivation & Recognition: The EduDesk Awards</CardTitle>
                        <CardDescription>Fostering a Culture of Excellence</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">To further drive engagement and celebrate success, we will establish the annual **EduDesk Excellence Awards**. These awards will recognize top-performing schools, teachers, and students across the network, based on data-driven metrics pulled from the platform. The system owner can configure prizes and announce the winners from a dedicated page in their dashboard.</p>
                        <p className="text-muted-foreground">This initiative creates a positive feedback loop, encouraging healthy competition and a focus on improvement. It also opens up a valuable revenue stream through **corporate sponsorships**, allowing local and international brands to align themselves with educational excellence in the region.</p>
                    </CardContent>
                </Card>
             </section>
        </div>
    );
}
