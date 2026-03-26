"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ArrowRight, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; // index
}

interface QuizInterfaceProps {
    title: string;
    questions: Question[];
    onComplete: (score: number) => void;
}

export default function QuizInterface({ title, questions, onComplete }: QuizInterfaceProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        if (index === questions[currentQuestion].correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
            onComplete(score);
        }
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                <h2 className="text-3xl font-bold mb-4">Round Complete!</h2>
                <div className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-muted-foreground mb-8">
                    You got {score} out of {questions.length} questions correct.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                >
                    <RefreshCcw size={20} /> Try Again
                </button>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-200">{title}</h2>
                <span className="text-sm font-medium bg-slate-800 px-3 py-1 rounded-full text-slate-400">
                    Question {currentQuestion + 1}/{questions.length}
                </span>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6 leading-relaxed">{question.question}</h3>
                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {question.options.map((option, index) => {
                            let stateStyles = "border-slate-700 hover:bg-slate-800/50";
                            if (isAnswered) {
                                if (index === question.correctAnswer) {
                                    stateStyles = "border-green-500 bg-green-500/10 text-green-400";
                                } else if (index === selectedOption) {
                                    stateStyles = "border-red-500 bg-red-500/10 text-red-400";
                                } else {
                                    stateStyles = "border-slate-800 opacity-50";
                                }
                            }

                            return (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={isAnswered}
                                    className={`w-full p-4 text-left rounded-lg border-2 transition-all flex justify-between items-center ${stateStyles}`}
                                >
                                    <span className="font-medium">{option}</span>
                                    {isAnswered && index === question.correctAnswer && <CheckCircle size={20} />}
                                    {isAnswered && index === selectedOption && index !== question.correctAnswer && <XCircle size={20} />}
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex justify-end h-12">
                {isAnswered && (
                    <button
                        onClick={nextQuestion}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-all animate-in slide-in-from-right-4 fade-in"
                    >
                        {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Round"} <ArrowRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
