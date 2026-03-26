import { getBlogPosts } from '@/lib/strapi';
import Link from 'next/link';
import { BackgroundBeams } from '@/app/components/ui/background-beams';
import { MagicCard } from '@/app/components/ui/magic-card'; // Assuming this export exists
import { ArrowRight } from 'lucide-react';

export default async function LearnPage() {
    const posts = await getBlogPosts();

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex flex-col items-center p-4 md:p-8">
            <BackgroundBeams />

            <div className="z-10 w-full max-w-7xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-cyan-200 to-white text-glow">
                    Learning Resources
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts && posts.map((post: any) => (
                        <Link href={`/learn/${post.slug}`} key={post.id} className="h-full block group">
                            <MagicCard className="h-full hover:scale-[1.02] transition-transform duration-300 border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                                <div className="p-6 flex flex-col h-full">
                                    <h2 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-cyan-400 transition-colors">
                                        {post.title}
                                    </h2>

                                    {post.publisheDate && (
                                        <p className="text-slate-500 text-sm mb-4">
                                            {new Date(post.publisheDate).toLocaleDateString()}
                                        </p>
                                    )}

                                    <div className="mt-auto flex items-center text-cyan-500 font-medium text-sm">
                                        Read Article
                                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </MagicCard>
                        </Link>
                    ))}

                    {(!posts || posts.length === 0) && (
                        <p className="text-center text-slate-500 col-span-full text-lg">
                            No learning resources available yet. Check back soon!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
