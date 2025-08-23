'use client';
import { useState } from 'react';
import { PRESET_PERSONAS } from './personaPresets';

type ParticipantInput = {
  id: string;
  name: string;
  personaId: string;
  systemInstruction?: string;
};

type MeetingFormProps = {
  onCreated: (res: { id: string; transcript: string; }) => void;
  setLoading: (isLoading: boolean) => void;
  loading: boolean;
};

export default function MeetingForm({ onCreated, setLoading, loading }: MeetingFormProps) {
  const [title, setTitle] = useState('Three Amigos: User Story Refinement for Agile');
  const [story, setStory] = useState('As a <user>, I want <capability> so that <benefit>.');
  const [goals, setGoals] = useState('Agree acceptance criteria, surface risks, estimate rough size.');
  const [participants, setParticipants] = useState<ParticipantInput[]>(
    PRESET_PERSONAS.filter(p => ['dev', 'qa', 'po'].includes(p.id)).map(p => ({ id: crypto.randomUUID(), name: p.name, personaId: p.id }))
  );
  const [error, setError] = useState<string | null>(null);

  function updateParticipant(i:number, patch:Partial<ParticipantInput>) {
    setParticipants(prev => prev.map((p, idx) => idx===i ? { ...p, ...patch } : p));
  }
  function addParticipant() {
    const pm = PRESET_PERSONAS.find(p => p.id === 'pm');
    if (pm) {
      setParticipants(prev => [...prev, { id: crypto.randomUUID(), name: pm.name, personaId: pm.id }]);
    }
  }
  function removeParticipant(i:number) {
    setParticipants(prev => prev.filter((_, idx) => idx !== i));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/run-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, story, goals, participants })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onCreated(data);
    } catch (err:any) {
      setError(err.message || 'Failed to run meeting');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-slate-400">Title</label>
        <input id="title" className="mt-1 block w-full rounded-md bg-slate-900 border-slate-700 text-slate-400 placeholder:text-slate-600 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" value={title} onChange={e=>setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label htmlFor="story" className="block text-sm font-medium text-slate-400">Jira User Story / Description</label>
        <textarea id="story" rows={5} className="mt-1 block w-full rounded-md bg-slate-900 border-slate-700 text-slate-400 placeholder:text-slate-600 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" value={story} onChange={e=>setStory(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label htmlFor="goals" className="block text-sm font-medium text-slate-400">Goals (optional)</label>
        <input id="goals" className="mt-1 block w-full rounded-md bg-slate-900 border-slate-700 text-slate-400 placeholder:text-slate-600 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" value={goals} onChange={e=>setGoals(e.target.value)} />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-400">Participants</label>
        {participants.map((p, i) => (
          <div key={p.id} className="bg-black/30 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex gap-2">
              <input className="block w-full rounded-md bg-slate-900 border-slate-700 text-slate-400 placeholder:text-slate-600 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="Display name" value={p.name} onChange={e=>updateParticipant(i,{name:e.target.value})} />
              <select className="block w-full rounded-md bg-slate-900 border-slate-700 text-slate-400 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" value={p.personaId} onChange={e=>updateParticipant(i,{personaId:e.target.value})}>
                {PRESET_PERSONAS.map(pp => <option key={pp.id} value={pp.id}>{pp.name}</option>)}
                <option value="custom">Custom</option>
              </select>
            </div>
            {p.personaId === 'custom' && (
              <textarea rows={3} className="block w-full rounded-md bg-slate-900 border-slate-700 text-slate-400 placeholder:text-slate-600 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="Custom system instructions for this participant" value={p.systemInstruction||''} onChange={e=>updateParticipant(i,{systemInstruction:e.target.value})} />
            )}
            <div className="flex justify-end">
              <button type="button" onClick={()=>removeParticipant(i)} className="text-sm font-medium text-red-500 hover:text-red-400">Remove</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addParticipant} className="inline-flex justify-center rounded-lg text-sm font-semibold py-2 px-3 text-green-400 ring-1 ring-inset ring-green-500/50 hover:bg-green-500/10">
          + Add participant
        </button>
      </div>

      <div className="pt-4">
        <button style={{ fontFamily: "'Uncut Sans', sans-serif" }} disabled={loading} className="inline-flex w-full justify-center rounded-lg text-sm font-bold py-3 px-4 bg-green-500 text-black hover:bg-green-400 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors">
          {loading ? 'Running...' : 'Run Three Amigos'}
        </button>
      </div>
      {error && <div className="rounded-md bg-red-900/50 border border-red-500/50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-bold text-red-400">Error</h3>
            <div className="mt-2 text-sm text-red-400">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>}
    </form>
  );
}
