
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Baby, Briefcase, Club, Languages, LineChart, School, Smartphone, Target, Users } from 'lucide-react';

export default function VisionPage() {
    return (
        <div className="container py-12 md:py-24 lg:py-32 space-y-12">
            <section className="text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Vision</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                    Building a lifelong learning ecosystem for the next generation of leaders.
                </p>
            </section>

             <section>
                <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase /> The Future Vision: A Lifelong Learning Ecosystem</CardTitle>
                    <CardDescription>From the first day of pre-school to university graduation and beyond.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Our ultimate vision extends beyond the K-12 classroom. We aim to create a cohesive, three-part ecosystem that supports a student's entire educational journey. This includes specialized modules for Pre-School and University, which will eventually be integrated with higher-level oversight for District, Provincial, and National educational bodies. This will provide unprecedented insights for macro-level decision-making.</p>
                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                        <Baby className="h-10 w-10 text-primary mb-3"/>
                        <h4 className="font-semibold">EduDesk Pre-School</h4>
                        <p className="text-sm text-muted-foreground mt-1">Focusing on developmental milestones, play-based learning, and parent communication, creating the foundational data points for a child's educational profile.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/10 border border-primary/20 shadow-inner">
                        <School className="h-10 w-10 text-primary mb-3"/>
                        <h4 className="font-semibold">EduDesk K-12 (Core)</h4>
                        <p className="text-sm text-muted-foreground mt-1">Our current platform, perfecting the management of curriculum-based education, assessments, and school operations, building a rich academic history.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                        <Briefcase className="h-10 w-10 text-primary mb-3"/>
                        <h4 className="font-semibold">EduDesk University & Careers</h4>
                        <p className="text-sm text-muted-foreground mt-1">A specialized module for higher education that also bridges the gap to employment. Upon student consent, employers and recruitment agents can gain temporary, verified access to academic records, helping them connect with the right talent.</p>
                    </div>
                    </div>
                    <p className="text-muted-foreground mt-6">This interconnected system will provide unprecedented insights, allowing educators to track progress, advisors to offer personalized guidance, and employers to connect with qualified talent. This is not just school management; it is lifetime learning and career management.</p>
                </CardContent>
                </Card>
             </section>

            <section>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Continuous Improvement: Seasonal Updates</CardTitle>
                        <CardDescription>Beyond the core roadmap, we are committed to continuous innovation through regular seasonal updates.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <Smartphone className="h-5 w-5 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Native Mobile Apps</h4>
                                <p className="text-sm text-muted-foreground">Dedicated iOS and Android applications for parents and students to enhance accessibility and engagement.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <LineChart className="h-5 w-5 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Predictive Analytics</h4>
                                <p className="text-sm text-muted-foreground">Tools to predict student dropout risks or identify opportunities for academic intervention based on historical data.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Target className="h-5 w-5 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Goal Setting</h4>
                                <p className="text-sm text-muted-foreground">Collaborative tools for students and parents to set, track, and manage academic and personal development goals.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Club className="h-5 w-5 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Extracurricular Management</h4>
                                <p className="text-sm text-muted-foreground">A dedicated module for managing non-academic activities, clubs, and sports teams with scheduling and communication tools.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Languages className="h-5 w-5 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Internationalization (i18n)</h4>
                                <p className="text-sm text-muted-foreground">Full support for multiple languages, starting with English and Portuguese, to cater to the diverse linguistic landscape of the region.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Expanded Role-Based Access Control</h4>
                                <p className="text-sm text-muted-foreground">Introduce more granular roles like Academic Dean, Counselor, and Finance Officer to better reflect real-world school operations and delegate responsibilities effectively.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
