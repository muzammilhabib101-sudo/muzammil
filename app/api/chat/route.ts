import { google, type GoogleLanguageModelOptions } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { assistantConfig, buildInstructions } from "@/lib/assistant";

// Allow streaming responses up to 30 seconds.
export const maxDuration = 30;

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const instructions = buildInstructions();

function textLength(message: UIMessage): number {
  return message.parts.reduce((sum, part) => sum + (part.type === "text" ? part.text.length : 0), 0);
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("[chat] GOOGLE_GENERATIVE_AI_API_KEY is not set. Add it to .env.local (or Vercel env vars) and restart.");
    return Response.json({ error: "The assistant isn't configured yet." }, { status: 503 });
  }

  let messages: UIMessage[];
  try {
    ({ messages } = (await req.json()) as { messages: UIMessage[] });
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.some((message) => message.role === "system" || !Array.isArray(message.parts))
  ) {
    return Response.json({ error: "Invalid messages." }, { status: 400 });
  }
  if (messages.some((message) => textLength(message) > assistantConfig.maxMessageChars)) {
    return Response.json({ error: "That message is too long." }, { status: 413 });
  }

  const result = streamText({
    model: google(MODEL),
    instructions,
    // Only the most recent turns are needed for context; this also caps cost.
    messages: await convertToModelMessages(messages.slice(-assistantConfig.maxMessages)),
    maxOutputTokens: 800,
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel: "minimal" } } satisfies GoogleLanguageModelOptions,
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
