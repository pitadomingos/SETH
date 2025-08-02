'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Rocket, Lightbulb, Layers, Target, CalendarClock, DollarSign, BrainCircuit, Users, ShieldCheck, Gem, TrendingUp, BookCopy, Award, Trophy, School, Baby, Briefcase, Smartphone, LineChart, Club, KeyRound, Server, UploadCloud, Database, GitBranch, Cloud, Download, Languages, MonitorPlay } from 'lucide-react';
import { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import Link from 'next/link';

export default function ProjectProposalPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== 'GlobalAdmin') {
      router.push('/dashboard');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'GlobalAdmin') {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <header className="text-center print:hidden">
        <h2 className="text-4xl font-bold tracking-tight text-primary">Project Proposal: EduDesk</h2>
        <p className="text-xl text-muted-foreground mt-2">A Catalyst for Educational Transformation in Southern Africa</p>
         <div className="mt-4 flex justify-center gap-4">
            <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            <Button asChild variant="outline">
              <Link href="/proposal-slides" target="_blank">
                <MonitorPlay className="mr-2 h-4 w-4" /> Present Slides
              </Link>
            </Button>
        </div>
      </header>

       <header className="text-center hidden print:block mb-8">
        <h2 className="text-4xl font-bold tracking-tight text-primary">Project Proposal: EduDesk</h2>
        <p className="text-xl text-muted-foreground mt-2">A Catalyst for Educational Transformation in Southern Africa</p>
      </header>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl"><Rocket /> Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <p>The landscape of education in Mozambique and the broader Southern African region is at a critical inflection point. While rich in potential, it faces significant challenges related to administrative efficiency, resource allocation, and data-driven decision-making. EduDesk is a comprehensive, multi-tenant SaaS platform engineered not just to manage schools, but to transform them. By integrating a suite of powerful, AI-driven tools into a single, accessible system, EduDesk will empower educators, engage parents, and provide administrators with the insights needed to elevate educational standards.</p>
            <p>Our prototype has successfully validated the core thesis: that a unified, intelligent platform can drastically reduce administrative overhead and unlock a new level of academic oversight. We are now seeking seed funding to transition from our robust prototype to a production-ready Firebase backend, enabling us to launch in Mozambique and subsequently scale across the SADC region. This investment will fuel a sustainable business model designed for long-term social impact, making modern educational tools accessible and affordable.</p>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb /> The Challenge & The Opportunity</CardTitle>
            <CardDescription>From Administrative Burden to Educational Focus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h3 className="font-semibold text-card-foreground">Current State: The Administrative Bottleneck</h3>
                <p className="text-sm text-muted-foreground mt-1">Many schools rely on manual, paper-based processes or a fragmented collection of outdated software. This results in critical data being siloed in disparate spreadsheets and physical files. Teachers spend valuable hours on administrative tasks instead of instructional planning, and school leaders lack the timely, aggregated data required for strategic decision-making. This inefficiency directly impacts the quality of education and hinders student progress.</p>
             </div>
             <div>
                <h3 className="font-semibold text-card-foreground">Our Solution: A Unified, Intelligent Ecosystem</h3>
                <p className="text-sm text-muted-foreground mt-1">EduDesk replaces this disconnected patchwork with a single, cloud-native platform. Our key differentiator is the deep integration of AI to not just manage data, but to provide actionable insights—from performance-aware lesson planning for teachers to strategic system-wide analysis for administrators. By automating administrative tasks and providing clear, visual data, we free up educators to do what they do best: teach.</p>
             </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp /> How EduDesk Elevates Standards</CardTitle>
            <CardDescription>Directly Addressing Key Educational Challenges</CardDescription>
          </CardHeader>
           <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <BrainCircuit className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Empowering Teachers with AI</h4>
                  <p className="text-muted-foreground">Instead of generic lesson plans, teachers can use our AI to generate plans tailored to their students' recent performance, ensuring no one is left behind. Ad-hoc tests can be created in minutes, not hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookCopy className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Enabling Data-Driven Leadership</h4>
                  <p className="text-muted-foreground">School administrators can move from guesswork to strategy. Our AI reports provide instant analysis of school-wide performance, class struggles, and teacher effectiveness, identifying areas for intervention and improvement.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Engaging Parents in Partnership</h4>
                  <p className="text-muted-foreground">The Parent Portal bridges the communication gap. Parents receive real-time updates on finances and can access AI-powered advice on how to support their child's specific academic needs, fostering a collaborative educational environment.</p>
                </div>
              </div>
           </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target /> Go-to-Market, Monetization & Partnerships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Sustainable Monetization Model</h3>
              <p className="text-sm text-muted-foreground">Our business model is a B2B SaaS subscription sold directly to educational institutions. We use a tiered, annual per-student pricing model, billed to the school in their local currency. This ensures predictable revenue for us and makes the platform accessible for institutions of all sizes. Schools have the flexibility to absorb this operational cost or incorporate it into their tuition structures.</p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-sm text-muted-foreground">
                  <li><span className="font-semibold">Starter:</span> Core management features for emerging schools.</li>
                  <li><span className="font-semibold text-primary">Pro:</span> Adds advanced AI tools for established institutions.</li>
                  <li><span className="font-semibold text-accent">Premium:</span> Multi-school management for districts and groups.</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Sales & Marketing Strategy</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                      <h4 className="font-semibold">Phased Regional Rollout</h4>
                      <p className="text-sm text-muted-foreground mt-1">Our initial launch will target independent and semi-private schools in Mozambique. Success here will create a proven case study for expansion into neighboring countries like South Africa, Zimbabwe, and Botswana, adapting to local curricula and needs.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Direct Sales & Pilot Programs</h4>
                      <p className="text-sm text-muted-foreground mt-1">An agile local sales team will conduct on-site demos and build relationships. We will offer a limited number of schools a free or heavily discounted pilot program in exchange for feedback and testimonials to use as powerful case studies.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Digital Marketing</h4>
                      <p className="text-sm text-muted-foreground mt-1">Launch targeted ad campaigns on platforms like LinkedIn and Facebook focusing on school administrators. Develop content marketing (blogs, whitepapers) around the benefits of EdTech to establish thought leadership.</p>
                  </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Partnership & Ecosystem Building</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                      <h4 className="font-semibold">Technology Partners</h4>
                      <p className="text-sm text-muted-foreground mt-1">Integrate with dominant regional mobile money providers (M-Pesa, eMola) and payment gateways to streamline fee collection. Partner with local hardware vendors to offer bundled deals on tablets.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Government & Associations</h4>
                      <p className="text-sm text-muted-foreground mt-1">Engage with Ministries of Education and Private School Associations to gain endorsements and access to a wider network of potential clients.</p>
                  </div>
                   <div>
                      <h4 className="font-semibold">Corporate Sponsorships</h4>
                      <p className="text-sm text-muted-foreground mt-1">Secure sponsorships for the "EduDesk Excellence Awards" from local and international companies looking to invest in the region's educational development, creating an additional revenue stream.</p>
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock /> Development Roadmap</CardTitle>
             <CardDescription>A clear timeline for moving from prototype to a scalable, production-ready application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">1</span>
              <div>
                <h4 className="font-semibold">Phase 1 (Q3 2025): Production Backend & Core Service</h4>
                <p className="text-sm text-muted-foreground">Transition from mock data to a full Firebase backend (Firestore, Auth, Storage). Refactor all services and establish robust security rules for a multi-tenant architecture.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">2</span>
              <div>
                <h4 className="font-semibold">Phase 2 (Q4 2025): Financial Integration & Automation</h4>
                <p className="text-sm text-muted-foreground">This phase focuses on creating a frictionless financial ecosystem. We will integrate with key regional payment providers including mobile money (M-Pesa, eMola, EcoCash) and traditional banking systems. This will enable automated invoicing, one-click fee payments from the Parent Portal, real-time payment tracking, and automated reminders for overdue fees, significantly reducing the administrative burden of collections.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">3</span>
              <div>
                <h4 className="font-semibold">Phase 3 (Q1 2026): Pilot Program & Market Launch</h4>
                <p className="text-sm text-muted-foreground">Launch a pilot program with a select group of schools in Mozambique to gather feedback and refine features. Initiate targeted marketing campaigns for a full market launch.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center print:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <GitBranch className="mr-2 h-4 w-4" /> View Firebase Integration Roadmap
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2"><Cloud /> Backend & Firebase Integration Roadmap</DialogTitle>
                      <DialogDescription>A step-by-step plan to transition to a full Firebase backend.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                        <div className="flex items-start gap-3">
                            <KeyRound className="h-5 w-5 text-accent mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">1. Firebase Authentication</h4>
                                <p className="text-sm text-muted-foreground">Replace the mock login system with Firebase Authentication. Implement email/password sign-up and sign-in, and manage user sessions and roles securely.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Server className="h-5 w-5 text-accent mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">2. Firestore Database & Data Modeling</h4>
                                <p className="text-sm text-muted-foreground">Design and create Firestore collections for schools, users, students, grades, etc. Structure the data for efficient queries and scalability, replacing the <code>mock-data.ts</code> file.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <UploadCloud className="h-5 w-5 text-accent mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">3. Cloud Storage & API Layer</h4>
                                <p className="text-sm text-muted-foreground">Implement Firebase Storage for file uploads (e.g., logos, expense receipts). Create a set of server-side functions (e.g., Server Actions) to handle all Create, Read, Update, and Delete (CRUD) operations with Firestore and Storage, governed by security rules.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Database className="h-5 w-5 text-accent mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">4. Data Fetching & Mutation</h4>
                                <p className="text-sm text-muted-foreground">Update the <code>SchoolDataProvider</code> to fetch data from the new API layer instead of local mock data. Wire up all forms and actions (e.g., adding a student, uploading a logo) to call the API for persistent changes.</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button type="button">Close</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Layers /> Continuous Improvement: Seasonal Updates</CardTitle>
                <CardDescription>Beyond the core roadmap, we are committed to continuous innovation through regular seasonal updates.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
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
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase /> The Future Vision: A Lifelong Learning Ecosystem</CardTitle>
            <CardDescription>From the first day of pre-school to university graduation and beyond.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Our ultimate vision extends beyond the K-12 classroom. We aim to create a cohesive, three-part ecosystem that supports a student's entire educational journey. While the Pre-School and University modules will be developed as distinct, specialized applications due to their unique complexities, they will be built on a shared data philosophy.</p>
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
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign /> Funding Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
              <p>We are seeking $500,000 in seed funding. This capital will be strategically allocated to accelerate development, establish a local presence for sales and support, and ensure a successful market entry.</p>
              <ul className="list-disc pl-5 mt-2">
                  <li><span className="font-semibold">40%</span> - Engineering & Product Development (Firebase migration, mobile optimization)</li>
                  <li><span className="font-semibold">35%</span> - Sales & Marketing (Establish local team, build partnerships)</li>
                  <li><span className="font-semibold">15%</span> - Cloud Infrastructure & Operations</li>
                  <li><span className="font-semibold">10%</span> - Administrative & Contingency</li>
              </ul>
          </CardContent>
        </Card>
    </div>
  );
}
