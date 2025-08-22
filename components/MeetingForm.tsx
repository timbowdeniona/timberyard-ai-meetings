'use client';
import { useState } from 'react';
import { PRESET_PERSONAS } from './personaPresets';

type ParticipantInput = {
  name: string;
  personaId: string;
  systemInstruction?: string;
};

export default function MeetingForm({ onCreated }:{ onCreated: (res:{id:string, transcript:string})=>void }) {
  const [title, setTitle] = useState('Three Amigos: User Story Refinement');
  const [story, setStory] = useState('As a <user>, I want <capability> so that <benefit>.');
  const [goals, setGoals] = useState('Agree acceptance criteria, surface risks, estimate rough size.');
  const [participants, setParticipants] = useState<ParticipantInput[]>([
    { name: 'Dev', personaId: 'dev' },
    { name: 'QA', personaId: 'qa' },
    { name: 'PO', personaId: 'po' }
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateParticipant(i:number, patch:Partial<ParticipantInput>) {
    setParticipants(prev => prev.map((p, idx) => idx===i ? { ...p, ...patch } : p));
  }
  function addParticipant() {
    setParticipants(prev => [...prev, { name: 'PM', personaId: 'pm' }]);
  }
  function removeParticipant(i:number) {
    setParticipants(prev => prev.filter((_, idx) => idx !== i));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
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
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block font-medium">Title</label>
        <input className="border rounded p-2 w-full" value={title} onChange={e=>setTitle(e.target.value)} />
      </div>
      <div>
        <label className="block font-medium">Jira User Story / Description</label>
        <textarea className="border rounded p-2 w-full min-h-[120px]" value={story} onChange={e=>setStory(e.target.value)} />
      </div>
      <div>
        <label className="block font-medium">Goals (optional)</label>
        <input className="border rounded p-2 w-full" value={goals} onChange={e=>setGoals(e.target.value)} />
      </div>

      <div className="space-y-2">
        <div className="font-semibold">Participants</div>
        {participants.map((p, i) => (
          <div key={i} className="border rounded p-3 space-y-2">
            <div className="flex gap-2">
              <input className="border rounded p-2 flex-1" placeholder="Display name" value={p.name} onChange={e=>updateParticipant(i,{name:e.target.value})} />
              <select className="border rounded p-2" value={p.personaId} onChange={e=>updateParticipant(i,{personaId:e.target.value})}>
                {PRESET_PERSONAS.map(pp => <option key={pp.id} value={pp.id}>{pp.name}</option>)}
                <option value="custom">Custom</option>
              </select>
            </div>
            {p.personaId === 'custom' && (
              <textarea className="border rounded p-2 w-full" placeholder="Custom system instructions for this participant" value={p.systemInstruction||''} onChange={e=>updateParticipant(i,{systemInstruction:e.target.value})} />
            )}
            <div className="flex justify-end">
              <button type="button" onClick={()=>removeParticipant(i)} className="text-sm text-red-600">Remove</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addParticipant} className="px-3 py-2 rounded bg-gray-100 border">+ Add participant</button>
      </div>

      <button disabled={busy} className="px-4 py-2 rounded bg-black text-white">{busy ? 'Running...' : 'Run Three Amigos'}</button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}
