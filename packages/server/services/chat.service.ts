import { OpenRouter } from '@openrouter/sdk';

interface ChatResponse {
  id: string;
  message: string;
}

//Implementation Detail
const openrouter = new OpenRouter({
  apiKey: process.env.OPENAI_API_KEY,
});

//Public Interface
export const chatService = {
  sendMessage: async (prompt: string): Promise<ChatResponse> => {
    const response = await openrouter.chat.send({
      chatRequest: {
        model: 'openrouter/free',
        messages: [
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
