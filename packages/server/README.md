# server

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

// code for integrating the glm-5.1 model into the application

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '$NVIDIA_API_KEY',
  baseURL: 'https://integrate.api.nvidia.com/v1',
})
 
async function main() {
  const completion = await openai.chat.completions.create({
    model: "z-ai/glm-5.1",
    messages: [{"content":"give me 3 benefits of exercising ","role":"user"}],
    temperature: 1,
    top_p: 1,
    max_tokens: 16384,
    chat_template_kwargs: {"enable_thinking":true,"clear_thinking":false},
    stream: true
  })
   
  for await (const chunk of completion) {
        const reasoning = chunk.choices[0]?.delta?.reasoning_content;
    if (reasoning) process.stdout.write(reasoning);
        process.stdout.write(chunk.choices[0]?.delta?.content || '')
    
  }
  
}

main();