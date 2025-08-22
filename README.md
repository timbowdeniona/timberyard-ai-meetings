# Three Amigos — Gemini + Next.js Scaffold

Spin up virtual "Three Amigos" meetings among personas (Developer, QA Tester, Product Owner, Project Manager — or your own custom "gems") to refine Jira user stories and produce acceptance criteria.

## Features
- Next.js (App Router) + TypeScript
- Server-side call to Gemini via the **Google Gen AI SDK (`@google/genai`)**
- Preset personas for Dev/QA/PO/PM; add any number of custom participants
- Generates a realistic, concise meeting transcript + Gherkin AC + actions
- Minimal in-memory storage for quick prototyping (replace with DB later)

---

## 1) Prerequisites
- Node.js 18+
- A Gemini API key from **Google AI Studio**.

### Get your Gemini API key
1. Visit **Google AI Studio** and create a key: https://aistudio.google.com/app/apikey  
2. Copy `.env.example` to `.env` and set your key:
   ```bash
   cp .env.example .env
   # paste your key
   ```

> Tip: By default we use `gemini-2.5-flash`. You can switch to `gemini-2.5-pro` by changing `GEMINI_MODEL` in `.env`.

---

## 2) Run the app
```bash
npm i
npm run dev
# open http://localhost:3000
```

---

## 3) How it works
- The API route **`/api/run-meeting`** builds a focused facilitation prompt using:
  - Each participant’s system instructions (preset or custom)
  - Your Jira story and optional goals
- It calls the Gemini model via the **Google Gen AI SDK** and returns a transcript.
- Meetings are stored in a simple in-memory Map (see `lib/store.ts`). Replace with a database for persistence.

**Key files**
- `lib/gemini.ts` – initializes the SDK using `GOOGLE_API_KEY`
- `components/personaPresets.ts` – built-in Three Amigos personas
- `components/MeetingForm.tsx` – create a meeting and run it
- `app/api/run-meeting/route.ts` – server endpoint that calls Gemini

---

## 4) Extending for other meeting types
- Add new persona presets or templates in `components/personaPresets.ts`
- Add form fields for agenda/inputs and incorporate them into the prompt
- Swap the in-memory store for your DB of choice (e.g., Prisma + Postgres)
- Consider streaming responses for live typing UX

---

## 5) Notes on "Gems"
Google's consumer “Gems” product is a way to save custom instructions in Gemini. In the public developer API you achieve the same effect by passing **system instructions** per participant — exactly what this scaffold does. If/when a direct “Gems API” becomes available for programmatic selection of your saved Gems, you can map those to participants here.

---

## 6) Security
- Keep your API key on the server (never expose it to the browser).
- Consider rate limiting and auth before exposing this to a team.

---

## 7) Troubleshooting
- **`GOOGLE_API_KEY is not set`** → create `.env` with your key.
- **Model errors** → try switching model (e.g., `gemini-2.5-pro`) in `.env`.
- Node <18 → upgrade Node.

---

## License
MIT
