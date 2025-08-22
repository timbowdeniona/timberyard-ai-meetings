import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Three Amigos with Gemini',
  description: 'Virtual Three Amigos meetings powered by Google Gemini',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Uncut+Sans:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-slate-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{children}</body>
    </html>
  )
}
