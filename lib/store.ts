import { Meeting } from '@/types';

const meetings = new Map<string, Meeting>();

export function saveMeeting(m: Meeting) {
  meetings.set(m.id, m);
}
export function getMeeting(id: string) {
  return meetings.get(id);
}
export function listMeetings() {
  return Array.from(meetings.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
