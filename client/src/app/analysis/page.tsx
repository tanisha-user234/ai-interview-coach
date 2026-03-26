"use client";

import { useState } from "react";
import ResumeUpload from "../components/ResumeUpload";
import { ArrowRight, Loader2, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundBeams } from "../components/ui/background-beams";
import { MagicCard } from "../components/ui/magic-card";
import { NeonButton } from "../components/ui/neon-button";
import { api } from "@/lib/api";

export default function ResumeAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!file || !jobDescription) return;
        setIsAnalyzing(true);

        try {
            const data = await api.analyzeGap(file, jobDescription);
            setResult(data);
        } catch (error) {
            console.error("Analysis failed:", error);
            // Optionally set an error state here to show to the user
            alert("Analysis failed. Please ensure the backend is running.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center p-4 md:p-8 overflow-x-hidden">
            <BackgroundBeams />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-5xl"
            >
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 text-glow">
                        Resume Audit
                    </h1>
                    <p className="text-slate-400">
                        Upload your resume and the job description to get a personalized gap analysis.
                    </p>
                </header>

                <div className="grid gap-8">
                    {/* Input Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <MagicCard className="p-0 overflow-visible">
                            <div className="p-6 md:p-8 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold flex items-center gap-3 text-blue-300">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold border border-blue-500/30">1</span>
                                            Upload Resume
                                        </h2>
                                        <ResumeUpload onUpload={setFile} />
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold flex items-center gap-3 text-purple-300">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold border border-purple-500/30">2</span>
                                            Job Description
                                        </h2>
                                        <textarea
                                            className="w-full h-40 bg-slate-950/50 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none resize-none transition-all placeholder:text-slate-600 text-slate-300"
                                            placeholder="Paste the target job description here..."
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center pt-4">
                                    <NeonButton
                                        onClick={handleAnalyze}
                                        disabled={!file || !jobDescription || isAnalyzing}
                                        variant="primary"
                                        className={`w-full md:w-auto min-w-[200px] ${(!file || !jobDescription) ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" /> Analyzing Profile...
                                            </>
                                        ) : (
                                            <>
                                                Start Gap Analysis <ArrowRight className="ml-2" size={20} />
                                            </>
                                        )}
                                    </NeonButton>
                                </div>
                            </div>
                        </MagicCard>
                    </motion.div>

                    {/* Results Section */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            >
                                <MagicCard className="border-t-4 border-t-blue-500">
                                    <div className="p-2">
                                        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                                            <div>
                                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">Analysis Report</h2>
                                                <p className="text-slate-400 mt-2">Based on your provided documents</p>
                                            </div>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500"></div>
                                                <div className="relative flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-blue-500/30 bg-slate-900/80 backdrop-blur-xl">
                                                    <span className="text-4xl font-black text-blue-400">{result.score}</span>
                                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Score</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                                            <div className="space-y-4">
                                                <h3 className="text-red-400 font-semibold flex items-center gap-2 text-lg">
                                                    <AlertCircle size={20} />
                                                    Missing Skills
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.missingSkills.map((skill: string, i: number) => (
                                                        <motion.span
                                                            key={skill}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 text-sm border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                                                        >
                                                            {skill}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-green-400 font-semibold flex items-center gap-2 text-lg">
                                                    <CheckCircle2 size={20} />
                                                    Matched Strengths
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.strengths.map((skill: string, i: number) => (
                                                        <motion.span
                                                            key={skill}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 text-sm border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                                                        >
                                                            {skill}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                                            <h3 className="text-slate-200 font-semibold mb-4 text-lg">Recommended Actions</h3>
                                            <ul className="space-y-4">
                                                {result.suggestions.map((suggestion: string, i: number) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.3 + i * 0.1 }}
                                                        className="flex items-start gap-3 text-slate-300"
                                                    >
                                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] flex-shrink-0" />
                                                        <span className="leading-relaxed">{suggestion}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-10 flex flex-wrap justify-end gap-4">
                                            <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-medium transition-colors border border-slate-700 hover:text-white">
                                                Save Report
                                            </button>
                                            <NeonButton variant="accent" className="flex items-center gap-2">
                                                <Play size={16} fill="currentColor" /> Proceed to Gym
                                            </NeonButton>
                                        </div>
                                    </div>
                                </MagicCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
