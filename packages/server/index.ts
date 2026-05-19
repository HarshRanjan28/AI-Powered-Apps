import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { OpenRouter } from '@openrouter/sdk';
import type { ChatResult } from '@openrouter/sdk/models';
import z from 'zod';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const openrouter = new OpenRouter({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!!!');
});

app.get('/api/greet', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the server!' });
});

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt cannot be empty')
    .max(1000, 'Prompt cannot exceed 1000 characters'),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parseResult = chatSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.format() });
  }
  const { prompt } = req.body;

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
  res.json({
    response: (response as ChatResult)?.choices?.[0]?.message?.content,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
