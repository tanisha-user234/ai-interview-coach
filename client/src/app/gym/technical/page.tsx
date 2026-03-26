import { getInterviewQuestions } from '@/lib/strapi';
import { BackgroundBeams } from "@/app/components/ui/background-beams";
import InterviewSession from "../components/InterviewSession";

export default async function TechnicalRound() {
    const allQuestions = await getInterviewQuestions().catch(() => []);

    // Filter for technical questions
    let questions = allQuestions ? allQuestions.filter((q: any) =>
        (q.category || '').toLowerCase() === 'technical'
    ) : [];

    // Fallback if no questions found (for demo/testing)
    if (!questions || questions.length === 0) {
        questions = [
            { id: 'mock-t1', question: "Explain the difference between TCP and UDP.", category: 'Technical' },
            { id: 'mock-t2', question: "How does the Python Global Interpreter Lock (GIL) work?", category: 'Technical' },
            { id: 'mock-t3', question: "Design a URL shortening service like Bit.ly.", category: 'Technical' }
        ];
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center p-4 md:p-8 bg-slate-950">
            <BackgroundBeams />

            <div className="z-10 w-full max-w-6xl flex flex-col items-center gap-8">
                <header className="text-center mb-4">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                        Technical Round
                    </h1>
                    <p className="text-slate-400">
                        Deep dive into your specific tech stack and architectural knowledge.
                    </p>
                </header>

                <InterviewSession questions={questions} />
            </div>
        </div>
    );
}
