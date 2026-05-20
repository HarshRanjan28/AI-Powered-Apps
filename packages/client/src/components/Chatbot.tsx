import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { set, useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function Chatbot() {
  type FormData = {
    prompt: string;
  };
  type ChatResponse = {
    response: string;
  };
  type Messages = {
    content: string;
    role: 'user' | 'bot';
  };
  const [messages, setMessages] = useState<Messages[]>([]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    setIsBotTyping(true);
    setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
    reset();
    const { data } = await axios.post<ChatResponse>('/api/chat', { prompt });
    setMessages((prev) => [...prev, { content: data.response, role: 'bot' }]);
    setIsBotTyping(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 mt-4">
        {messages.map((msg, index) => (
          <p
            key={index}
            className={`px-3 py-1 rounded-xl ${msg.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </p>
        ))}
        {isBotTyping && (
          <div className="flex self-start px-3 py-3 bg-gray-200 rounded-xl">
            <div className="animate-pulse h-2 bg-gray-300 rounded-full w-10 self-start"></div>
            <div className="animate-pulse h-2 bg-gray-300 rounded-full w-10 self-start"></div>
            <div className="animate-pulse h-2 bg-gray-300 rounded-full w-10 self-start"></div>
          </div>
        )}
      </div>
      <form
        className="flex flex-col gap-2 items-end border-2 rounded-3xl p-4"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => onKeyDown(e)}
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything"
          maxLength={1000}
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
}

export default Chatbot;
