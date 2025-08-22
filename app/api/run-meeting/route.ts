import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGenAI, getModelName } from '@/lib/gemini';
import { PRESET_PERSONAS } from '@/components/personaPresets';
import { Meeting } from '@/types';
import { saveMeeting } from '@/lib/store';
import crypto from 'node:crypto';

const ParticipantSchema = z.object({
  name: z.string(),
  personaId: z.string(),
  systemInstruction: z.string().optional(),
});

const MeetingSchema = z.object({
  title: z.string().min(3),
  story: z.string().min(10),
  goals: z.string().optional(),
  participants: z.array(ParticipantSchema).min(2),
});

function personaById(id: string) {
  return PRESET_PERSONAS.find((p) => p.id === id);
}

function buildSystemInstructionForParticipant(
  p: z.infer<typeof ParticipantSchema>
) {
  const preset = personaById(p.personaId);
  const base = p.systemInstruction || preset?.systemInstruction || '';
  return base.trim();
}

function buildConversationPrompt(meeting: Omit<Meeting, 'id' | 'createdAt'>) {
  // ✨ ENHANCEMENT: Made instructions for Markdown and Gherkin formatting much more explicit.
  const header = `Facilitate a short, focused virtual "Three Amigos" meeting transcript.
- Goal: converge on clear, testable acceptance criteria and next actions.
- Keep speaker turns concise (2-5 sentences each) and alternate speakers naturally.
- FORMATTING: Structure the entire response using Markdown. End with the following headers:
### Acceptance Criteria
- Write the criteria using Gherkin syntax.
- **IMPORTANT**: Wrap the Gherkin criteria in a markdown code block like this: \`\`\`gherkin ... \`\`\`
### Action Items
- Use a bulleted list to outline actions and owners.`;

  const personaBlocks = meeting.participants
    .map((p) => {
      const sys = buildSystemInstructionForParticipant(p);
      return `### ${p.name} persona instructions
${sys}`;
    })
    .join('\n\n');

  const body = `### Jira User Story / Context
${meeting.story}

### Meeting Goals
${meeting.goals || 'Refine the story, identify risks, and agree acceptance criteria.'}`;

  return `${header}\n\n${personaBlocks}\n\n${body}`;
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = MeetingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const genai = getGenAI();

  const prompt = buildConversationPrompt({
    title: data.title,
    story: data.story,
    goals: data.goals,
    participants: data.participants,
  });

  // ✅ New SDK usage
  const result = await genai.models.generateContent({
    model: getModelName(),
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    config: {
      // ✨ ENHANCEMENT: Reinforced the formatting rules in the system instruction.
      systemInstruction:
        'You simulate a realistic, constructive product development meeting. Structure the final output in Markdown. End with Gherkin Acceptance Criteria inside a code block and a bulleted list of Action Items with owners.',
    },
  });

  const text = result.text

  const meetingId = crypto.randomUUID();
  const meeting: Meeting = {
    id: meetingId,
    title: data.title,
    story: data.story,
    goals: data.goals,
    participants: data.participants as any,
    createdAt: new Date().toISOString(),
    transcript: String(text || ''),
  };
  saveMeeting(meeting);

  return NextResponse.json({ id: meetingId, transcript: meeting.transcript });
}