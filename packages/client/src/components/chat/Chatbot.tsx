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
  const [streamingText, setStreamingText] = useState<string>();
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
      const response = await axios.post<ChatResponse>('/api/chat', { prompt });

      notificationMusic.play();
      const reader = new ReadableStream({
        start(controller) {
          const text = response.data.response;
          let index = 0;
          const interval = setInterval(() => {
            if (index < text.length) {
              setStreamingText((prev) => (prev || '') + '' + text[index]);
              index++;
            } else {
              clearInterval(interval);
              controller.close();
            }
          }, 20);
        },
      });
      await reader.getReader().read();
      console.log('Streaming complete', reader);
      const textDecoder = new TextDecoder();
      let currentBuffer = '';
      while (true) {
        const { done, value } = await reader.getReader().read();
        if (done) break;
        currentBuffer += textDecoder.decode(value);
        setStreamingText(currentBuffer);
      }
      setStreamingText('');
      setMessages((prev) => [
        ...prev,
        { content: response.data.response, role: 'bot' },
      ]);
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
        <ChatMessages messages={messages} streamingText={streamingText} />
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
}

export default Chatbot;
