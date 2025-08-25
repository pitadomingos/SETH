

'use client';
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Rocket, Lightbulb, Layers, Target, CalendarClock, DollarSign, BrainCircuit, Users, ShieldCheck, Gem, TrendingUp, BookCopy, Award, Trophy, School, Baby, Briefcase, Smartphone, LineChart, Club, KeyRound, Server, UploadCloud, Database, GitBranch, Cloud, Download, Languages, MonitorPlay, Maximize, Minimize } from 'lucide-react';
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
        <p className="text-3xl mt-8 text-muted-foreground leading-relaxed">
          EduDesk is a comprehensive, AI-powered SaaS platform engineered to transform schools in Southern Africa by unifying administrative tasks, providing data-driven insights, and fostering collaboration between educators, parents, and administrators to elevate educational standards.
        </p>
      </div>
    ),
    bg: 'bg-background',
  },
  // Slide 3: The Challenge & Opportunity
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold flex items-center gap-4"><Lightbulb className="text-primary"/> The Challenge & Opportunity</h2>
        <div className="grid grid-cols-2 gap-12 mt-12 text-2xl leading-relaxed text-muted-foreground">
          <div><h3 className="font-semibold text-3xl text-foreground mb-4">The Challenge</h3><p>Schools rely on manual, fragmented systems, leading to administrative bottlenecks, wasted teacher time, and a lack of strategic insight, directly impacting educational quality.</p></div>
          <div><h3 className="font-semibold text-3xl text-foreground mb-4">The Opportunity</h3><p>To replace this patchwork with a single, intelligent platform that automates tasks and uses AI to provide actionable insights, freeing educators to focus on teaching.</p></div>
        </div>
      </div>
    ),
    bg: 'bg-muted/30',
  },
  // Slide 4: How EduDesk Elevates Standards
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold text-center mb-16">How EduDesk Elevates Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center"><BrainCircuit className="h-20 w-20 mx-auto text-primary"/><h3 className="text-3xl font-semibold mt-4">Empowering Teachers</h3><p className="text-xl text-muted-foreground mt-2">AI-powered lesson planning and test generation tailored to student performance.</p></div>
            <div className="text-center"><BookCopy className="h-20 w-20 mx-auto text-primary"/><h3 className="text-3xl font-semibold mt-4">Enabling Leaders</h3><p className="text-xl text-muted-foreground mt-2">Instant AI analysis of school-wide data for strategic decision-making.</p></div>
            <div className="text-center"><Users className="h-20 w-20 mx-auto text-primary"/><h3 className="text-3xl font-semibold mt-4">Engaging Parents</h3><p className="text-xl text-muted-foreground mt-2">A unified portal with real-time updates and AI-powered academic advice.</p></div>
        </div>
      </div>
    ),
    bg: 'bg-background',
  },
  // Slide 5: Monetization & GTM
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold flex items-center gap-4"><Target className="text-primary"/> Go-to-Market & Monetization</h2>
        <div className="grid grid-cols-2 gap-12 mt-12 text-2xl">
          <div><h3 className="font-semibold text-3xl text-foreground mb-4">Tiered SaaS Model</h3><p className="text-muted-foreground">Annual per-student billing with Starter, Pro (AI tools), and Premium (Multi-School) tiers to ensure affordability and predictable revenue.</p></div>
          <div><h3 className="font-semibold text-3xl text-foreground mb-4">Phased Regional Rollout</h3><p className="text-muted-foreground">Launch in Mozambique with pilot programs, then expand to neighboring SADC countries, leveraging case studies and local partnerships.</p></div>
        </div>
      </div>
    ),
    bg: 'bg-muted/30',
  },
  // Slide 6: The EduDesk Awards
  {
    content: (
      <div className="p-16 w-full max-w-5xl text-center">
        <h2 className="text-6xl font-bold flex items-center justify-center gap-4"><Trophy className="text-primary"/> The EduDesk Awards</h2>
        <p className="text-3xl mt-8 text-muted-foreground leading-relaxed max-w-4xl mx-auto">
          An annual, data-driven awards program to recognize top-performing schools, teachers, and students, fostering a culture of excellence and opening a valuable revenue stream through corporate sponsorships.
        </p>
      </div>
    ),
    bg: 'bg-background',
  },
  // Slide 7: Development Roadmap
  {
    content: (
      <div className="p-16 w-full max-w-6xl">
        <h2 className="text-6xl font-bold flex items-center gap-4"><CalendarClock className="text-primary"/> Development Roadmap</h2>
        <div className="mt-12 space-y-10">
            <div className="flex items-start gap-6"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">1</span><div><h3 className="text-3xl font-semibold">Phase 1 (Completed): Production Backend</h3><p className="text-xl text-muted-foreground mt-1">Full transition to a live Firebase backend (Firestore, Auth, Storage) with persistent data and security rules.</p></div></div>
            <div className="flex items-start gap-6"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">2</span><div><h3 className="text-3xl font-semibold">Phase 2 (Q4 2025): Financial Integration</h3><p className="text-xl text-muted-foreground mt-1">Integrate with regional mobile money providers (M-Pesa, eMola) to enable automated invoicing and fee payments.</p></div></div>
            <div className="flex items-start gap-6"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">3</span><div><h3 className="text-3xl font-semibold">Phase 3 (Q1 2026): Pilot Program & Launch</h3><p className="text-xl text-muted-foreground mt-1">Launch pilot program with select schools in Mozambique, gather feedback, and initiate full market launch.</p></div></div>
        </div>
      </div>
    ),
    bg: 'bg-muted/30',
  },
  // Slide 8: Continuous Improvement
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
  // Slide 9: The Future Vision
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
  // Slide 10: Funding Request
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
   // Slide 11: Thank You
  {
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <motion.h1 className="text-8xl font-bold tracking-tight" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>Thank You</motion.h1>
        <motion.p className="text-4xl text-muted-foreground mt-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>Questions?</motion.p>
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
  }, []);

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
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="flex gap-2 p-2 bg-muted/50 rounded-full">
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
