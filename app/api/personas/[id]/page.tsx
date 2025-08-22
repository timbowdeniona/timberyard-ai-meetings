import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRESET_PERSONAS } from '@/components/personaPresets';

type PersonaDetailsPageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  return PRESET_PERSONAS.map((persona) => ({
    id: persona.id,
  }));
}

export default function PersonaDetailsPage({ params }: PersonaDetailsPageProps) {
  const persona = PRESET_PERSONAS.find((p) => p.id === params.id);

  if (!persona) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
      <main className="bg-[#111111] p-6 sm:p-10 rounded-lg border border-green-500/20 shadow-2xl shadow-green-500/5 space-y-8">
        <div>
          <Link href="/personas" className="text-green-400 hover:text-green-300 transition-colors">
            &larr; Back to Personas
          </Link>
        </div>
        <div className="space-y-4">
          <h1 style={{ fontFamily: "'Uncut Sans', sans-serif" }} className="text-4xl font-bold text-green-400 tracking-tight sm:text-5xl">{persona.name}</h1>
          <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-300">
            <p className="text-lg text-slate-400">System Instruction:</p>
            <blockquote className="border-l-green-500 text-slate-400">{persona.systemInstruction}</blockquote>
          </div>
        </div>
      </main>
    </div>
  );
}

