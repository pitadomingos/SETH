'use client';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Rocket, GraduationCap, Lightbulb, Users, Layers, Trophy, TrendingUp, CalendarClock, DollarSign, Briefcase } from 'lucide-react';

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
  // --- Slide 1: Title ---
  {
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <GraduationCap className="h-24 w-24 text-primary" />
        </motion.div>
        <motion.h1 
            className="text-7xl font-bold tracking-tight mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
          EduDesk
        </motion.h1>
        <motion.p 
            className="text-3xl text-muted-foreground mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
          A Catalyst for Educational Transformation
        </motion.p>
      </div>
    ),
    bg: 'bg-background',
  },
  // --- Slide 2: Executive Summary ---
  {
    content: (
      <div className="p-12 w-full max-w-5xl">
        <h2 className="text-5xl font-bold flex items-center gap-4"><Rocket className="text-primary"/> Executive Summary</h2>
        <p className="text-2xl mt-8 text-muted-foreground leading-relaxed">
          EduDesk is a comprehensive, multi-tenant SaaS platform engineered to transform schools in Southern Africa. By integrating powerful, AI-driven tools into a single, accessible system, EduDesk empowers educators, engages parents, and provides administrators with the insights needed to elevate educational standards and reduce administrative overhead.
        </p>
      </div>
    ),
    bg: 'bg-background',
  },
   // --- Slide 3: The Problem ---
  {
    content: (
      <div className="p-12 w-full max-w-5xl text-center">
        <h2 className="text-5xl font-bold flex items-center justify-center gap-4"><Lightbulb className="text-primary"/> The Challenge</h2>
        <p className="text-2xl mt-8 text-muted-foreground leading-relaxed max-w-4xl mx-auto">
          Many schools rely on manual, paper-based processes and fragmented software. This administrative bottleneck silos data, wastes valuable teacher time, and prevents strategic, data-driven decision-making.
        </p>
      </div>
    ),
    bg: 'bg-background',
  },
   // --- Slide 4: The Solution ---
  {
    content: (
      <div className="p-12 w-full max-w-5xl text-center">
        <h2 className="text-5xl font-bold flex items-center justify-center gap-4"><TrendingUp className="text-primary"/> Our Solution</h2>
        <p className="text-2xl mt-8 text-muted-foreground leading-relaxed max-w-4xl mx-auto">
          EduDesk replaces this patchwork with a unified, intelligent ecosystem. We automate administrative tasks and integrate AI to provide actionable insights, freeing educators to do what they do best: teach.
        </p>
      </div>
    ),
    bg: 'bg-background',
  },
  // --- Slide 5: Core Benefits ---
  {
    content: (
      <div className="p-12 w-full max-w-6xl">
        <h2 className="text-5xl font-bold text-center mb-16">How EduDesk Elevates Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
                <Users className="h-16 w-16 mx-auto text-primary"/>
                <h3 className="text-3xl font-semibold mt-4">Engage Parents</h3>
                <p className="text-xl text-muted-foreground mt-2">A unified portal for parents to track progress, manage fees, and receive AI-powered advice.</p>
            </div>
            <div className="text-center">
                <Layers className="h-16 w-16 mx-auto text-primary"/>
                <h3 className="text-3xl font-semibold mt-4">Empower Teachers</h3>
                <p className="text-xl text-muted-foreground mt-2">AI tools for performance-aware lesson planning and ad-hoc test generation in minutes, not hours.</p>
            </div>
            <div className="text-center">
                <Trophy className="h-16 w-16 mx-auto text-primary"/>
                <h3 className="text-3xl font-semibold mt-4">Enable Leaders</h3>
                <p className="text-xl text-muted-foreground mt-2">Data-driven reports for instant analysis of school-wide performance, identifying areas for intervention.</p>
            </div>
        </div>
      </div>
    ),
    bg: 'bg-muted/30',
  },
  // --- Slide 6: Roadmap ---
  {
    content: (
       <div className="p-12 w-full max-w-5xl">
        <h2 className="text-5xl font-bold flex items-center gap-4"><CalendarClock className="text-primary"/> Development Roadmap</h2>
        <div className="mt-12 space-y-10">
            <div className="flex items-start gap-6"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">1</span><div><h3 className="text-3xl font-semibold">Phase 1 (Q3 2025): Production Backend</h3><p className="text-xl text-muted-foreground mt-1">Transition to a full Firebase backend (Firestore, Auth, Storage) and establish a robust, multi-tenant architecture.</p></div></div>
            <div className="flex items-start gap-6"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">2</span><div><h3 className="text-3xl font-semibold">Phase 2 (Q4 2025): Financial Integration</h3><p className="text-xl text-muted-foreground mt-1">Integrate with regional mobile money providers (M-Pesa, eMola) for automated invoicing and payments.</p></div></div>
            <div className="flex items-start gap-6"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">3</span><div><h3 className="text-3xl font-semibold">Phase 3 (Q1 2026): Market Launch</h3><p className="text-xl text-muted-foreground mt-1">Launch a pilot program with select schools in Mozambique, followed by a full market launch and marketing campaigns.</p></div></div>
        </div>
      </div>
    ),
    bg: 'bg-background',
  },
  // --- Slide 7: Funding Request ---
  {
    content: (
      <div className="p-12 w-full max-w-5xl">
        <h2 className="text-5xl font-bold flex items-center gap-4"><DollarSign className="text-primary"/> Funding Request</h2>
        <p className="text-7xl font-bold text-primary mt-12">$500,000</p>
        <p className="text-2xl mt-2 text-muted-foreground leading-relaxed">
          This seed funding will be strategically allocated to accelerate development, establish a local sales and support presence, and ensure a successful market entry.
        </p>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mt-12 text-2xl">
            <div><span className="font-bold">40%</span> - Engineering & Product</div>
            <div><span className="font-bold">35%</span> - Sales & Marketing</div>
            <div><span className="font-bold">15%</span> - Cloud Infrastructure</div>
            <div><span className="font-bold">10%</span> - Administrative & Contingency</div>
        </div>
      </div>
    ),
    bg: 'bg-background',
  },
  // --- Slide 8: The Vision ---
  {
    content: (
      <div className="p-12 w-full max-w-5xl text-center">
        <h2 className="text-5xl font-bold flex items-center justify-center gap-4"><Briefcase className="text-primary"/> Our Vision</h2>
        <p className="text-2xl mt-8 text-muted-foreground leading-relaxed max-w-4xl mx-auto">
         To create a lifelong learning ecosystem that supports students from pre-school to university and beyond, bridging the gap between education and career opportunities.
        </p>
      </div>
    ),
    bg: 'bg-background',
  },
  // --- Slide 9: Thank You ---
  {
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <motion.h1 
            className="text-7xl font-bold tracking-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
          Thank You
        </motion.h1>
        <motion.p 
            className="text-3xl text-muted-foreground mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
          Questions?
        </motion.p>
      </div>
    ),
    bg: 'bg-background',
  },
];

export default function ProposalSlidesPage() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setPage((prevPage) => (prevPage + newDirection + slides.length) % slides.length);
  };

  const slideIndex = page % slides.length;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={() => paginate(1)}
    >
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
          <div className="flex gap-2 p-1 bg-muted/50 rounded-full">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${i === slideIndex ? 'bg-primary' : 'bg-muted-foreground/50'}`}
              />
            ))}
          </div>
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">Click to advance</div>
    </div>
  );
}
