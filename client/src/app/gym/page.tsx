"use client";

import Link from "next/link";
import { Dumbbell, Code, BrainCircuit, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const rounds = [
    {
        title: "Fundamentals",
        description: "Aptitude, Logic, and CS Basics.",
        icon: BookOpen,
        href: "/gym/fundamentals",
        color: "bg-blue-500",
    },
    {
        title: "Coding Round",
        description: "DSA & Situational Coding Challenges.",
        icon: Code,
        href: "/gym/coding",
        color: "bg-purple-500",
    },
    {
        title: "Role-Specific Technical",
        description: "Deep dive into your specific tech stack.",
        icon: BrainCircuit,
        href: "/gym/technical",
        color: "bg-green-500",
    },
    {
        title: "Resume Deep-Dive",
        description: "Defend your projects and experience.",
        icon: Dumbbell,
        href: "/gym/deep-dive",
        color: "bg-orange-500",
    },
    {
        title: "HR & Behavioral",
        description: "Soft skills and culture fit.",
        icon: Users,
        href: "/gym/behavioral",
        color: "bg-pink-500",
    },
];

export default function GymPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    The Gym
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Train for every stage of your interview process.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rounds.map((round, index) => (
                    <Link href={round.href} key={index}>
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-6 rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm transition-all hover:border-slate-500 cursor-pointer h-full flex flex-col justify-between"
                        >
                            <div>
                                <div className={`w-12 h-12 rounded-lg ${round.color} bg-opacity-20 flex items-center justify-center mb-4 text-${round.color.split("-")[1]}-400`}>
                                    <round.icon size={24} className="text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{round.title}</h3>
                                <p className="text-slate-400">{round.description}</p>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-700 text-slate-300">
                                    0/10 Completed
                                </span>
                                <span className="text-sm text-blue-400 hover:text-blue-300">Start Round &rarr;</span>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
