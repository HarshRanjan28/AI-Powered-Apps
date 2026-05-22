import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Messages = {
  content: string;
  role: 'user' | 'bot';
};

type Props = {
  messages: Messages[];
};

export function ChatMessages({ messages }: Props) {
  const lastParagraphRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastParagraphRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg, index) => (
        <div
          key={index}
          ref={index === messages.length - 1 ? lastParagraphRef : null}
          className={`px-3 py-1 rounded-xl ${msg.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}
        >
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}
