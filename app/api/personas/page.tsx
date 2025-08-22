import Link from 'next/link';
import { PRESET_PERSONAS } from '@/components/personaPresets';

export default function PersonasPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
      <main className="bg-[#111111] p-6 sm:p-10 rounded-lg border border-green-500/20 shadow-2xl shadow-green-500/5 space-y-8">
        <div className="text-center">
          <h1 style={{ fontFamily: "'Uncut Sans', sans-serif" }} className="text-4xl font-bold text-green-400 tracking-tight sm:text-5xl">
            Personas
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Browse the built-in personas used for generating meeting transcripts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-green-500/20">
          {PRESET_PERSONAS.map((persona) => (
            <Link
              key={persona.id}
              href={`/personas/${persona.id}`}
              className="block p-6 bg-black/30 border border-slate-800 rounded-lg hover:bg-slate-900/50 hover:border-green-500/40 transition-all"
            >
              <h2 style={{ fontFamily: "'Uncut Sans', sans-serif" }} className="text-2xl font-bold text-green-400">{persona.name}</h2>
              <p className="mt-2 text-slate-400 line-clamp-3">{persona.systemInstruction}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

