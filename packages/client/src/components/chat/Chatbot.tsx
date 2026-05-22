import axios from 'axios';
import { useState } from 'react';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessages, type Messages } from './ChatMessages';
import type { ChatFormData } from './ChatInput';
import ChatInput from './ChatInput';
import popSound from '../../assets/pop.mp3';
import notificationSound from '../../assets/notification.mp3';

function Chatbot() {
  type ChatResponse = {
    response: string;
  };

  const [messages, setMessages] = useState<Messages[]>([]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const popMusic = new Audio(popSound);
  popMusic.volume = 0.5;
  const notificationMusic = new Audio(notificationSound);
  notificationMusic.volume = 0.5;

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setError('');
      setIsBotTyping(true);
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      popMusic.play();
      const { data } = await axios.post<ChatResponse>('/api/chat', { prompt });
      setMessages((prev) => [...prev, { content: data.response, role: 'bot' }]);
      notificationMusic.play();
    } catch (error) {
      console.log(error);
      setError('Failed to send message');
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
}

export default Chatbot;
