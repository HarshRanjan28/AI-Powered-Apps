import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

//Implementation Detail
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt cannot be empty')
    .max(1000, 'Prompt cannot exceed 1000 characters'),
});

//Public Interface
export const chatController = {
  sendMessage: async (req: Request, res: Response) => {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.format() });
    }
    const { prompt } = req.body;
    const response = await chatService.sendMessage(prompt);

    res.json({
      response: response.message,
    });
  },
};
