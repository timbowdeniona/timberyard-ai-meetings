import { NextResponse } from 'next/server';
import { listMeetings } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ meetings: listMeetings() });
}
