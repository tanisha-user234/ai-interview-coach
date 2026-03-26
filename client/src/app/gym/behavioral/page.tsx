import { getInterviewQuestions } from '@/lib/strapi';
import { BackgroundBeams } from "@/app/components/ui/background-beams";
import InterviewSession from "../components/InterviewSession";

export default async function BehavioralRound() {
    const allQuestions = await getInterviewQuestions().catch(() => []);

    // Filter for behavioral questions
    let questions = allQuestions ? allQuestions.filter((q: any) =>
        (q.category || '').toLowerCase() === 'behavioral'
    ) : [];

    // Fallback if no questions found (for demo/testing)
    if (!questions || questions.length === 0) {
        questions = [
            { id: 'mock-1', question: "Tell me about a time you handled a difficult conflict at work.", category: 'Behavioral' },
            { id: 'mock-2', question: "Describe a situation where you had to meet a tight deadline.", category: 'Behavioral' },
            { id: 'mock-3', question: "What is your greatest weakness and how are you working on it?", category: 'Behavioral' }
        ];
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center p-4 md:p-8 bg-slate-950">
            <BackgroundBeams />

            <div className="z-10 w-full max-w-6xl flex flex-col items-center gap-8">
                <header className="text-center mb-4">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400 mb-2">
                        Behavioral Interview
                    </h1>
                    <p className="text-slate-400">
                        Practice your soft skills and check your cultural fit.
                    </p>
                </header>

                <InterviewSession questions={questions} />
            </div>
        </div>
    );
}
