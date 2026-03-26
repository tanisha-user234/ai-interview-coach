"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, ArrowRight, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { NeonButton } from "../../components/ui/neon-button";
import { MagicCard } from "../../components/ui/magic-card";
import { api } from "@/lib/api";

export default function InterviewSession({ questions }: { questions: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
    const [feedback, setFeedback] = useState<any>(null);
    const recognitionRef = useRef<any>(null);

    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onresult = (event: any) => {
                    let transcript = "";
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            transcript += event.results[i][0].transcript;
                        }
                    }
                    if (transcript) {
                        setAnswer(prev => prev + " " + transcript);
                    }
                };
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSubmit = async () => {
        if (!answer.trim()) return;
        setEvaluating(true);
        try {
            const result = await api.evaluateAnswer({
                question: currentQuestion.question || currentQuestion.title, // Handle different schema
                answer: answer
            });
            setFeedback(result);
        } catch (error) {
            console.error("Evaluation failed", error);
        } finally {
            setEvaluating(false);
        }
    };

    const nextQuestion = () => {
        setFeedback(null);
        setAnswer("");
        setCurrentIndex((prev) => (prev + 1) % questions.length);
    };

    if (!questions || questions.length === 0) {
        return <div className="text-center text-slate-400">No questions available for this session.</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            <MagicCard className="p-8 border-slate-700 bg-slate-900/60 backdrop-blur-md">
                <span className="text-blue-400 text-sm font-bold tracking-widest uppercase mb-2 block">
                    Question {currentIndex + 1} of {questions.length}
                </span>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
                    {currentQuestion.question || currentQuestion.title}
                </h2>

                {!feedback ? (
                    <div className="space-y-6">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here or record it..."
                            className="w-full h-40 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                        />

                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={toggleListening}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isListening
                                        ? "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse"
                                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    }`}
                            >
                                {isListening ? <><MicOff size={18} /> Stop Recording</> : <><Mic size={18} /> Record Answer</>}
                            </button>

                            <NeonButton onClick={handleSubmit} disabled={evaluating || !answer.trim()} variant="primary">
                                {evaluating ? <><Loader2 className="animate-spin mr-2" size={18} /> Analyzing...</> : <><Send className="mr-2" size={18} /> Submit Answer</>}
                            </NeonButton>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8 p-6 rounded-xl bg-slate-950/50 border border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-200">AI Feedback</h3>
                                <div className={`text-4xl font-bold ${feedback.score >= 80 ? 'text-green-400' :
                                        feedback.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {feedback.score}<span className="text-lg text-slate-500">/100</span>
                                </div>
                            </div>
                            <p className="text-slate-300 leading-relaxed mb-4">{feedback.feedback}</p>

                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Improvements</h4>
                                <ul className="space-y-2">
                                    {feedback.improvements?.map((imp: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                            {imp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <NeonButton onClick={nextQuestion} variant="secondary">
                                Next Question <ArrowRight className="ml-2" size={18} />
                            </NeonButton>
                        </div>
                    </div>
                )}
            </MagicCard>
        </div>
    );
}
