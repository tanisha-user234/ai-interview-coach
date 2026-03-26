"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "./ui/neon-button";
import { MagicCard } from "./ui/magic-card";
import { api } from "@/lib/api";

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function SpeechInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<any>(null);

    // Speech Recognition
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Start interview session on mount
        const startSession = async () => {
            try {
                const data = await api.startInterview();
                setSessionId(data.session_id);
                setMessages([{ role: "ai", content: data.message }]);
                speak(data.message);
            } catch (error) {
                console.error("Failed to start session:", error);
                setMessages([{ role: "ai", content: "Error starting interview session. Please refresh." }]);
            }
        };
        startSession();

        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = "en-US";

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    setIsListening(false);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const speak = (text: string) => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !sessionId) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            const data = await api.chat(userMsg, sessionId);

            const aiMsg = data.response;
            setMessages(prev => [...prev, { role: "ai", content: aiMsg }]);
            speak(aiMsg);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndInterview = async () => {
        if (!sessionId) return;
        setIsLoading(true);
        try {
            const data = await api.endInterview(sessionId);
            setFeedback(data);
        } catch (error) {
            console.error("Feedback error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (feedback) {
        return (
            <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto p-4">
                <MagicCard className="flex-1 flex flex-col p-8 overflow-y-auto border-purple-500/30">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-6">Interview Feedback</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-xl font-semibold text-slate-200 mb-2">Overall Score</h3>
                            <div className="text-5xl font-bold text-green-400">{feedback.score}/100</div>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-xl font-semibold text-slate-200 mb-2">Summary</h3>
                            <p className="text-slate-300 italic">"{feedback.summary}"</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-green-300 mb-3">Strengths</h3>
                            <ul className="space-y-2">
                                {feedback.strengths.map((s: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-300">
                                        <span className="text-green-500">✓</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-amber-300 mb-3">Areas for Improvement</h3>
                            <ul className="space-y-2">
                                {feedback.improvements.map((s: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-300">
                                        <span className="text-amber-500">!</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <NeonButton onClick={() => window.location.reload()} variant="secondary">
                            Start New Interview
                        </NeonButton>
                    </div>
                </MagicCard>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto">
            <MagicCard className="flex-1 flex flex-col p-4 overflow-hidden border-blue-500/30">
                <div className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-xl ${msg.role === "user"
                                ? "bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-br-none"
                                : "bg-slate-800/80 border border-slate-700 text-slate-200 rounded-bl-none"
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-2">
                                <Loader2 className="animate-spin text-blue-400" size={20} />
                                <span className="text-sm text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center my-2">
                    <button
                        onClick={handleEndInterview}
                        className="text-xs text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest font-semibold"
                    >
                        End Interview & Get Feedback
                    </button>
                </div>

                <div className="mt-2 p-2 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center gap-2">
                    <button
                        onClick={toggleListening}
                        className={`p-3 rounded-full transition-all ${isListening
                            ? "bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                            : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                            }`}
                        title={isListening ? "Stop Listening" : "Start Speaking"}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type your answer or use the microphone..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder:text-slate-600"
                        disabled={isLoading}
                    />

                    <button
                        onClick={() => speak(messages[messages.length - 1]?.content || "")}
                        className={`p-2 rounded-full text-slate-400 hover:text-blue-400 transition-colors ${isSpeaking ? "text-blue-400" : ""}`}
                        title="Replay Last Message"
                    >
                        <Volume2 size={20} />
                    </button>

                    <NeonButton
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        variant="primary"
                        className="px-4 py-2"
                    >
                        <Send size={18} />
                    </NeonButton>
                </div>
            </MagicCard>
        </div>
    );
}
