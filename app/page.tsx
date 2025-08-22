'use client';
import MeetingForm from '@/components/MeetingForm';
import Link from 'next/link';
import MeetingResponse from '@/components/MeetingResponse';
import Spinner from '@/components/spinner';
import { useState } from 'react';

export default function Page() {
  const [last, setLast] = useState<{id:string, transcript:string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreated = (data: { id: string; transcript: string }) => {
    setLast(data);
    setLoading(false);
  };

  const handleLoading = (isLoading: boolean) => {
    if (isLoading) {
      setLast(null);
    }
    setLoading(isLoading);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
      <main className="bg-[#111111] p-6 sm:p-10 rounded-lg border border-green-500/20 shadow-2xl shadow-green-500/5 space-y-8">
        <div className="text-center">
          <h1 style={{ fontFamily: "'Uncut Sans', sans-serif" }} className="text-4xl font-bold text-green-400 tracking-tight sm:text-5xl">Virtual Three Amigos (Gemini)</h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Create a meeting, invite personas (Dev, QA, PO, PM or custom), paste a Jira story, and generate a concise transcript with acceptance criteria.</p>
          <div className="mt-6">
            <Link href="/personas" className="text-green-400 hover:text-green-300 transition-colors text-sm font-semibold">
              Browse Personas &rarr;
            </Link>
          </div>
        </div>
        <MeetingForm onCreated={handleCreated} setLoading={handleLoading} loading={loading} />
        {loading && <Spinner />}
        {last && !loading && (
          <section className="space-y-4 pt-8 border-t border-green-500/20">
            <h2 style={{ fontFamily: "'Uncut Sans', sans-serif" }} className="text-2xl sm:text-3xl font-bold text-green-400">Transcript</h2>
            <MeetingResponse transcript={last.transcript} />
          </section>
        )}
      </main>
    </div>
  );
}
