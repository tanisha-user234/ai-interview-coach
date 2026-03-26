import { getInterviewQuestions } from '@/lib/strapi';
import { BackgroundBeams } from '@/app/components/ui/background-beams';
import { MagicCard } from '@/app/components/ui/magic-card';

export default async function PracticePage() {
    const questions = await getInterviewQuestions();

    // Group questions by category
    const groupedQuestions: Record<string, any[]> = {};
    if (questions) {
        questions.forEach((q: any) => {
            const category = q.category || 'Other';
            if (!groupedQuestions[category]) {
                groupedQuestions[category] = [];
            }
            groupedQuestions[category].push(q);
        });
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex flex-col items-center p-4 md:p-8">
            <BackgroundBeams />

            <div className="z-10 w-full max-w-5xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-white text-glow">
                    Interview Practice
                </h1>

                {Object.keys(groupedQuestions).length === 0 ? (
                    <p className="text-center text-slate-500 text-lg">No interview questions found. Please add some in the CMS.</p>
                ) : (
                    Object.entries(groupedQuestions).map(([category, items]) => (
                        <div key={category} className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 text-slate-200 border-b border-slate-800 pb-2 pl-2">
                                {category} Questions
                            </h2>
                            <div className="grid gap-4">
                                {items.map((q: any) => (
                                    <MagicCard key={q.id} className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4 gap-4">
                                                <h3 className="text-lg font-medium text-slate-100">{q.question}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide 
                                    ${q.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                        q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                                            'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                                    {q.difficulty}
                                                </span>
                                            </div>

                                            {q.expectedAnswer && (
                                                <details className="mt-4 group">
                                                    <summary className="cursor-pointer text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors list-none flex items-center">
                                                        <span className="mr-2 group-open:rotate-90 transition-transform">▸</span>
                                                        Show Key Talking Points
                                                    </summary>
                                                    <div className="mt-3 p-4 bg-slate-950/50 rounded-lg border border-slate-800 text-slate-300 text-sm leading-relaxed">
                                                        {JSON.stringify(q.expectedAnswer).substring(0, 150)}{JSON.stringify(q.expectedAnswer).length > 150 ? '...' : ''}
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    </MagicCard>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
