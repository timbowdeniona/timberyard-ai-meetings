import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Three Amigos with Gemini',
  description: 'Virtual Three Amigos meetings powered by Google Gemini',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-w-4xl mx-auto p-6">{children}</body>
    </html>
  )
}
