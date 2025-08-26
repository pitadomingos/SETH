
'use client';
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Rocket, Lightbulb, Layers, Target, CalendarClock, DollarSign, BrainCircuit, Users, ShieldCheck, Gem, TrendingUp, BookCopy, Award, Trophy, School, Baby, Briefcase, Smartphone, LineChart, Club, KeyRound, Server, UploadCloud, Database, GitBranch, Cloud, Download, Languages, MonitorPlay, Maximize, Minimize, GraduationCap, CloudCog, Mail, FileText, LifeBuoy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const slides = [
  // Slide 1: Title
  {
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: 'spring' }}>
          <GraduationCap className="h-32 w-32 text-primary" />
        </motion.div>
        <motion.h1 className="text-8xl font-bold tracking-tight mt-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>EduDesk</motion.h1>
        <motion.p className="text-4xl text-muted-foreground mt-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>A Catalyst for Educational Transformation</motion.p>
      </div>
    ),
    bg: 'bg-background',
  },
  // Slide 2: Executive Summary
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold flex items-center gap-4"><Rocket className="text-primary"/> Executive Summary</h2>
        <div className="text-3xl mt-8 text-muted-foreground leading-relaxed space-y-8">
            <p>The landscape of education in Mozambique and the broader Southern African region is at a critical inflection point. While rich in potential, it faces significant challenges related to administrative efficiency, resource allocation, and data-driven decision-making. EduDesk is a comprehensive, multi-tenant SaaS platform engineered not just to manage schools, but to transform them. By integrating a suite of powerful, AI-driven tools into a single, accessible system, EduDesk will empower educators, engage parents, and provide administrators with the insights needed to elevate educational standards.</p>
            <p>Our prototype has successfully validated the core thesis: that a unified, intelligent platform can drastically reduce administrative overhead and unlock a new level of academic oversight. We are now seeking seed funding to transition from our robust prototype to a production-ready Firebase backend, enabling us to launch in Mozambique and subsequently scale across the SADC region. This investment will fuel a sustainable business model designed for long-term social impact, making modern educational tools accessible and affordable.</p>
        </div>
      </div>
    ),
    bg: 'bg-muted/30',
  },
  // Slide 3: The Challenge & The Opportunity
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold flex items-center gap-4"><Lightbulb className="text-primary"/> The Challenge & The Opportunity</h2>
        <div className="grid grid-cols-2 gap-12 mt-12 text-2xl leading-relaxed">
          <div><h3 className="font-semibold text-3xl text-foreground mb-4">Current State: The Administrative Bottleneck</h3><p className="text-muted-foreground">Many schools rely on manual, paper-based processes or a fragmented collection of outdated software. This results in critical data being siloed in disparate spreadsheets and physical files. Teachers spend valuable hours on administrative tasks instead of instructional planning, and school leaders lack the timely, aggregated data required for strategic decision-making. This inefficiency directly impacts the quality of education and hinders student progress.</p></div>
          <div><h3 className="font-semibold text-3xl text-foreground mb-4">Our Solution: A Unified, Intelligent Ecosystem</h3><p className="text-muted-foreground">EduDesk replaces this disconnected patchwork with a single, cloud-native platform. Our key differentiator is the deep integration of AI to not just manage data, but to provide actionable insights—from performance-aware lesson planning for teachers to strategic system-wide analysis for administrators. By automating administrative tasks and providing clear, visual data, we free up educators to do what they do best: teach.</p></div>
        </div>
      </div>
    ),
    bg: 'bg-background',
  },
  // Slide 4: How EduDesk Elevates Standards
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold text-center mb-16">How EduDesk Elevates Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center"><BrainCircuit className="h-20 w-20 mx-auto text-primary"/><h3 className="text-3xl font-semibold mt-4">Empowering Teachers with AI</h3><p className="text-xl text-muted-foreground mt-2">Instead of generic lesson plans, teachers can use our AI to generate plans tailored to their students' recent performance, ensuring no one is left behind. Ad-hoc tests can be created in minutes, not hours.</p></div>
            <div className="text-center"><BookCopy className="h-20 w-20 mx-auto text-primary"/><h3 className="text-3xl font-semibold mt-4">Enabling Data-Driven Leadership</h3><p className="text-xl text-muted-foreground mt-2">School administrators can move from guesswork to strategy. Our AI reports provide instant analysis of school-wide performance, class struggles, and teacher effectiveness, identifying areas for intervention and improvement.</p></div>
            <div className="text-center"><Users className="h-20 w-20 mx-auto text-primary"/><h3 className="text-3xl font-semibold mt-4">Engaging Parents in Partnership</h3><p className="text-xl text-muted-foreground mt-2">The Parent Portal bridges the communication gap. Parents receive real-time updates on finances and can access AI-powered advice on how to support their child's specific academic needs, fostering a collaborative educational environment.</p></div>
        </div>
      </div>
    ),
    bg: 'bg-muted/30',
  },
  // Slide 5: Go-to-Market, Monetization & Partnerships
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold flex items-center gap-4 mb-12"><Target className="text-primary"/> Go-to-Market, Monetization & Partnerships</h2>
        <div className="space-y-8 text-xl">
            <div><h3 className="font-semibold text-3xl text-foreground mb-2">Sustainable Monetization Model</h3><p className="text-muted-foreground">Our business model is a B2B SaaS subscription sold directly to educational institutions. We use a tiered, annual per-student pricing model, billed to the school in their local currency. This ensures predictable revenue for us and makes the platform accessible for institutions of all sizes.</p></div>
            <div><h3 className="font-semibold text-3xl text-foreground mb-2">Sales & Marketing Strategy</h3><p className="text-muted-foreground">Our strategy involves a phased regional rollout starting in Mozambique, direct sales with pilot programs for early adopters, and targeted digital marketing campaigns to establish thought leadership.</p></div>
            <div><h3 className="font-semibold text-3xl text-foreground mb-2">Partnership & Ecosystem Building</h3><p className="text-muted-foreground">We will build an ecosystem by integrating with local mobile money providers, partnering with hardware vendors, and engaging with Ministries of Education and Private School Associations to gain endorsements.</p></div>
        </div>
      </div>
    ),
    bg: 'bg-background',
  },
  // Slide 6: The EduDesk Awards
  {
    content: (
      <div className="p-16 w-full max-w-5xl text-center">
        <h2 className="text-6xl font-bold flex items-center justify-center gap-4"><Trophy className="text-primary"/> The EduDesk Awards</h2>
        <p className="text-3xl mt-8 text-muted-foreground leading-relaxed max-w-4xl mx-auto">
          To further drive engagement and celebrate success, we will establish the annual EduDesk Excellence Awards. These awards will recognize top-performing schools, teachers, and students across the network, based on data-driven metrics pulled from the platform. This initiative creates a positive feedback loop and opens up a valuable revenue stream through corporate sponsorships.
        </p>
      </div>
    ),
    bg: 'bg-muted/30',
  },
  // Slide 7: Development Roadmap
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold flex items-center gap-4"><CalendarClock className="text-primary"/> Development Roadmap</h2>
        <div className="mt-12 space-y-10">
            <div className="flex items-start gap-6"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">1</span><div><h3 className="text-3xl font-semibold">Phase 1 (Completed): Production Backend & Core Services</h3><p className="text-xl text-muted-foreground mt-1">Transition from mock data to a full Firebase backend (Firestore, Auth, Storage) is complete. All core CRUD operations are persistent and governed by security rules.</p></div></div>
            <div className="flex items-start gap-6"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">2</span><div><h3 className="text-3xl font-semibold">Phase 2 (Q4 2025): Financial Integration & Automation</h3><p className="text-xl text-muted-foreground mt-1">This phase focuses on creating a frictionless financial ecosystem. We will integrate with key regional payment providers including mobile money (M-Pesa, eMola, EcoCash) and traditional banking systems. This will enable automated invoicing, one-click fee payments, and automated reminders for overdue fees.</p></div></div>
            <div className="flex items-start gap-6"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">3</span><div><h3 className="text-3xl font-semibold">Phase 3 (Q1 2026): Pilot Program & Market Launch</h3><p className="text-xl text-muted-foreground mt-1">Launch a pilot program with a select group of schools in Mozambique to gather feedback and refine features. Initiate targeted marketing campaigns for a full market launch.</p></div></div>
        </div>
      </div>
    ),
    bg: 'bg-background',
  },
  // Slide 8: From Prototype to Production
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold flex items-center gap-4 mb-12"><CloudCog className="text-primary"/> From Prototype to Production</h2>
        <div className="space-y-8 text-2xl">
            <div className="flex items-start gap-4"><UploadCloud className="h-8 w-8 text-accent mt-1 shrink-0" /><p><span className="font-semibold text-foreground">Firebase Storage Integration:</span> Implement for all file uploads (logos, documents, media).</p></div>
            <div className="flex items-start gap-4"><Mail className="h-8 w-8 text-accent mt-1 shrink-0" /><p><span className="font-semibold text-foreground">Email Service Integration:</span> Replace console simulations with a real email service (e.g., SendGrid) for notifications.</p></div>
            <div className="flex items-start gap-4"><FileText className="h-8 w-8 text-accent mt-1 shrink-0" /><p><span className="font-semibold text-foreground">PDF Generation Service:</span> Develop a server-side service for creating branded certificates and transcripts.</p></div>
            <div className="flex items-start gap-4"><Users className="h-8 w-8 text-accent mt-1 shrink-0" /><p><span className="font-semibold text-foreground">Notification System:</span> Build a scalable notification system with read/unread status to replace activity log notifications.</p></div>
        </div>
      </div>
    ),
    bg: 'bg-muted/30',
  },
  // Slide 9: Continuous Improvement
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold text-center mb-16">Continuous Improvement: Seasonal Updates</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 text-xl text-center">
          <div className="flex flex-col items-center"><Smartphone className="h-12 w-12 text-primary"/><p className="mt-2 font-semibold">Native Mobile Apps</p></div>
          <div className="flex flex-col items-center"><LineChart className="h-12 w-12 text-primary"/><p className="mt-2 font-semibold">Predictive Analytics</p></div>
          <div className="flex flex-col items-center"><Target className="h-12 w-12 text-primary"/><p className="mt-2 font-semibold">Student Goal Setting</p></div>
          <div className="flex flex-col items-center"><Club className="h-12 w-12 text-primary"/><p className="mt-2 font-semibold">Extracurricular Management</p></div>
          <div className="flex flex-col items-center"><Languages className="h-12 w-12 text-primary"/><p className="mt-2 font-semibold">Multi-Language Support</p></div>
          <div className="flex flex-col items-center"><Users className="h-12 w-12 text-primary"/><p className="mt-2 font-semibold">Expanded Roles (Dean, Counselor)</p></div>
        </div>
      </div>
    ),
    bg: 'bg-background',
  },
  // Slide 10: The Future Vision
  {
    content: (
      <div className="p-16 w-full max-w-6xl text-center">
        <h2 className="text-6xl font-bold flex items-center justify-center gap-4"><Briefcase className="text-primary"/> The Future Vision</h2>
        <p className="text-3xl mt-8 text-muted-foreground leading-relaxed max-w-5xl mx-auto">
          To build a cohesive, lifelong learning ecosystem from pre-school to university, creating a verified talent pipeline that connects graduates with career opportunities.
        </p>
        <div className="grid grid-cols-3 gap-8 mt-12 text-2xl">
          <div className="flex flex-col items-center p-4 rounded-lg"><Baby className="h-16 w-16 text-primary mb-3"/><h4 className="font-semibold">EduDesk Pre-School</h4></div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-primary/10 border-2 border-primary"><School className="h-16 w-16 text-primary mb-3"/><h4 className="font-semibold">EduDesk K-12 (Core)</h4></div>
          <div className="flex flex-col items-center p-4 rounded-lg"><Briefcase className="h-16 w-16 text-primary mb-3"/><h4 className="font-semibold">EduDesk University & Careers</h4></div>
        </div>
      </div>
    ),
    bg: 'bg-muted/30',
  },
  // Slide 11: Funding Request
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold flex items-center gap-4"><DollarSign className="text-primary"/> Funding Request</h2>
        <p className="text-9xl font-bold text-primary mt-12">$500,000</p>
        <p className="text-3xl mt-4 text-muted-foreground leading-relaxed">
          Seed funding to accelerate development, establish local presence, and ensure a successful market entry.
        </p>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mt-12 text-3xl">
          <div><span className="font-bold">40%</span> - Engineering & Product</div>
          <div><span className="font-bold">35%</span> - Sales & Marketing</div>
          <div><span className="font-bold">15%</span> - Cloud Infrastructure</div>
          <div><span className="font-bold">10%</span> - Administrative</div>
        </div>
      </div>
    ),
    bg: 'bg-background',
  },
];

export default function ProposalSlidesPage() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setPage((prevPage) => (prevPage + newDirection + slides.length) % slides.length);
  };

  const slideIndex = page % slides.length;
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'f') toggleFullScreen();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paginate]);

  return (
    <div className="relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden bg-background">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className={`absolute w-full h-full flex items-center justify-center ${slides[slideIndex].bg}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          {slides[slideIndex].content}
        </motion.div>
      </AnimatePresence>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-16 w-16 rounded-full bg-background/30 hover:bg-background/70"
        onClick={(e) => { e.stopPropagation(); paginate(-1); }}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-16 w-16 rounded-full bg-background/30 hover:bg-background/70"
        onClick={(e) => { e.stopPropagation(); paginate(1); }}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="flex gap-2 p-2 bg-muted/50 rounded-full backdrop-blur-sm">
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setPage(i); }}
                className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${i === slideIndex ? 'bg-primary' : 'bg-muted-foreground/50'}`}
              />
            ))}
          </div>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-50 rounded-full h-12 w-12 bg-background/50 backdrop-blur-sm"
        onClick={(e) => {e.stopPropagation(); toggleFullScreen();}}
        aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
      >
        {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
      </Button>
    </div>
  );
}
