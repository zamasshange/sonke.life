import { NextResponse } from "next/server";
import { SONKE_SYSTEM_PROMPT, sonkeChatFallback, type SonkeChatContext } from "@/lib/sonke-chat-fallback";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages: ChatMessage[];
  context: SonkeChatContext;
};

function groqModel() {
  return process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
}

export async function POST(request: Request) {
  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ source: "error", reply: "Invalid request." }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY ?? process.env.AI_API_KEY;

  const profileBlock = `Current profile:
Country: ${body.context.countryName}
Income: ${body.context.currencySymbol}${body.context.monthlyIncome.toLocaleString()}
Expenses: ${body.context.currencySymbol}${body.context.totalExpenses.toLocaleString()}
Difference: ${body.context.currencySymbol}${body.context.difference}
Living total: ${body.context.currencySymbol}${body.context.totalLiving.toLocaleString()}
Digital total: ${body.context.currencySymbol}${body.context.totalDigital.toLocaleString()}`;

  if (!apiKey) {
    return NextResponse.json({
      source: "fallback",
      reply: sonkeChatFallback(body),
      hint: "Add GROQ_API_KEY to .env.local next to package.json.",
    });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: groqModel(),
        messages: [
          {
            role: "system",
            content: SONKE_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `${profileBlock}\n\nUse these figures whenever the question is about money, affordability, or what to change.`,
          },
          ...body.messages,
        ],
        temperature: 0.45,
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("[sonke-chat] Groq error:", response.status, rawText.slice(0, 500));
      }
      throw new Error(`Groq request failed with ${response.status}`);
    }

    const data = JSON.parse(rawText) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() || sonkeChatFallback(body);

    return NextResponse.json({
      source: "ai",
      reply,
    });
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[sonke-chat]", e);
    }
    return NextResponse.json({
      source: "fallback",
      reply: sonkeChatFallback(body),
      hint: "Sonke could not reach the AI service, so this reply uses offline rules.",
    });
  }
}
