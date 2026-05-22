import { OpenRouter } from '@openrouter/sdk';
import fs from 'fs';
import path from 'path';
import template from '../prompts/chatBot.txt';

interface ChatResponse {
  id: string;
  message: string;
}

//Implementation Detail
const openrouter = new OpenRouter({
  apiKey: process.env.OPENAI_API_KEY,
});

const parkInfo = fs.readFileSync(
  path.join(__dirname, '../prompts/WonderWorld.md'),
  'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

//Public Interface
export const chatService = {
  sendMessage: async (prompt: string): Promise<ChatResponse> => {
    const response = await openrouter.chat.send({
      chatRequest: {
        model: 'openrouter/free',
        messages: [
          {
            role: 'system',
            content: instructions,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
      },
    });
    return {
      id: response.id,
      message: response?.choices?.[0]?.message?.content || '',
    };
  },
};
