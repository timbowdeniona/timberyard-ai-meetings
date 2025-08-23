'use client';
import MeetingForm from '@/components/MeetingForm';
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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <main className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Virtual Three Amigos (Gemini)</h1>
          <p className="mt-4 text-lg text-slate-500">Create a meeting, invite personas (Dev, QA, PO, PM or custom), paste a Jira story, and generate a concise transcript with acceptance criteria.</p>
        </div>
        <MeetingForm onCreated={handleCreated} setLoading={handleLoading} loading={false} />
        {loading && <Spinner />}
        {last && !loading && (
          <section className="space-y-4 pt-8 border-t border-slate-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Transcript</h2>
            <div className="bg-slate-100/75 border border-slate-200 rounded-lg p-4 sm:p-6 text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">{last.transcript}</div>
          </section>
        )}
      </main>
    </div>
  );
}
