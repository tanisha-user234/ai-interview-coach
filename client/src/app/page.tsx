"use client";

import Link from "next/link";
import {
  FileText,
  Dumbbell,
  Code,
  Users,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "./components/ui/background-beams";
import { MagicCard } from "./components/ui/magic-card";
import { NeonButton } from "./components/ui/neon-button";

const modules = [
  {
    title: "Resume Audit",
    description: "AI-powered gap analysis against your target job description.",
    icon: FileText,
    href: "/analysis",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    title: "Practice Gym",
    description: "Train with role-specific questions and coding challenges.",
    icon: Dumbbell,
    href: "/gym",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
  },
  {
    title: "Technical Round",
    description: "Deep dive into your stack (React, Node, etc.).",
    icon: Code,
    href: "/gym/technical",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400",
  },
  {
    title: "Behavioral",
    description: "Prepare for HR rounds with AI feedback.",
    icon: Users,
    href: "/gym/behavioral",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400",
  },
  {
    title: "Question Bank",
    description: "Browse a curated list of interview questions.",
    icon: FileText,
    href: "/practice",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    title: "Learning Resources",
    description: "Read guides and tips to ace your interview.",
    icon: Sparkles,
    href: "/learn",
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
  },
];

export default function Dashboard() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center p-4 md:p-8">
      <BackgroundBeams />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-4xl mx-auto mb-16"
      >


        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/60 mb-6 tracking-tight text-glow">
          Master Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Dream Interview</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          Level up your career with our intelligent coaching platform. Analyze resumes, practice coding, and perfect your behavioral answers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/analysis">
            <NeonButton variant="primary" className="text-lg px-8 py-4">
              Upload Resume
            </NeonButton>
          </Link>
          <Link href="/gym">
            <NeonButton variant="secondary" className="text-lg px-8 py-4">
              Start Training
            </NeonButton>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl px-4 z-10">
        {modules.map((module, index) => (
          <Link href={module.href} key={index} className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="h-full"
            >
              <MagicCard className="hover:scale-[1.02] transition-transform duration-300">
                <div className={`p-3 w-fit rounded-lg bg-gradient-to-br ${module.gradient} mb-4`}>
                  <module.icon className={module.iconColor} size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">{module.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
                  {module.description}
                </p>
                <div className="flex items-center text-sm font-medium text-slate-300 mt-auto group">
                  Start Module
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </MagicCard>
            </motion.div>
          </Link>
        ))}
      </div>
    </main>
  );
}
