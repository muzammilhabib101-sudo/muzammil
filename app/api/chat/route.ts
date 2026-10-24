import { google, type GoogleLanguageModelOptions } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { assistantConfig, buildInstructions } from "@/lib/assistant";
import { createAssistantTools } from "@/lib/assistant-tools";
import { clientIp } from "@/lib/rate-limit";
import { isValidTimeZone } from "@/lib/timezone";

// Allow streaming responses up to 30 seconds.
export const maxDuration = 30;

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

// `thinkingLevel` only exists on Gemini 3+; older models keep their default thinking.
const googleOptions: GoogleLanguageModelOptions = /^gemini-[12]\./.test(MODEL)
  ? {}
  : { thinkingConfig: { thinkingLevel: "minimal" } };

function textLength(message: UIMessage): number {
  return message.parts.reduce((sum, part) => sum + (part.type === "text" ? part.text.length : 0), 0);
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("[chat] GOOGLE_GENERATIVE_AI_API_KEY is not set. Add it to .env.local (or Vercel env vars) and restart.");
    return Response.json({ error: "The assistant isn't configured yet." }, { status: 503 });
  }

  let messages: UIMessage[];
  let visitorTimeZone: string | undefined;
  try {
    let timezone: unknown;
    ({ messages, timezone } = (await req.json()) as { messages: UIMessage[]; timezone?: unknown });
    // Sent by the chat UI from the browser; ignored unless it is a real IANA zone.
    if (typeof timezone === "string" && isValidTimeZone(timezone)) visitorTimeZone = timezone;
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

  const tools = createAssistantTools({ ip: clientIp(req) });
  const result = streamText({
    model: google(MODEL),
    instructions: buildInstructions(new Date(), visitorTimeZone),
    // Only the most recent turns are needed for context; this also caps cost.
    messages: await convertToModelMessages(messages.slice(-assistantConfig.maxMessages), {
      tools,
      ignoreIncompleteToolCalls: true,
    }),
    tools,
    // Booking emails go out only after the visitor presses "Send request" in the chat.
    toolApproval: { requestAppointment: "user-approval" },
    // Optional: signs approvals so a tampered client can't forge one.
    experimental_toolApprovalSecret: process.env.TOOL_APPROVAL_SECRET || undefined,
    // Lets the model reply after a tool result instead of stopping at the tool call.
    stopWhen: isStepCount(4),
    maxOutputTokens: 800,
    providerOptions: { google: googleOptions },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
