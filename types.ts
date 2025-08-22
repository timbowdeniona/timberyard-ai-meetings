export type MeetingParticipant = {
  id: string;
  name: string;
  personaId: string; // references preset or 'custom'
  systemInstruction?: string; // overrides preset if provided
};

export type Meeting = {
  id: string;
  title: string;
  story: string; // Jira user story or description
  goals?: string;
  participants: MeetingParticipant[];
  createdAt: string;
  transcript?: string;
};
