import { GoogleGenAI } from '@google/genai';

export function getGenAI() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not set. Create a key in Google AI Studio and add it to .env');
  }
  return new GoogleGenAI({ apiKey });
}

export function getModelName() {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
}
