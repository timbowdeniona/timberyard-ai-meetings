'use client';



import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type MeetingResponseProps = {
  transcript: string;
};

export default function MeetingResponse({ transcript }: MeetingResponseProps) {
  return (
    <div className="prose prose-invert prose-sm sm:prose-base max-w-none 
                   prose-headings:font-bold prose-headings:text-green-400 
                   prose-p:text-slate-300 
                   prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline
                   prose-strong:text-slate-200 prose-strong:font-semibold
                   prose-ul:list-disc prose-ul:pl-6
                   prose-li:marker:text-green-500
                   prose-blockquote:border-l-green-500 prose-blockquote:text-slate-400
                   prose-code:bg-black/50 prose-code:text-green-300 prose-code:p-1 prose-code:rounded-sm prose-code:font-mono
                   prose-pre:bg-black/50 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-lg prose-pre:p-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {transcript}
      </ReactMarkdown>
    </div>
  );
}
